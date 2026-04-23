-- =====================================================
-- ConteComigo — Custom Templates Migration
-- Execute no Supabase SQL Editor (Dashboard > SQL)
-- =====================================================

-- 1. Criar tabela
CREATE TABLE IF NOT EXISTS public.custom_templates (
  id                   uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name                 text NOT NULL,
  category             text NOT NULL DEFAULT 'custom',
  html_template        text,
  editable_fields      jsonb DEFAULT '[]'::jsonb,
  default_accent       text DEFAULT '#FFD93D',
  default_bg           text DEFAULT 'dark-purple',
  supports_hero_upload boolean DEFAULT false,
  preview_img          text,
  active               boolean DEFAULT true,
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now()
);

-- 2. Trigger para updated_at automático
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS custom_templates_updated_at ON public.custom_templates;
CREATE TRIGGER custom_templates_updated_at
  BEFORE UPDATE ON public.custom_templates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Row Level Security
ALTER TABLE public.custom_templates ENABLE ROW LEVEL SECURITY;

-- Remover policies antigas (caso re-execute)
DROP POLICY IF EXISTS "read active templates"  ON public.custom_templates;
DROP POLICY IF EXISTS "admin full access"       ON public.custom_templates;

-- Usuários autenticados podem ler templates ativos
CREATE POLICY "read active templates"
  ON public.custom_templates
  FOR SELECT
  USING (active = true);

-- Admin pode fazer tudo (INSERT / UPDATE / DELETE / SELECT)
CREATE POLICY "admin full access"
  ON public.custom_templates
  FOR ALL
  USING (auth.jwt() ->> 'email' = 'jkauer1811@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'jkauer1811@gmail.com');

-- 4. Índice para performance
CREATE INDEX IF NOT EXISTS custom_templates_category_idx ON public.custom_templates (category);
CREATE INDEX IF NOT EXISTS custom_templates_active_idx   ON public.custom_templates (active);

-- =====================================================
-- Verificação — rode para confirmar que funcionou:
-- SELECT * FROM public.custom_templates LIMIT 5;
-- =====================================================
