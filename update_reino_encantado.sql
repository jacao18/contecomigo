-- Atualiza HTML e editable_fields do Reino Encantado no Supabase
-- Cole no SQL Editor do Supabase e clique em Run

UPDATE custom_templates
SET
  html_template = $html$<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<title>Reino Encantado</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600&family=Parisienne&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    /* Tema padrão: Roxo Real — sobrescrito pelo editor via <style> injetado */
    --accent: #FFD93D;
    --sky-top: #1a0f3d;
    --sky-mid: #3b1a6b;
    --sky-mid2: #6b2b8c;
    --sky-bot: #b14d92;
    --frame-color: rgba(255,215,140,0.55);
    --gem-color: #ffd98a;
    --tag-color: #ffe2a8;
    --weekday-color: #ffdb9f;
    --addr-color: rgba(255,223,180,0.85);
  }
  html, body {
    margin: 0; padding: 0;
    min-height: 100%;
    background: #0b0720;
    font-family: 'Inter', sans-serif;
    color: #fff;
    -webkit-font-smoothing: antialiased;
  }
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
  }

  .invite-card {
    position: relative;
    width: 100%;
    max-width: 460px;
    aspect-ratio: 9 / 16;
    border-radius: 22px;
    overflow: hidden;
    box-shadow:
      0 30px 80px -20px rgba(120, 60, 200, 0.55),
      0 10px 30px -10px rgba(0, 0, 0, 0.6),
      inset 0 0 0 1px rgba(255, 210, 150, 0.25);
    isolation: isolate;
  }

  /* Sky gradient */
  .sky {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 70% 40% at 50% 15%, rgba(255, 220, 180, 0.28), transparent 60%),
      radial-gradient(ellipse 80% 50% at 30% 75%, rgba(210, 120, 220, 0.28), transparent 60%),
      radial-gradient(ellipse 80% 50% at 80% 85%, rgba(90, 150, 255, 0.28), transparent 60%),
      linear-gradient(180deg, var(--sky-top) 0%, var(--sky-mid) 35%, var(--sky-mid2) 65%, var(--sky-bot) 100%);
    z-index: 0;
  }

  /* Starfield */
  .stars { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
  .star {
    position: absolute;
    width: 2px; height: 2px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 4px #fff;
    animation: twinkle var(--d, 3s) ease-in-out infinite;
    animation-delay: var(--dl, 0s);
  }
  .star.big { width: 6px; height: 6px; background: transparent; }
  .star.big::before, .star.big::after {
    content: '';
    position: absolute;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, #fff3c4 0%, #ffd980 30%, transparent 70%);
    border-radius: 50%;
  }
  .star.big::before { width: 14px; height: 14px; }
  .star.big::after { width: 6px; height: 6px; background: #fff; box-shadow: 0 0 10px #fff, 0 0 20px #ffd980; }
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }

  /* Moon */
  .moon {
    position: absolute;
    top: 8%; right: 12%;
    width: 52px; height: 52px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #fff8e4, #f3d9a0 60%, #c89a5a 100%);
    box-shadow: 0 0 30px rgba(255, 220, 150, 0.6), 0 0 60px rgba(255, 180, 120, 0.3);
    z-index: 2;
  }

  /* Mountains */
  .mountains {
    position: absolute;
    left: 0; right: 0; bottom: 0;
    height: 55%;
    z-index: 3;
  }
  .mountains svg { width: 100%; height: 100%; display: block; }

  /* Castle */
  .castle {
    position: absolute;
    left: 50%;
    bottom: 28%;
    transform: translateX(-50%);
    width: 75%;
    z-index: 4;
    filter: drop-shadow(0 4px 20px rgba(255, 200, 120, 0.35));
  }
  .castle svg { width: 100%; display: block; }

  /* Ornamental frame */
  .ornament-frame {
    position: absolute;
    inset: 14px;
    border-radius: 16px;
    border: 1.5px solid var(--frame-color);
    z-index: 10;
    pointer-events: none;
  }
  .corner {
    position: absolute;
    width: 28px; height: 28px;
    z-index: 11;
    pointer-events: none;
  }
  .corner svg { width: 100%; height: 100%; display: block; }
  .corner.tl { top: 10px; left: 10px; }
  .corner.tr { top: 10px; right: 10px; transform: scaleX(-1); }
  .corner.bl { bottom: 10px; left: 10px; transform: scaleY(-1); }
  .corner.br { bottom: 10px; right: 10px; transform: scale(-1, -1); }

  /* Content */
  .content {
    position: absolute;
    inset: 0;
    z-index: 6;
    display: flex;
    flex-direction: column;
    padding: 30px 32px;
    box-sizing: border-box;
  }

  .age-banner {
    align-self: center;
    margin-top: 8px;
    padding: 6px 22px;
    background: linear-gradient(180deg, #ffe59a 0%, var(--accent) 55%, #b3812a 100%);
    color: #2a1658;
    font-family: 'Cinzel', serif;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.2em;
    border-radius: 999px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5);
    position: relative;
    z-index: 7;
  }
  .age-banner::before, .age-banner::after {
    content: '✦';
    color: #2a1658;
    margin: 0 8px;
    font-size: 10px;
  }

  .name-block {
    margin-top: auto;
    margin-bottom: 12px;
    text-align: center;
  }
  .name {
    font-family: 'Parisienne', cursive;
    font-size: 68px;
    line-height: 0.95;
    color: #fff;
    text-shadow:
      0 0 20px rgba(255, 220, 180, 0.7),
      0 0 40px rgba(255, 180, 220, 0.4),
      0 2px 6px rgba(0,0,0,0.5);
    margin: 0;
    padding: 0 8px;
  }
  .tag {
    font-family: 'Cinzel', serif;
    font-size: 10px;
    letter-spacing: 0.45em;
    color: var(--tag-color);
    text-transform: uppercase;
    margin-top: 4px;
  }

  .date-row {
    display: flex;
    justify-content: center;
    gap: 14px;
    margin-top: 14px;
    margin-bottom: 8px;
  }
  .date-pill {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 215, 140, 0.4);
    border-radius: 12px;
    padding: 10px 14px;
    text-align: center;
    min-width: 70px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
  }
  .date-pill .label {
    font-family: 'Cinzel', serif;
    font-size: 8.5px;
    letter-spacing: 0.25em;
    color: var(--weekday-color);
    text-transform: uppercase;
  }
  .date-pill .value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 500;
    color: #fff;
    margin-top: 2px;
  }

  .info {
    text-align: center;
    font-family: 'Cormorant Garamond', serif;
    color: rgba(255,255,255,0.88);
    line-height: 1.5;
    margin-top: 6px;
    padding: 0 20px;
  }
  .info .weekday {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--weekday-color);
    margin-bottom: 4px;
  }
  .info .venue {
    font-weight: 500;
    letter-spacing: 0.04em;
    font-size: 14px;
    color: #fff;
  }
  .info .addr {
    font-size: 11.5px;
    color: var(--addr-color);
    margin-top: 2px;
    font-style: italic;
  }

  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 10px 0 4px;
    opacity: 0.85;
  }
  .divider .line {
    width: 36px; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gem-color), transparent);
  }
  .divider .gem {
    color: var(--gem-color);
    font-size: 10px;
    text-shadow: 0 0 8px var(--gem-color);
  }

  .brand {
    position: absolute;
    bottom: 10px; left: 0; right: 0;
    text-align: center;
    font-family: 'Cinzel', serif;
    font-size: 8px;
    letter-spacing: 0.3em;
    color: rgba(255, 215, 140, 0.5);
    z-index: 8;
  }

  /* Sparkles */
  .sparkles {
    position: absolute; inset: 0;
    z-index: 5;
    pointer-events: none;
    overflow: hidden;
  }
  .sparkle {
    position: absolute;
    bottom: -10px;
    width: 4px; height: 4px;
    background: radial-gradient(circle, #fff 0%, var(--gem-color) 40%, transparent 70%);
    border-radius: 50%;
    box-shadow: 0 0 6px var(--gem-color);
    animation: rise linear infinite;
  }
  @keyframes rise {
    0% { transform: translateY(0) translateX(0) scale(0.4); opacity: 0; }
    15% { opacity: 1; }
    85% { opacity: 1; }
    100% { transform: translateY(-600px) translateX(var(--drift, 20px)) scale(1); opacity: 0; }
  }

  /* Fireworks */
  .firework {
    position: absolute;
    width: 2px; height: 2px;
    z-index: 3;
    pointer-events: none;
  }
  .firework::before {
    content: '';
    position: absolute;
    left: 50%; top: 50%;
    width: 80px; height: 80px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: radial-gradient(circle, transparent 40%, var(--fc, #ffd98a) 42%, transparent 55%);
    opacity: 0;
    animation: burst 4s ease-out infinite;
    animation-delay: var(--fd, 0s);
  }
  @keyframes burst {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.1); }
    20% { opacity: 0.9; }
    60% { opacity: 0.3; }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(1.4); }
  }
</style>
</head>
<body>

<div class="invite-card">
  <div class="sky"></div>
  <div class="stars" id="stars"></div>
  <div class="moon"></div>

  <!-- Fireworks -->
  <div class="firework" style="left:20%;top:18%;--fc:#ffd98a;--fd:0s"></div>
  <div class="firework" style="left:78%;top:22%;--fc:#ffb0d8;--fd:1.3s"></div>
  <div class="firework" style="left:35%;top:12%;--fc:#bfd4ff;--fd:2.6s"></div>
  <div class="firework" style="left:65%;top:28%;--fc:#ffe2b0;--fd:3.4s"></div>

  <!-- Mountains -->
  <div class="mountains" id="mountainsEl">
    <svg viewBox="0 0 460 300" preserveAspectRatio="none">
      <defs>
        <linearGradient id="mtnA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2d1356" id="mtnATop"/>
          <stop offset="100%" stop-color="#1a0a3a" id="mtnABot"/>
        </linearGradient>
        <linearGradient id="mtnB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1a0a3a" id="mtnBTop"/>
          <stop offset="100%" stop-color="#000"/>
        </linearGradient>
      </defs>
      <path d="M 0 180 L 60 120 L 120 160 L 180 100 L 240 150 L 300 110 L 360 155 L 420 120 L 460 160 L 460 300 L 0 300 Z" fill="url(#mtnA)" opacity="0.8"/>
      <path d="M 0 240 L 80 180 L 160 220 L 240 170 L 320 210 L 400 180 L 460 215 L 460 300 L 0 300 Z" fill="url(#mtnB)"/>
      <rect x="0" y="260" width="460" height="40" fill="#000" opacity="0.6"/>
    </svg>
  </div>

  <!-- Castle -->
  <div class="castle">
    <svg viewBox="0 0 400 280">
      <defs>
        <linearGradient id="castleFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1a0d3d" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.95"/>
        </linearGradient>
        <linearGradient id="windowGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fff4c4"/>
          <stop offset="100%" stop-color="#ffb86a"/>
        </linearGradient>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g fill="url(#castleFill)">
        <rect x="60" y="120" width="36" height="130"/>
        <polygon points="60,120 78,80 96,120"/>
        <rect x="304" y="110" width="38" height="140"/>
        <polygon points="304,110 323,65 342,110"/>
        <rect x="170" y="70" width="60" height="180"/>
        <polygon points="170,70 200,20 230,70"/>
        <rect x="110" y="140" width="30" height="110"/>
        <polygon points="110,140 125,105 140,140"/>
        <rect x="260" y="135" width="32" height="115"/>
        <polygon points="260,135 276,98 292,135"/>
        <rect x="40" y="210" width="320" height="50"/>
        <rect x="40" y="200" width="11" height="12"/>
        <rect x="63" y="200" width="11" height="12"/>
        <rect x="86" y="200" width="11" height="12"/>
        <rect x="109" y="200" width="11" height="12"/>
        <rect x="132" y="200" width="11" height="12"/>
        <rect x="155" y="200" width="11" height="12"/>
        <rect x="178" y="200" width="11" height="12"/>
        <rect x="201" y="200" width="11" height="12"/>
        <rect x="224" y="200" width="11" height="12"/>
        <rect x="247" y="200" width="11" height="12"/>
        <rect x="270" y="200" width="11" height="12"/>
        <rect x="293" y="200" width="11" height="12"/>
        <rect x="316" y="200" width="11" height="12"/>
        <rect x="339" y="200" width="11" height="12"/>
        <path d="M 180 260 L 180 232 Q 200 212 220 232 L 220 260 Z" fill="#000" opacity="0.85"/>
      </g>
      <g stroke="#ffd98a" stroke-width="1.2" fill="none">
        <line x1="200" y1="20" x2="200" y2="4"/>
        <line x1="78" y1="80" x2="78" y2="66"/>
        <line x1="323" y1="65" x2="323" y2="49"/>
        <line x1="125" y1="105" x2="125" y2="93"/>
        <line x1="276" y1="98" x2="276" y2="85"/>
      </g>
      <g fill="#ffd98a">
        <polygon points="200,4 214,9 200,14"/>
        <polygon points="78,66 90,70 78,74"/>
        <polygon points="323,49 335,53 323,57"/>
        <polygon points="125,93 135,96 125,99"/>
        <polygon points="276,85 286,88 276,91"/>
      </g>
      <g fill="url(#windowGlow)" filter="url(#softGlow)">
        <rect x="192" y="100" width="8" height="14" rx="2"/>
        <rect x="208" y="100" width="8" height="14" rx="2"/>
        <rect x="192" y="130" width="8" height="14" rx="2"/>
        <rect x="208" y="130" width="8" height="14" rx="2"/>
        <rect x="192" y="160" width="8" height="14" rx="2"/>
        <rect x="208" y="160" width="8" height="14" rx="2"/>
        <path d="M 196 185 q 4 -6 8 0 v 14 h -8 z"/>
        <rect x="72" y="140" width="6" height="10" rx="1.5"/>
        <rect x="82" y="140" width="6" height="10" rx="1.5"/>
        <rect x="72" y="165" width="6" height="10" rx="1.5"/>
        <rect x="82" y="165" width="6" height="10" rx="1.5"/>
        <rect x="313" y="130" width="6" height="10" rx="1.5"/>
        <rect x="325" y="130" width="6" height="10" rx="1.5"/>
        <rect x="313" y="155" width="6" height="10" rx="1.5"/>
        <rect x="325" y="155" width="6" height="10" rx="1.5"/>
        <rect x="118" y="160" width="6" height="10" rx="1.5"/>
        <rect x="128" y="160" width="6" height="10" rx="1.5"/>
        <rect x="268" y="155" width="6" height="10" rx="1.5"/>
        <rect x="280" y="155" width="6" height="10" rx="1.5"/>
        <rect x="60" y="225" width="6" height="10" rx="1.5"/>
        <rect x="90" y="225" width="6" height="10" rx="1.5"/>
        <rect x="120" y="225" width="6" height="10" rx="1.5"/>
        <rect x="150" y="225" width="6" height="10" rx="1.5"/>
        <rect x="250" y="225" width="6" height="10" rx="1.5"/>
        <rect x="280" y="225" width="6" height="10" rx="1.5"/>
        <rect x="310" y="225" width="6" height="10" rx="1.5"/>
        <rect x="340" y="225" width="6" height="10" rx="1.5"/>
      </g>
    </svg>
  </div>

  <!-- Sparkles -->
  <div class="sparkles" id="sparkles"></div>

  <!-- Ornamental frame -->
  <div class="ornament-frame"></div>
  <div class="corner tl"><svg viewBox="0 0 40 40" fill="none" stroke="rgba(255,215,140,0.85)" stroke-width="1.2" stroke-linecap="round"><path d="M 4 20 Q 4 4 20 4"/><path d="M 8 20 Q 8 8 20 8" opacity="0.6"/><circle cx="10" cy="10" r="1.3" fill="rgba(255,215,140,0.9)" stroke="none"/><path d="M 4 20 L 4 28 M 20 4 L 28 4" opacity="0.5"/></svg></div>
  <div class="corner tr"><svg viewBox="0 0 40 40" fill="none" stroke="rgba(255,215,140,0.85)" stroke-width="1.2" stroke-linecap="round"><path d="M 4 20 Q 4 4 20 4"/><path d="M 8 20 Q 8 8 20 8" opacity="0.6"/><circle cx="10" cy="10" r="1.3" fill="rgba(255,215,140,0.9)" stroke="none"/><path d="M 4 20 L 4 28 M 20 4 L 28 4" opacity="0.5"/></svg></div>
  <div class="corner bl"><svg viewBox="0 0 40 40" fill="none" stroke="rgba(255,215,140,0.85)" stroke-width="1.2" stroke-linecap="round"><path d="M 4 20 Q 4 4 20 4"/><path d="M 8 20 Q 8 8 20 8" opacity="0.6"/><circle cx="10" cy="10" r="1.3" fill="rgba(255,215,140,0.9)" stroke="none"/><path d="M 4 20 L 4 28 M 20 4 L 28 4" opacity="0.5"/></svg></div>
  <div class="corner br"><svg viewBox="0 0 40 40" fill="none" stroke="rgba(255,215,140,0.85)" stroke-width="1.2" stroke-linecap="round"><path d="M 4 20 Q 4 4 20 4"/><path d="M 8 20 Q 8 8 20 8" opacity="0.6"/><circle cx="10" cy="10" r="1.3" fill="rgba(255,215,140,0.9)" stroke="none"/><path d="M 4 20 L 4 28 M 20 4 L 28 4" opacity="0.5"/></svg></div>

  <!-- Content — valores injetados via {{placeholders}} pelo sistema ConteComigo -->
  <div class="content">
    <div class="age-banner" id="ageBanner">{{idade}}</div>

    <div class="name-block">
      <div class="tag">Era uma vez…</div>
      <h1 class="name" id="nameEl">{{nome}}</h1>
    </div>

    <div class="divider">
      <span class="line"></span>
      <span class="gem">✦</span>
      <span class="line"></span>
    </div>

    <div class="date-row">
      <div class="date-pill">
        <div class="label">Dia</div>
        <div class="value" id="diaEl">{{dia}}</div>
      </div>
      <div class="date-pill">
        <div class="label">Mês</div>
        <div class="value" id="mesEl">{{mes}}</div>
      </div>
      <div class="date-pill">
        <div class="label">Hora</div>
        <div class="value" id="horaEl">{{hora}}</div>
      </div>
    </div>

    <div class="info">
      <div class="weekday" id="weekdayEl">{{diaSemana}}</div>
      <div class="venue" id="venueEl">{{local}}</div>
      <div class="addr" id="addrEl">{{endereco}}</div>
    </div>

    <div class="brand">✦ CONTE COMIGO ✦</div>
  </div>
</div>

<script>

  // ── Cálculo automático do dia da semana ─────────────────────────────
  // Se {{diaSemana}} não foi substituído (ainda é o placeholder),
  // calcula a partir de {{dia}} e {{mes}}.
  (function() {
    const weekdayEl = document.getElementById('weekdayEl');
    if (!weekdayEl) return;

    const text = weekdayEl.textContent.trim();

    // Se o placeholder ainda está lá (não foi substituído pelo sistema),
    // tenta calcular a partir dos outros campos já renderizados.
    if (text === '{{diaSemana}}' || text === '') {
      const diaEl  = document.getElementById('diaEl');
      const mesEl  = document.getElementById('mesEl');
      const dia    = diaEl  ? parseInt(diaEl.textContent.trim(), 10)  : null;
      const mesStr = mesEl  ? mesEl.textContent.trim().toLowerCase()  : null;

      const meses = {
        'janeiro':1,'fevereiro':2,'março':3,'abril':4,'maio':5,'junho':6,
        'julho':7,'agosto':8,'setembro':9,'outubro':10,'novembro':11,'dezembro':12
      };
      const mesNum = meses[mesStr];

      if (dia && mesNum) {
        const year = new Date().getFullYear();
        const d = new Date(year, mesNum - 1, dia);
        // Se a data já passou este ano, usa o próximo
        if (d < new Date()) d.setFullYear(year + 1);
        const nomes = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
        weekdayEl.textContent = nomes[d.getDay()];
      }
    }

    // Se foi substituído mas está em minúsculo, capitaliza a primeira letra
    if (weekdayEl.textContent.length > 0) {
      weekdayEl.textContent = weekdayEl.textContent.charAt(0).toUpperCase()
        + weekdayEl.textContent.slice(1);
    }
  })();

  // ── Starfield ────────────────────────────────────────────────────────
  (function() {
    const host = document.getElementById('stars');
    if (!host) return;
    const count = 70;
    let html = '';
    for (let i = 0; i < count; i++) {
      const x  = Math.random() * 100;
      const y  = Math.random() * 65;
      const d  = 2 + Math.random() * 3;
      const dl = Math.random() * 3;
      const big = Math.random() < 0.08;
      html += '<div class="star' + (big ? ' big' : '') + '" style="left:' + x + '%;top:' + y + '%;--d:' + d + 's;--dl:' + dl + 's"></div>';
    }
    host.innerHTML = html;
  })();

  // ── Sparkles ─────────────────────────────────────────────────────────
  (function() {
    const host = document.getElementById('sparkles');
    if (!host) return;
    const count = 22;
    let html = '';
    for (let i = 0; i < count; i++) {
      const$html$,
  editable_fields = (
    CASE
      WHEN editable_fields IS NULL THEN '["nome","idade","dia","mes","hora","local","endereco","tema"]'::jsonb
      WHEN editable_fields::text NOT LIKE '%tema%' THEN editable_fields || '["tema"]'::jsonb
      ELSE editable_fields
    END
  )
WHERE name ILIKE '%reino%' OR name ILIKE '%encantado%';
