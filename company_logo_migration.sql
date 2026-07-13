-- ══════════════════════════════════════════════════════════════════
--  ConteComigo — Logo da empresa
--  Adiciona companies.logo_url + bucket Storage 'company-logos'
--  Execute INTEIRO no Supabase SQL Editor.
-- ══════════════════════════════════════════════════════════════════

-- 1. Coluna logo_url em companies
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS logo_url text;

-- 2. Bucket Storage público para logos das empresas
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Policies do Storage:
--    - Qualquer um pode LER (bucket público para servir o logo nas páginas).
--    - Apenas o dono da empresa pode INSERIR/ATUALIZAR/DELETAR no path
--      da própria empresa (path começa com <company_id>/).

-- Limpa policies anteriores (idempotente)
DROP POLICY IF EXISTS "company-logos public read"   ON storage.objects;
DROP POLICY IF EXISTS "company-logos owner insert"  ON storage.objects;
DROP POLICY IF EXISTS "company-logos owner update"  ON storage.objects;
DROP POLICY IF EXISTS "company-logos owner delete"  ON storage.objects;

CREATE POLICY "company-logos public read" ON storage.objects FOR SELECT
  USING (bucket_id = 'company-logos');

CREATE POLICY "company-logos owner insert" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'company-logos'
    AND EXISTS (
      SELECT 1 FROM public.companies c
      WHERE c.owner_id = auth.uid()
        AND (storage.foldername(name))[1] = c.id::text
    )
  );

CREATE POLICY "company-logos owner update" ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'company-logos'
    AND EXISTS (
      SELECT 1 FROM public.companies c
      WHERE c.owner_id = auth.uid()
        AND (storage.foldername(name))[1] = c.id::text
    )
  );

CREATE POLICY "company-logos owner delete" ON storage.objects FOR DELETE
  USING (
    bucket_id = 'company-logos'
    AND EXISTS (
      SELECT 1 FROM public.companies c
      WHERE c.owner_id = auth.uid()
        AND (storage.foldername(name))[1] = c.id::text
    )
  );
