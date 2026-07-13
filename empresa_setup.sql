-- ══════════════════════════════════════════════════════════════════
--  ConteComigo — Plano Empresarial — Migração SQL
--  Execute no Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════════

-- ── 1. TABELA DE EMPRESAS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.companies (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name         text NOT NULL,
  email        text NOT NULL UNIQUE,
  owner_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  plan         text NOT NULL DEFAULT 'enterprise',
  active       boolean DEFAULT true,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Empresa vê/edita apenas seus próprios dados
CREATE POLICY "company owner read"   ON public.companies FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "company owner update" ON public.companies FOR UPDATE USING (owner_id = auth.uid());

-- ── 2. TABELA DE CÓDIGOS DE CONVITE ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.company_codes (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id   uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  code         text NOT NULL UNIQUE,
  used_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at      timestamptz,
  expires_at   timestamptz,
  active       boolean DEFAULT true,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE public.company_codes ENABLE ROW LEVEL SECURITY;

-- SELECT unificado: dono da empresa vê todos os seus códigos;
-- qualquer autenticado vê códigos ainda válidos (para validar no cadastro)
CREATE POLICY "company_codes select" ON public.company_codes FOR SELECT USING (
  -- dono da empresa vê todos os seus códigos
  company_id IN (SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid())
  OR
  -- qualquer usuário autenticado pode verificar código disponível
  (active = true AND used_by IS NULL AND (expires_at IS NULL OR expires_at > now()))
);

CREATE POLICY "company_codes insert" ON public.company_codes FOR INSERT WITH CHECK (
  company_id IN (SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid())
);

CREATE POLICY "company_codes update" ON public.company_codes FOR UPDATE USING (
  company_id IN (SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid())
);

CREATE POLICY "company_codes delete" ON public.company_codes FOR DELETE USING (
  company_id IN (SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid())
);

-- ── 3. TABELA DE PERFIS ───────────────────────────────────────────
-- Estende auth.users com plano e vínculo empresarial
CREATE TABLE IF NOT EXISTS public.profiles (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan         text NOT NULL DEFAULT 'free',   -- 'free' | 'pro' | 'enterprise_member'
  company_id   uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  full_name    text,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- SELECT unificado: usuário vê o próprio perfil OU empresa vê perfis de seus membros
CREATE POLICY "profiles select" ON public.profiles FOR SELECT USING (
  -- o próprio usuário
  id = auth.uid()
  OR
  -- dono da empresa vê seus membros (usando alias explícito para evitar ambiguidade)
  EXISTS (
    SELECT 1 FROM public.companies c
    WHERE c.id = profiles.company_id
      AND c.owner_id = auth.uid()
  )
);

CREATE POLICY "profile self update" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "profile insert"      ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());

-- ── 4. ADICIONAR company_id NA TABELA INVITES ─────────────────────
ALTER TABLE public.invites
  ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL;

-- ── 5. ADICIONAR is_animated NA TABELA CUSTOM_TEMPLATES ───────────
ALTER TABLE public.custom_templates
  ADD COLUMN IF NOT EXISTS is_animated boolean DEFAULT false;

-- ── 6. TRIGGER: criar perfil automaticamente ao cadastrar ─────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, plan, full_name)
  VALUES (
    NEW.id,
    'free',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 7. FUNÇÃO: usar código e vincular usuário à empresa ───────────
CREATE OR REPLACE FUNCTION public.use_company_code(p_code text, p_user_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_code    public.company_codes%ROWTYPE;
  v_company public.companies%ROWTYPE;
BEGIN
  -- Busca o código válido
  SELECT * INTO v_code
  FROM public.company_codes
  WHERE code = p_code
    AND active = true
    AND used_by IS NULL
    AND (expires_at IS NULL OR expires_at > now());

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Código inválido ou já utilizado.');
  END IF;

  -- Busca a empresa
  SELECT * INTO v_company
  FROM public.companies
  WHERE id = v_code.company_id AND active = true;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Empresa não encontrada ou inativa.');
  END IF;

  -- Marca o código como usado
  UPDATE public.company_codes
  SET used_by = p_user_id, used_at = now()
  WHERE id = v_code.id;

  -- Atualiza o perfil do usuário
  INSERT INTO public.profiles (id, plan, company_id)
  VALUES (p_user_id, 'enterprise_member', v_code.company_id)
  ON CONFLICT (id) DO UPDATE
    SET plan = 'enterprise_member', company_id = EXCLUDED.company_id;

  RETURN jsonb_build_object(
    'ok',           true,
    'company_id',   v_company.id,
    'company_name', v_company.name
  );
END;
$$;

-- ── 8. VIEW: métricas para o dashboard empresarial ────────────────
CREATE OR REPLACE VIEW public.company_metrics AS
SELECT
  c.id                                                          AS company_id,
  c.name                                                        AS company_name,

  -- Total de códigos gerados
  COUNT(DISTINCT cc.id)                                         AS total_codes,

  -- Membros que já criaram pelo menos 1 convite
  COUNT(DISTINCT CASE WHEN inv_count.cnt > 0 THEN p.id END)    AS clients_active,

  -- Total de membros vinculados
  COUNT(DISTINCT p.id)                                          AS clients_total,

  -- Total de convites criados
  COALESCE(SUM(inv_count.cnt), 0)                              AS total_invites,

  -- Total de convidados
  COALESCE(SUM(g_count.cnt), 0)                                AS total_guests

FROM public.companies c
LEFT JOIN public.company_codes cc    ON cc.company_id = c.id
LEFT JOIN public.profiles p          ON p.company_id  = c.id
LEFT JOIN LATERAL (
  SELECT COUNT(*) AS cnt
  FROM public.invites i
  WHERE i.user_id = p.id
) inv_count ON true
LEFT JOIN LATERAL (
  SELECT COUNT(*) AS cnt
  FROM public.guests gs
  JOIN public.invites i ON i.id = gs.invite_id
  WHERE i.user_id = p.id
) g_count ON true
GROUP BY c.id, c.name;

GRANT SELECT ON public.company_metrics TO authenticated;

-- ── 9. FUNÇÃO: série temporal de festas por mês ───────────────────
CREATE OR REPLACE FUNCTION public.company_monthly_stats(p_company_id uuid, p_months int DEFAULT 12)
RETURNS TABLE(
  month        text,
  year_num     int,
  month_num    int,
  festas       bigint,
  convidados   bigint
) LANGUAGE sql SECURITY DEFINER AS $$
  SELECT
    TO_CHAR(DATE_TRUNC('month', i.created_at), 'Mon/YY') AS month,
    EXTRACT(YEAR  FROM i.created_at)::int                 AS year_num,
    EXTRACT(MONTH FROM i.created_at)::int                 AS month_num,
    COUNT(DISTINCT i.id)                                  AS festas,
    COUNT(g.id)                                           AS convidados
  FROM public.invites i
  JOIN public.profiles p
    ON p.id = i.user_id AND p.company_id = p_company_id
  LEFT JOIN public.guests g ON g.invite_id = i.id
  WHERE i.created_at >= NOW() - (p_months || ' months')::interval
  GROUP BY DATE_TRUNC('month', i.created_at), year_num, month_num
  ORDER BY DATE_TRUNC('month', i.created_at);
$$;
