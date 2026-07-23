-- Adiciona a opção "não exibir os detalhes da festa" para os templates de convite pronto
-- (convite-proprio-v / convite-proprio-h). Quando true, o bloco de dados abaixo da
-- imagem não é renderizado no convite publicado.
ALTER TABLE invites
  ADD COLUMN IF NOT EXISTS hide_details boolean NOT NULL DEFAULT false;
