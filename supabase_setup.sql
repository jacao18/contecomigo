-- ══════════════════════════════════════════
--  ConteComigo — Supabase Schema Setup
-- ══════════════════════════════════════════

-- 1. PROFILES (extends auth.users)
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text,
  email       text,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- 2. INVITES
create table if not exists public.invites (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  slug        text unique not null,
  title       text not null,
  event_name  text,
  event_type  text,
  event_date  date,
  event_time  text,
  location    text,
  dress_code  text,
  message     text,
  rsvp_deadline date,
  accent      text default '#FF3D6B',
  bg_gradient text,
  template    text,
  photo_url   text,
  visibility  text default 'public',
  published   boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 3. GUESTS (RSVPs)
create table if not exists public.guests (
  id          uuid primary key default gen_random_uuid(),
  invite_id   uuid references public.invites(id) on delete cascade not null,
  name        text not null,
  phone       text,
  attending   text not null check (attending in ('yes','no','maybe')),
  plus_ones   int default 0,
  message     text,
  created_at  timestamptz default now()
);

-- 4. GIFTS
create table if not exists public.gifts (
  id           uuid primary key default gen_random_uuid(),
  invite_id    uuid references public.invites(id) on delete cascade not null,
  name         text not null,
  price        text,
  emoji        text default '🎁',
  link         text,
  reserved     boolean default false,
  reserved_by  text,
  reserved_phone text,
  created_at   timestamptz default now()
);

-- ══════════════════════════════════════════
--  ROW LEVEL SECURITY
-- ══════════════════════════════════════════

alter table public.profiles enable row level security;
alter table public.invites  enable row level security;
alter table public.guests   enable row level security;
alter table public.gifts    enable row level security;

-- PROFILES
create policy "Usuário vê próprio perfil"
  on public.profiles for select using (auth.uid() = id);
create policy "Usuário edita próprio perfil"
  on public.profiles for update using (auth.uid() = id);
create policy "Usuário cria próprio perfil"
  on public.profiles for insert with check (auth.uid() = id);

-- INVITES
create policy "Dono vê seus convites"
  on public.invites for select using (auth.uid() = user_id);
create policy "Convites públicos são visíveis por todos"
  on public.invites for select using (published = true);
create policy "Dono cria convites"
  on public.invites for insert with check (auth.uid() = user_id);
create policy "Dono edita seus convites"
  on public.invites for update using (auth.uid() = user_id);
create policy "Dono deleta seus convites"
  on public.invites for delete using (auth.uid() = user_id);

-- GUESTS (qualquer um pode criar RSVP, só o dono do convite vê)
create policy "Qualquer um pode confirmar presença"
  on public.guests for insert with check (true);
create policy "Dono do convite vê os convidados"
  on public.guests for select using (
    exists (select 1 from public.invites where id = invite_id and user_id = auth.uid())
  );
create policy "Convidados podem ver próprio RSVP por invite público"
  on public.guests for select using (
    exists (select 1 from public.invites where id = invite_id and published = true)
  );

-- GIFTS
create policy "Qualquer um pode ver presentes de convite público"
  on public.gifts for select using (
    exists (select 1 from public.invites where id = invite_id and published = true)
  );
create policy "Dono vê presentes de seus convites"
  on public.gifts for select using (
    exists (select 1 from public.invites where id = invite_id and user_id = auth.uid())
  );
create policy "Dono cria presentes"
  on public.gifts for insert with check (
    exists (select 1 from public.invites where id = invite_id and user_id = auth.uid())
  );
create policy "Dono edita presentes"
  on public.gifts for update using (
    exists (select 1 from public.invites where id = invite_id and user_id = auth.uid())
  );
create policy "Dono deleta presentes"
  on public.gifts for delete using (
    exists (select 1 from public.invites where id = invite_id and user_id = auth.uid())
  );
create policy "Qualquer um pode reservar presente"
  on public.gifts for update using (
    exists (select 1 from public.invites where id = invite_id and published = true)
  );

-- ══════════════════════════════════════════
--  AUTO-CRIAR PERFIL AO REGISTRAR
-- ══════════════════════════════════════════
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ══════════════════════════════════════════
--  UPDATED_AT automático
-- ══════════════════════════════════════════
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger invites_updated_at
  before update on public.invites
  for each row execute procedure public.set_updated_at();
