// ══════════════════════════════════════════════════════════════════
//  ConteComigo — Edge Function: notify-rsvp
//  Disparada por um Database Webhook no INSERT de public.guests.
//  Lê as preferências do convite e envia:
//    • E-mail  via Resend            (se notify_email + notify_email_to)
//    • WhatsApp via Meta Cloud API   (se notify_whatsapp + notify_whatsapp_to)
//
//  Secrets necessários (supabase secrets set ...):
//    SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   (injetados automaticamente)
//    WEBHOOK_SECRET            — segredo compartilhado com o webhook
//    RESEND_API_KEY            — chave da Resend
//    RESEND_FROM              — ex: "CrieConvites <avisos@seudominio.com>"
//    WHATSAPP_TOKEN           — access token permanente da Meta (System User)
//    WHATSAPP_PHONE_ID        — Phone Number ID do número WhatsApp Business
//    WHATSAPP_TEMPLATE        — nome do template aprovado (padrão: nova_confirmacao)
//    WHATSAPP_LANG            — idioma do template (padrão: pt_BR)
// ══════════════════════════════════════════════════════════════════

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET") ?? "";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const RESEND_FROM = Deno.env.get("RESEND_FROM") ?? "ConteComigo <onboarding@resend.dev>";

const WA_TOKEN = Deno.env.get("WHATSAPP_TOKEN") ?? "";
const WA_PHONE_ID = Deno.env.get("WHATSAPP_PHONE_ID") ?? "";
const WA_TEMPLATE = Deno.env.get("WHATSAPP_TEMPLATE") ?? "nova_confirmacao";
const WA_LANG = Deno.env.get("WHATSAPP_LANG") ?? "pt_BR";
const WA_VERSION = Deno.env.get("WHATSAPP_GRAPH_VERSION") ?? "v21.0";

const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

// ── helpers ────────────────────────────────────────────────────────
function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Número no formato da Meta Cloud API: só dígitos, com código do país.
// Entrada vem só com dígitos. Assume Brasil (55) se não houver país.
function toWaNumber(raw: string): string {
  let d = String(raw).replace(/\D/g, "");
  if (!d.startsWith("55")) d = "55" + d;
  return d;
}

// Parâmetros de template não podem ter quebra de linha, tab ou 4+ espaços,
// e não podem ser vazios.
function cleanParam(s: string): string {
  const v = String(s ?? "").replace(/[\n\t]+/g, " ").replace(/ {4,}/g, "   ").trim().slice(0, 300);
  return v || "-";
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY não configurado");
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: RESEND_FROM, to: [to], subject, html }),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
}

// Envia um template aprovado via Meta WhatsApp Cloud API.
// params preenchem {{1}}, {{2}}, {{3}}... do corpo do template, na ordem.
async function sendWhatsApp(to: string, params: string[]) {
  if (!WA_TOKEN || !WA_PHONE_ID) {
    throw new Error("Credenciais Meta WhatsApp não configuradas");
  }
  const url = `https://graph.facebook.com/${WA_VERSION}/${WA_PHONE_ID}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to: toWaNumber(to),
    type: "template",
    template: {
      name: WA_TEMPLATE,
      language: { code: WA_LANG },
      components: [
        {
          type: "body",
          parameters: params.map((t) => ({ type: "text", text: cleanParam(t) })),
        },
      ],
    },
  };
  const r = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WA_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`WhatsApp ${r.status}: ${await r.text()}`);
}

// ── template de e-mail (CrieConvites) ──────────────────────────────
function statusMeta(a: string) {
  if (a === "yes") return { label: "vai comparecer", emoji: "🎉", color: "#0f7a4d", bg: "#e6f7ee", border: "#bfe8d2", head: "Novo convidado confirmado!" };
  if (a === "no")  return { label: "não vai comparecer", emoji: "💙", color: "#c0392b", bg: "#fdecec", border: "#f6cfcf", head: "Você recebeu uma resposta" };
  return { label: "talvez compareça", emoji: "🤔", color: "#b45309", bg: "#fdf4e3", border: "#f2ddb0", head: "Você recebeu uma resposta" };
}

function buildEmailHtml(name: string, attending: string, eventName: string, plusOnes: number, msg: string, dashUrl: string) {
  const s = statusMeta(attending);
  const ff = "font-family:Arial,Helvetica,sans-serif";
  const plusLine = plusOnes > 0
    ? `<tr><td style="padding:6px 0;color:#6b5d54;font-size:14px;${ff}">👥 Acompanhantes</td><td style="padding:6px 0;text-align:right;font-weight:700;color:#1a0a00;font-size:14px;${ff}">+${plusOnes}</td></tr>`
    : "";
  const msgBlock = msg
    ? `<tr><td colspan="2" style="padding:14px 0 0"><div style="background:#fff8f0;border-left:3px solid #FF3D6B;border-radius:8px;padding:12px 16px;color:#1a0a00;font-size:14px;line-height:1.5;font-style:italic;${ff}">“${esc(msg)}”</div></td></tr>`
    : "";
  return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"></head>
<body style="margin:0;padding:0;background:#fff8f0;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#fff8f0">${esc(name)} ${s.label} — ${esc(eventName)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff8f0;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
  <tr><td align="center" style="padding:8px 0 20px">
    <span style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-weight:700;font-size:22px;color:#FF3D6B;letter-spacing:.3px">CrieConvites</span>
  </td></tr>
  <tr><td style="background:#ffffff;border:1px solid #f0e6dc;border-radius:18px;overflow:hidden">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="background:#FF3D6B;padding:26px 28px" align="center">
        <div style="font-size:34px;line-height:1">${s.emoji}</div>
        <div style="font-family:Georgia,'Times New Roman',serif;color:#ffffff;font-size:21px;font-weight:700;margin-top:8px">${esc(s.head)}</div>
      </td>
    </tr></table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:28px 28px 8px" align="center">
        <div style="font-size:12px;color:#9b8b80;text-transform:uppercase;letter-spacing:1px;font-weight:700;${ff}">Confirmação de presença</div>
        <div style="font-size:26px;font-weight:800;color:#1a0a00;margin:8px 0 14px;font-family:Georgia,'Times New Roman',serif">${esc(name)}</div>
        <span style="display:inline-block;background:${s.bg};color:${s.color};border:1px solid ${s.border};border-radius:999px;padding:7px 16px;font-size:14px;font-weight:700;${ff}">${s.emoji} ${esc(s.label)}</span>
      </td></tr>
      <tr><td style="padding:18px 28px 4px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #f0e6dc">
          <tr><td style="padding:14px 0 4px;color:#6b5d54;font-size:14px;${ff}">🎈 Evento</td><td style="padding:14px 0 4px;text-align:right;font-weight:700;color:#1a0a00;font-size:14px;${ff}">${esc(eventName)}</td></tr>
          ${plusLine}
          ${msgBlock}
        </table>
      </td></tr>
      <tr><td align="center" style="padding:26px 28px 30px">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td align="center" style="background:#FFD93D;border-radius:12px">
            <a href="${dashUrl}" style="display:inline-block;padding:14px 30px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:800;color:#1a0a00;text-decoration:none">Ver todas as confirmações →</a>
          </td>
        </tr></table>
      </td></tr>
    </table>
  </td></tr>
  <tr><td align="center" style="padding:20px 20px 8px">
    <div style="font-size:12px;color:#b3a599;line-height:1.6;font-family:Arial,Helvetica,sans-serif">
      Você recebeu este aviso porque ativou as notificações de confirmação no seu painel CrieConvites.<br>
      <a href="https://crieconvites.com.br/dashboard.html" style="color:#FF3D6B;text-decoration:none">Gerenciar notificações</a>
    </div>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

// ── handler ────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  try {
    // 1) Autenticação do webhook (header compartilhado)
    if (WEBHOOK_SECRET) {
      const got = req.headers.get("x-webhook-secret");
      if (got !== WEBHOOK_SECRET) {
        return new Response("unauthorized", { status: 401 });
      }
    }

    const payload = await req.json();
    if (payload?.type !== "INSERT" || payload?.table !== "guests") {
      return new Response(JSON.stringify({ ignored: true }), { status: 200 });
    }

    const g = payload.record ?? {};
    if (!g.invite_id) {
      return new Response(JSON.stringify({ ignored: "sem invite_id" }), { status: 200 });
    }

    // 2) Buscar o convite (service role → ignora RLS)
    const { data: inv, error } = await sb
      .from("invites")
      .select("title,event_name,event_date,event_time,location,slug,notify_email,notify_whatsapp,notify_email_to,notify_whatsapp_to")
      .eq("id", g.invite_id)
      .single();
    if (error || !inv) {
      return new Response(JSON.stringify({ error: error?.message ?? "convite não encontrado" }), { status: 200 });
    }

    const wantEmail = inv.notify_email && inv.notify_email_to;
    const wantWhats = inv.notify_whatsapp && inv.notify_whatsapp_to;
    if (!wantEmail && !wantWhats) {
      return new Response(JSON.stringify({ ignored: "notificações desligadas" }), { status: 200 });
    }

    // 3) Montar conteúdo
    const eventName = inv.event_name || inv.title || "seu evento";
    const msg = g.message ? String(g.message) : "";

    const results: Record<string, string> = {};

    if (wantEmail) {
      const dashUrl = "https://crieconvites.com.br/dashboard.html";
      const sm = statusMeta(g.attending);
      const html = buildEmailHtml(
        String(g.name ?? ""),
        String(g.attending ?? ""),
        eventName,
        Number(g.plus_ones) || 0,
        msg,
        dashUrl,
      );
      try {
        await sendEmail(inv.notify_email_to, `${sm.emoji} ${g.name} respondeu — ${eventName}`, html);
        results.email = "ok";
      } catch (e) {
        results.email = `erro: ${(e as Error).message}`;
      }
    }

    if (wantWhats) {
      // Parâmetros do template aprovado (corpo com {{1}} {{2}} {{3}}):
      //   {{1}} nome do convidado · {{2}} resposta · {{3}} nome do evento
      const waStatus: Record<string, string> = {
        yes: "Sim, vai comparecer",
        no: "Não poderá comparecer",
        maybe: "Talvez compareça",
      };
      const st = waStatus[g.attending] ?? String(g.attending);
      try {
        await sendWhatsApp(inv.notify_whatsapp_to, [String(g.name ?? ""), st, eventName]);
        results.whatsapp = "ok";
      } catch (e) {
        results.whatsapp = `erro: ${(e as Error).message}`;
      }
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
  }
});
