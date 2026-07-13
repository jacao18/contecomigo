-- Adiciona coluna builtin_id na tabela custom_templates
-- Usada para linkar um template custom que é uma edição/remoção de um builtin (sistema)
-- Isso permite que o admin salve edições no Supabase e o editor as reflita automaticamente

ALTER TABLE custom_templates
ADD COLUMN IF NOT EXISTS builtin_id TEXT DEFAULT NULL;

-- Constraint UNIQUE necessária para o upsert por builtin_id funcionar (deleteBuiltin)
ALTER TABLE custom_templates
ADD CONSTRAINT IF NOT EXISTS custom_templates_builtin_id_unique UNIQUE (builtin_id);

-- Índice para lookup rápido
CREATE INDEX IF NOT EXISTS idx_custom_templates_builtin_id
ON custom_templates (builtin_id);
