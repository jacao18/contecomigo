-- Adicionar coluna `categories` (array de categorias) à tabela custom_templates
-- Mantém compatibilidade com a coluna `category` existente

ALTER TABLE public.custom_templates
ADD COLUMN IF NOT EXISTS categories text[] DEFAULT '{}';

-- Popular `categories` a partir de `category` para registros existentes
UPDATE public.custom_templates
SET categories = ARRAY[category]
WHERE categories = '{}' OR categories IS NULL;

-- Confirmar
SELECT id, name, category, categories FROM custom_templates;
