-- ══════════════════════════════════════════
--  ConteComigo — Schema Update v2
--  Execute no Supabase SQL Editor
-- ══════════════════════════════════════════

-- 1. NOVAS COLUNAS NA TABELA INVITES
alter table public.invites
  add column if not exists music_url      text,          -- URL do YouTube para música de fundo
  add column if not exists gallery_urls   jsonb,         -- Array de URLs de fotos da galeria
  add column if not exists pix_key        text,          -- Chave PIX do anfitrião
  add column if not exists closed_list    boolean default false,  -- Lista fechada (só convidados aprovados)
  add column if not exists wishes_enabled boolean default true;   -- Habilitar mural de desejos

-- 2. TABELA WISHES (mural de mensagens/desejos)
create table if not exists public.wishes (
  id          uuid primary key default gen_random_uuid(),
  invite_id   uuid references public.invites(id) on delete cascade not null,
  name        text not null,
  message     text not null,
  emoji       text default '💕',
  created_at  timestamptz default now()
);

-- 3. RLS para WISHES
alter table public.wishes enable row level security;

create policy "Qualquer um pode ver desejos de convite público"
  on public.wishes for select using (
    exists (select 1 from public.invites where id = invite_id and published = true)
  );

create policy "Qualquer um pode enviar desejo para convite público"
  on public.wishes for insert with check (
    exists (select 1 from public.invites where id = invite_id and published = true)
  );

create policy "Dono vê desejos de seus convites"
  on public.wishes for select using (
    exists (select 1 from public.invites where id = invite_id and user_id = auth.uid())
  );

create policy "Dono deleta desejos"
  on public.wishes for delete using (
    exists (select 1 from public.invites where id = invite_id and user_id = auth.uid())
  );
