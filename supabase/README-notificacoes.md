# 🔔 Notificações de confirmação (RSVP) — ConteComigo

Envia e-mail (**Resend**) e/ou WhatsApp (**Meta Cloud API**) para o dono do
convite sempre que um convidado confirma presença.

## Como funciona

```
convidado confirma → INSERT em public.guests
        → trigger trg_notify_rsvp (só se o convite tem notificação ligada)
        → Edge Function notify-rsvp
        → lê prefs do convite → dispara Resend e/ou Meta Cloud API
```

O front-end (dashboard.html → aba Notificações) já grava as preferências por
convite: `notify_email`, `notify_whatsapp`, `notify_email_to`, `notify_whatsapp_to`.

---

## Passo a passo do deploy

Pré-requisitos: [Supabase CLI](https://supabase.com/docs/guides/cli) instalado e logado
(`supabase login`).

### 1. Migrations do banco (SQL Editor do Supabase)
Rode, nesta ordem:
1. `notification_prefs_migration.sql` (se ainda não rodou) — cria as colunas.
2. `supabase/webhook_notify_rsvp.sql` — cria o trigger/webhook.
   **Antes de rodar**, troque `TROQUE_POR_SEU_WEBHOOK_SECRET` por um segredo forte
   (o mesmo do passo 4).

### 2. Vincular o projeto local ao Supabase
```bash
cd caminho/para/ConteComigo
supabase link --project-ref wevmgnzmkdecdcnouhjq
```

### 3. Deploy da função
```bash
supabase functions deploy notify-rsvp --no-verify-jwt
```
> `--no-verify-jwt` é necessário porque quem chama é o Postgres (webhook),
> não um usuário logado. A segurança fica por conta do `WEBHOOK_SECRET`.

### 4. Definir os secrets
Gere um segredo (ex.: `openssl rand -hex 24`) e configure tudo:
```bash
supabase secrets set \
  WEBHOOK_SECRET="o-mesmo-do-sql" \
  RESEND_API_KEY="re_xxx" \
  RESEND_FROM="CrieConvites <avisos@seudominio.com>" \
  WHATSAPP_TOKEN="EAAxxxxxxxx" \
  WHATSAPP_PHONE_ID="123456789012345" \
  WHATSAPP_TEMPLATE="nova_confirmacao" \
  WHATSAPP_LANG="pt_BR"
```
`SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` já são injetados automaticamente.
O WhatsApp só é necessário se você for usar esse canal — só e-mail funciona sozinho.

---

## Onde conseguir as chaves

### Resend (e-mail)
1. Crie conta em resend.com → **API Keys** → gere `re_...`.
2. Para produção, verifique seu domínio em **Domains** e use um remetente desse
   domínio no `RESEND_FROM`. Para testes, pode usar `onboarding@resend.dev`
   (só entrega para o e-mail dono da conta Resend).

### Meta WhatsApp Cloud API (WhatsApp)
Como a notificação é iniciada pelo negócio (fora da janela de 24h), ela **precisa
de um template aprovado**. Passos:

1. **Conta:** crie um app em [developers.facebook.com](https://developers.facebook.com/)
   → produto **WhatsApp**. Isso gera um **Phone Number ID** de teste e um token
   temporário. Anote o `WHATSAPP_PHONE_ID`.
2. **Token permanente:** em **Business Settings → Users → System Users**, crie um
   System User, gere um token com as permissões `whatsapp_business_messaging` e
   `whatsapp_business_management`. Esse é o `WHATSAPP_TOKEN` (não expira).
3. **Template:** em **WhatsApp Manager → Message Templates → Create**, categoria
   **Utility**, idioma **Português (BR) = pt_BR**, nome exatamente
   `nova_confirmacao`, com corpo usando 3 variáveis `{{1}} {{2}} {{3}}`, ex.:

   > Olá! Você recebeu uma nova resposta no seu convite. *{{1}}* respondeu:
   > *{{2}}* para o evento *{{3}}*. Veja os detalhes no seu painel CrieConvites.

   Aguarde a aprovação (geralmente minutos). Os parâmetros são preenchidos pela
   função nesta ordem: nome do convidado, resposta, nome do evento.
4. **Número de produção:** para enviar a qualquer número, registre e verifique um
   número WhatsApp Business real (o número de teste da Meta só envia para
   destinatários adicionados manualmente na lista de teste).

---

## Testar

Deploy feito? Faça uma confirmação de teste em qualquer convite com notificação
ligada, ou chame a função direto:
```bash
curl -X POST https://wevmgnzmkdecdcnouhjq.supabase.co/functions/v1/notify-rsvp \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: SEU_WEBHOOK_SECRET" \
  -d '{"type":"INSERT","table":"guests","schema":"public",
       "record":{"invite_id":"UUID_DE_UM_CONVITE","name":"Fulano",
                 "attending":"yes","plus_ones":2,"message":"Vou levar o bolo!"}}'
```
Logs em tempo real:
```bash
supabase functions logs notify-rsvp --tail
```

## Custos / limites (referência — confira os planos atuais)
- **Resend:** plano grátis ~3.000 e-mails/mês, 100/dia.
- **Meta WhatsApp Cloud API:** 1.000 conversas de serviço grátis/mês; mensagem
  *utility* no Brasil ≈ R$ 0,04–0,05 depois disso. Sem mensalidade, sem markup.
- **Supabase Edge Functions:** incluídas no plano; cobradas por invocação acima da cota.
