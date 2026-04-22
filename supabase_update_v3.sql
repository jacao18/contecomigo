-- ══════════════════════════════════════════
--  ConteComigo — Schema Update v3
--  Execute no Supabase SQL Editor
-- ══════════════════════════════════════════

-- 1. Nova coluna bg_key na tabela invites (guarda o nome do gradiente selecionado)
ALTER TABLE public.invites
  ADD COLUMN IF NOT EXISTS bg_key text DEFAULT 'dark-purple';

-- 2. Nova coluna photo_url na tabela gifts (foto do produto em vez de emoji)
ALTER TABLE public.gifts
  ADD COLUMN IF NOT EXISTS photo_url text;

-- 3. Criar bucket de imagens no Supabase Storage (rodar UMA vez)
-- Se já existir, ignore este bloco
INSERT INTO storage.buckets (id, name, public)
VALUES ('invite-images', 'invite-images', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Policies do bucket (imagens públicas, upload por usuário autenticado)
CREATE POLICY "Imagens públicas" ON storage.objects
  FOR SELECT USING (bucket_id = 'invite-images');

CREATE POLICY "Upload por usuário autenticado" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'invite-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Dono deleta suas imagens" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'invite-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
