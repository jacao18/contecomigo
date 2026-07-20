-- ══════════════════════════════════════════
--  Migração: preferências de notificação de confirmações (RSVP)
--  Padrão: nenhuma notificação (false/false)
--  Rodar no SQL Editor do Supabase
-- ══════════════════════════════════════════

alter table public.invites
  add column if not exists notify_email       boolean not null default false,
  add column if not exists notify_whatsapp    boolean not null default false,
  add column if not exists notify_email_to    text,
  add column if not exists notify_whatsapp_to text;

comment on column public.invites.notify_email       is 'Enviar e-mail ao dono do convite a cada confirmação (padrão: desligado)';
comment on column public.invites.notify_whatsapp    is 'Enviar WhatsApp ao dono do convite a cada confirmação (padrão: desligado)';
comment on column public.invites.notify_email_to    is 'E-mail de destino das notificações';
comment on column public.invites.notify_whatsapp_to is 'Número WhatsApp de destino das notificações (somente dígitos)';

-- NOTA: o disparo real (e-mail/WhatsApp) será feito depois via Supabase Edge
-- Function + Database Webhook no INSERT de public.guests, lendo estas colunas.
