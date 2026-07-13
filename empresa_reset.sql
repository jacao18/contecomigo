-- ══════════════════════════════════════════════════════════════════
--  ConteComigo — Plano Empresarial — RESET + MIGRAÇÃO COMPLETA
--  Desfaz tudo que possa ter sido criado e recria do zero.
--  Execute INTEIRO no Supabase SQL Editor.
-- ══════════════════════════════════════════════════════════════════

-- ── DESFAZER TUDO ─────────────────────────────────────────────────

-- Policies (drop explícito para evitar "already exists")
DROP POLICY IF EXISTS "company owner read"    ON public.companies;
DROP POLICY IF EXISTS "company owner update"  ON public.companies;
DROP POLICY IF EXISTS "company codes read"    ON public.company_codes;
DROP POLICY IF EXISTS "company codes insert"  ON public.company_codes;
DROP POLICY IF EXISTS "company codes update"  ON public.company_codes;
DROP POLICY IF EXISTS "company codes delete"  ON public.company_codes;
DROP POLICY IF EXISTS "codes public read"     ON public.company_codes;
DROP POLICY IF EXISTS "company_codes select"  ON public.company_codes;
DROP POLICY IF EXISTS "company_codes insert"  ON public.company_codes;
DROP POLICY IF EXISTS "company_codes update"  ON public.company_codes;
DROP POLICY IF EXISTS "company_codes delete"  ON public.company_codes;
DROP POLICY IF EXISTS "profile self read"     ON public.profiles;
DROP POLICY IF EXISTS "profile self update"   ON public.profiles;
DROP POLICY IF EXISTS "profile insert"        ON public.profiles;
DROP POLICY IF EXISTS "profiles select"       ON public.profiles;
DROP POLICY IF EXISTS "company reads members" ON public.profiles;

-- Funções e trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.use_company_code(text, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.company_monthly_stats(uuid, int) CASCADE;

-- View
DROP VIEW IF EXISTS public.company_metrics CASCADE;

-- Colunas adicionadas em tabelas existentes
ALTER TABLE public.invites        DROP COLUMN IF EXISTS company_id;
ALTER TABLE public.custom_templates DROP COLUMN IF EXISTS is_animated;

-- Tabelas (ordem importa por causa das FK)
DROP TABLE IF EXISTS public.profiles      CASCADE;
DROP TABLE IF EXISTS public.company_codes CASCADE;
DROP TABLE IF EXISTS public.companies     CASCADE;

-- ── 1. TABELA DE EMPRESAS ──────────────────────────────────────────
CREATE TABLE public.companies (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text NOT NULL,
  email      text NOT NULL UNIQUE,
  owner_id   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  plan       text NOT NULL DEFAULT 'enterprise',
  active     boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company owner read"   ON public.companies FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "company owner update" ON public.companies FOR UPDATE USING (owner_id = auth.uid());

-- ── 2. TABELA DE CÓDIGOS DE CONVITE ───────────────────────────────
CREATE TABLE public.company_codes (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  code       text NOT NULL UNIQUE,
  used_by    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at    timestamptz,
  expires_at timestamptz,
  active     boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.company_codes ENABLE ROW LEVEL SECURITY;

-- SELECT único: dono vê todos os seus códigos OU qualquer um vê código disponível
CREATE POLICY "company_codes select" ON public.company_codes FOR SELECT USING (
  company_id IN (SELECT c.id FROM public.companies c WHERE c.owner_id = auth.uid())
  OR
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
CREATE TABLE public.profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan       text NOT NULL DEFAULT 'free',
  company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  full_name  text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- SELECT único: próprio usuário OU dono da empresa vê seus membros
CREATE POLICY "profiles select" ON public.profiles FOR SELECT USING (
  id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM public.companies c
    WHERE c.id = profiles.company_id
      AND c.owner_id = auth.uid()
  )
);

CREATE POLICY "profile self update" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "profile insert"      ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());

-- ── 4. COLUNAS EM TABELAS EXISTENTES ──────────────────────────────
ALTER TABLE public.invites
  ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL;

ALTER TABLE public.custom_templates
  ADD COLUMN IF NOT EXISTS is_animated boolean DEFAULT false;

-- ── 5. TRIGGER: criar perfil ao cadastrar ─────────────────────────
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 6. FUNÇÃO: usar código e vincular usuário ─────────────────────
CREATE OR REPLACE FUNCTION public.use_company_code(p_code text, p_user_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_code    public.company_codes%ROWTYPE;
  v_company public.companies%ROWTYPE;
BEGIN
  SELECT * INTO v_code
  FROM public.company_codes
  WHERE code = p_code
    AND active = true
    AND used_by IS NULL
    AND (expires_at IS NULL OR expires_at > now());

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Código inválido ou já utilizado.');
  END IF;

  SELECT * INTO v_company
  FROM public.companies
  WHERE id = v_code.company_id AND active = true;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Empresa não encontrada ou inativa.');
  END IF;

  UPDATE public.company_codes
  SET used_by = p_user_id, used_at = now()
  WHERE id = v_code.id;

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

-- ── 7. VIEW: métricas do dashboard empresarial ────────────────────
CREATE OR REPLACE VIEW public.company_metrics AS
SELECT
  c.id                                                       AS company_id,
  c.name                                                     AS company_name,
  COUNT(DISTINCT cc.id)                                      AS total_codes,
  COUNT(DISTINCT CASE WHEN inv_count.cnt > 0 THEN p.id END)  AS clients_active,
  COUNT(DISTINCT p.id)                                       AS clients_total,
  COALESCE(SUM(inv_count.cnt), 0)                           AS total_invites,
  COALESCE(SUM(g_count.cnt),   0)                           AS total_guests
FROM public.companies c
LEFT JOIN public.company_codes cc ON cc.company_id = c.id
LEFT JOIN public.profiles p       ON p.company_id  = c.id
LEFT JOIN LATERAL (
  SELECT COUNT(*) AS cnt FROM public.invites i WHERE i.user_id = p.id
) inv_count ON true
LEFT JOIN LATERAL (
  SELECT COUNT(*) AS cnt
  FROM public.guests gs
  JOIN public.invites i ON i.id = gs.invite_id
  WHERE i.user_id = p.id
) g_count ON true
GROUP BY c.id, c.name;

GRANT SELECT ON public.company_metrics TO authenticated;

-- ── 8. FUNÇÃO: série temporal por mês ────────────────────────────
CREATE OR REPLACE FUNCTION public.company_monthly_stats(p_company_id uuid, p_months int DEFAULT 12)
RETURNS TABLE(
  month      text,
  year_num   int,
  month_num  int,
  festas     bigint,
  convidados bigint
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
