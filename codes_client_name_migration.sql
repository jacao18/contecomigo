-- ══════════════════════════════════════════════════════════════════
--  ConteComigo — Coluna client_name em company_codes
--  Permite à empresa associar um nome ao código gerado.
--  Execute no Supabase SQL Editor.
-- ══════════════════════════════════════════════════════════════════

ALTER TABLE public.company_codes
  ADD COLUMN IF NOT EXISTS client_name text;

-- Garante que a policy de DELETE existe (caso o role_migration.sql
-- ainda não tenha sido aplicado nesta base).
DROP POLICY IF EXISTS "company_codes delete" ON public.company_codes;
CREATE POLICY "company_codes delete" ON public.company_codes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.companies c
      WHERE c.id = company_codes.company_id
        AND c.owner_id = auth.uid()
    )
  );
