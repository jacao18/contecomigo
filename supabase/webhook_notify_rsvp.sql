-- ══════════════════════════════════════════════════════════════════
--  ConteComigo — Database Webhook: chama a Edge Function notify-rsvp
--  a cada nova confirmação (INSERT em public.guests).
--
--  Rodar no SQL Editor do Supabase DEPOIS de:
--    1) rodar notification_prefs_migration.sql
--    2) fazer deploy da função:  supabase functions deploy notify-rsvp --no-verify-jwt
--    3) definir os secrets (ver README-notificacoes.md)
--
--  ⚠️ Substitua o valor de WEBHOOK_SECRET abaixo pelo MESMO valor que
--     você definiu em:  supabase secrets set WEBHOOK_SECRET=...
-- ══════════════════════════════════════════════════════════════════

-- Extensão para chamadas HTTP a partir do Postgres
create extension if not exists pg_net with schema extensions;

-- Função de trigger que dispara a Edge Function
create or replace function public.tg_notify_rsvp()
returns trigger
language plpgsql
security definer
as $$
declare
  fn_url   text := 'https://wevmgnzmkdecdcnouhjq.supabase.co/functions/v1/notify-rsvp';
  secret   text := '2feac96cf85f9cfa1c335658f314b441b35ff517b308f919';  -- WEBHOOK_SECRET (NÃO é a chave do Resend)
begin
  -- Só chama a função se o convite tiver ALGUMA notificação ligada
  if exists (
    select 1 from public.invites i
    where i.id = new.invite_id
      and (i.notify_email = true or i.notify_whatsapp = true)
  ) then
    perform net.http_post(
      url     := fn_url,
      headers := jsonb_build_object(
                   'Content-Type',    'application/json',
                   'x-webhook-secret', secret
                 ),
      body    := jsonb_build_object(
                   'type',   'INSERT',
                   'table',  'guests',
                   'schema', 'public',
                   'record', to_jsonb(new)
                 )
    );
  end if;
  return new;
end;
$$;

-- (Re)cria o trigger no INSERT de guests
drop trigger if exists trg_notify_rsvp on public.guests;
create trigger trg_notify_rsvp
  after insert on public.guests
  for each row
  execute function public.tg_notify_rsvp();
