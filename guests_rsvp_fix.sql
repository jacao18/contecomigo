-- ══════════════════════════════════════════════════════════════════
--  Correção RSVP — políticas de UPDATE/DELETE em public.guests
--
--  PROBLEMA: a tabela guests só tinha políticas de INSERT e SELECT.
--  Sem política de UPDATE, quando um convidado que já respondeu voltava
--  e mudava a resposta (ex.: "não" -> "sim"), o UPDATE era BLOQUEADO pelo
--  RLS silenciosamente (0 linhas, sem erro). A tela mostrava sucesso, mas
--  o banco mantinha o valor antigo -> confirmação contava como "rejeitado".
--  A mesma ausência impedia o dono de editar o status pelo painel.
--
--  Rodar no SQL Editor do Supabase.
-- ══════════════════════════════════════════════════════════════════

-- 1) Convidado pode ATUALIZAR o próprio RSVP em convite publicado
--    (mesmo nível de confiança do INSERT anônimo já existente)
drop policy if exists "Convidado atualiza próprio RSVP" on public.guests;
create policy "Convidado atualiza próprio RSVP"
  on public.guests for update
  using      (exists (select 1 from public.invites where id = invite_id and published = true))
  with check (exists (select 1 from public.invites where id = invite_id and published = true));

-- 2) Dono do convite pode EDITAR convidados (marcar presença no painel)
drop policy if exists "Dono edita convidados" on public.guests;
create policy "Dono edita convidados"
  on public.guests for update
  using      (exists (select 1 from public.invites where id = invite_id and user_id = auth.uid()))
  with check (exists (select 1 from public.invites where id = invite_id and user_id = auth.uid()));

-- 3) Dono do convite pode REMOVER convidados
drop policy if exists "Dono deleta convidados" on public.guests;
create policy "Dono deleta convidados"
  on public.guests for delete
  using (exists (select 1 from public.invites where id = invite_id and user_id = auth.uid()));

-- 4) Realtime: refletir UPDATE/DELETE ao vivo no dashboard.
--    replica identity full garante que o payload traga os dados necessários.
alter table public.guests replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.guests;
exception
  when duplicate_object then null;  -- já estava na publicação
end $$;

-- ── NOTA DE SEGURANÇA ─────────────────────────────────────────────
-- A política (1) permite que qualquer visitante de um convite publicado
-- atualize linhas de guests desse convite (paridade com o INSERT anônimo
-- que já existia). Como o app localiza a linha pelo telefone, o abuso
-- casual é limitado, mas se quiser blindar depois, o caminho é exigir um
-- token por convidado ou mover o RSVP para uma Edge Function com service role.
