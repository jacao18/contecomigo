/* ════════════════════════════════════════════════════════
   REAL INVITE RENDERER — sincronizado com editor.html
   Gera o preview real do convite para usar como thumbnail.
   ════════════════════════════════════════════════════════ */
(function(){
// ── TEMPLATES (do editor) ──
const TEMPLATES = {
  // ── HOMEM ──
  'homem': [
    {
      id:'hom-cerveja',name:'Chope & Futebol',
      img:'https://images.unsplash.com/photo-1555658636-6e4a36218be7?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#F59E0B',defaultBg:'dark-brown',
      heroStyle:'color:#F59E0B',overlayStyle:'',
      tweaks:[
        { type:'theme', label:'Esquema de cor', key:'colorTheme', default:'cerveja', options:[
          { key:'cerveja',  label:'🍺 Chope',    bg:'linear-gradient(160deg,#1a0e00,#3d2200)', accent:'#F59E0B' },
          { key:'whisky',   label:'🥃 Whisky',   bg:'linear-gradient(160deg,#2a1200,#5c2a00)', accent:'#D97706' },
          { key:'dark',     label:'🖤 Dark',      bg:'linear-gradient(160deg,#111,#222)',        accent:'#E5E7EB' },
          { key:'futebol',  label:'⚽ Campo',    bg:'linear-gradient(160deg,#052a10,#0d4a1a)', accent:'#34D399' },
        ]},
      ],
    },
    {
      id:'hom-futebol',name:'Campo de Futebol',
      img:'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#34D399',defaultBg:'dark-green',
      heroStyle:'color:#34D399',overlayStyle:'',
      tweaks:[
        { type:'theme', label:'Time', key:'colorTheme', default:'verde', options:[
          { key:'verde',    label:'🟢 Verde',     bg:'linear-gradient(160deg,#052a10,#0a4a1a)', accent:'#34D399' },
          { key:'azul',     label:'🔵 Azul',      bg:'linear-gradient(160deg,#0a1628,#1e3a5f)', accent:'#60A5FA' },
          { key:'vermelho', label:'🔴 Vermelho',  bg:'linear-gradient(160deg,#1a0000,#5a0000)', accent:'#EF4444' },
          { key:'amarelo',  label:'🟡 Amarelo',   bg:'linear-gradient(160deg,#1a1000,#3a2800)', accent:'#FBBF24' },
        ]},
      ],
    },
    {
      id:'hom-minimalista',name:'Minimalista',
      img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#E5E7EB',defaultBg:'dark-brown',
      heroStyle:'color:#E5E7EB',overlayStyle:'',
      tweaks:[
        { type:'accent', label:'Cor de destaque' },
      ],
    },
    {
      id:'hom-fotos',name:'Com suas fotos 📷',
      img:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
      supportsHeroUpload:true,
      defaultAccent:'#F59E0B',defaultBg:'dark-brown',
      heroStyle:'color:#F59E0B',overlayStyle:'',
      tweaks:[
        { type:'hero', label:'Foto de fundo' },
        { type:'accent', label:'Cor de destaque' },
      ],
    },
  ],
  // ── MULHER ──
  'mulher': [
    {
      id:'mul-champanhe',name:'Champanhe & Glamour',
      img:'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#FCD34D',defaultBg:'dark-brown',
      heroStyle:'color:#FCD34D',overlayStyle:'',
      tweaks:[
        { type:'theme', label:'Paleta', key:'colorTheme', default:'champanhe', options:[
          { key:'champanhe', label:'🥂 Champanhe', bg:'linear-gradient(160deg,#1a0e00,#3a1800)', accent:'#FCD34D' },
          { key:'rosegold',  label:'🌹 Rose Gold', bg:'linear-gradient(160deg,#2a0808,#5c1010)', accent:'#F9A8D4' },
          { key:'roxo',      label:'💜 Roxo',      bg:'linear-gradient(160deg,#1e0a2a,#6b21a8)', accent:'#A78BFA' },
          { key:'preto',     label:'🖤 Black Tie', bg:'linear-gradient(160deg,#0a0a0a,#1a1a1a)', accent:'#FCD34D' },
        ]},
      ],
    },
    {
      id:'mul-rosa',name:'Rosa & Fofo',
      img:'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#F472B6',defaultBg:'violet',
      heroStyle:'color:#F472B6',overlayStyle:'',
      tweaks:[
        { type:'theme', label:'Tom', key:'colorTheme', default:'rosa', options:[
          { key:'rosa',     label:'🌸 Rosa',      bg:'linear-gradient(160deg,#2d0020,#6b0030)', accent:'#F472B6' },
          { key:'lilas',    label:'💜 Lilás',     bg:'linear-gradient(160deg,#1e0a2a,#4c1d95)', accent:'#C084FC' },
          { key:'coral',    label:'🪸 Coral',     bg:'linear-gradient(160deg,#2a0808,#7f1d1d)', accent:'#FB7185' },
          { key:'menta',    label:'🌿 Menta',     bg:'linear-gradient(160deg,#0d2a10,#065f46)', accent:'#6EE7B7' },
        ]},
      ],
    },
    {
      id:'mul-pool',name:'Pool Party',
      img:'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#60A5FA',defaultBg:'mint',
      heroStyle:'color:#60A5FA',overlayStyle:'',
      tweaks:[
        { type:'theme', label:'Clima', key:'colorTheme', default:'piscina', options:[
          { key:'piscina',  label:'🏊 Piscina',   bg:'linear-gradient(160deg,#0a2550,#0e4f8a)', accent:'#60A5FA' },
          { key:'tropical', label:'🌴 Tropical',  bg:'linear-gradient(160deg,#0d3320,#1a5c3a)', accent:'#34D399' },
          { key:'noite',    label:'🌙 Noite',     bg:'linear-gradient(160deg,#0a0820,#1e1b4b)', accent:'#A78BFA' },
          { key:'neon',     label:'⚡ Neon',      bg:'linear-gradient(160deg,#0a0010,#1a0033)', accent:'#F472B6' },
        ]},
      ],
    },
    {
      id:'mul-fotos',name:'Com suas fotos 📷',
      img:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
      supportsHeroUpload:true,
      defaultAccent:'#F472B6',defaultBg:'violet',
      heroStyle:'color:#F472B6',overlayStyle:'',
      tweaks:[
        { type:'hero', label:'Foto de fundo' },
        { type:'accent', label:'Cor de destaque' },
      ],
    },
  ],
  // ── 15 ANOS ──
  'quinze': [
    {
      id:'deb-valsa',name:'Valsa Real',
      img:'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#FCD34D',defaultBg:'dark-purple',
      heroStyle:'color:#FCD34D',overlayStyle:'',
      tweaks:[
        { type:'theme', label:'Paleta', key:'colorTheme', default:'dourado', options:[
          { key:'dourado',  label:'✨ Dourado',   bg:'linear-gradient(160deg,#1a0a3d,#3b1a6b)', accent:'#FCD34D' },
          { key:'rosa',     label:'🌸 Rosa',      bg:'linear-gradient(160deg,#2d0020,#6b0a35)', accent:'#F472B6' },
          { key:'azul',     label:'💎 Safira',    bg:'linear-gradient(160deg,#0a1628,#1e3a5f)', accent:'#93C5FD' },
          { key:'esmeralda',label:'💚 Esmeralda', bg:'linear-gradient(160deg,#0d2a10,#065f46)', accent:'#6EE7B7' },
        ]},
      ],
    },
    {
      id:'deb-clean',name:'Clean & Moderno',
      img:'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#F472B6',defaultBg:'violet',
      heroStyle:'color:#F472B6',overlayStyle:'',
      tweaks:[
        { type:'accent', label:'Cor de destaque' },
      ],
    },
    {
      id:'deb-vintage',name:'Vintage Dourado',
      img:'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#FCD34D',defaultBg:'rose-gold',
      heroStyle:'color:#FCD34D',overlayStyle:'',
      tweaks:[
        { type:'theme', label:'Tom vintage', key:'colorTheme', default:'ouro', options:[
          { key:'ouro',     label:'🥇 Ouro',      bg:'linear-gradient(160deg,#1c0f00,#3b2000)', accent:'#FCD34D' },
          { key:'prata',    label:'🥈 Prata',     bg:'linear-gradient(160deg,#111,#2a2a2a)',     accent:'#E5E7EB' },
          { key:'bronze',   label:'🥉 Bronze',    bg:'linear-gradient(160deg,#2a1a0a,#5c3010)', accent:'#D97706' },
          { key:'rose',     label:'🌹 Rose',      bg:'linear-gradient(160deg,#2a0808,#5c1010)', accent:'#F9A8D4' },
        ]},
      ],
    },
    {
      id:'deb-fotos',name:'Com suas fotos 📷',
      img:'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=600&q=80',
      supportsHeroUpload:true,
      defaultAccent:'#F472B6',defaultBg:'transparent',
      heroStyle:'color:#fff',overlayStyle:'',
      tweaks:[
        { type:'hero', label:'Foto de fundo' },
        { type:'accent', label:'Cor de destaque' },
      ],
    },
  ],
  // ── MENINO ──
  'menino': [
    {
      id:'boy-spiderman',name:'Homem-Aranha',
      img:'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#EF4444',defaultBg:'dark-blue',
      heroStyle:'color:#EF4444',overlayStyle:'',
      tweaks:[
        { type:'theme', label:'Variação', key:'colorTheme', default:'vermelho', options:[
          { key:'vermelho', label:'🔴 Clássico',  bg:'linear-gradient(160deg,#1a0000,#5a0000)', accent:'#EF4444' },
          { key:'preto',    label:'🖤 Dark',      bg:'linear-gradient(160deg,#050510,#0f0f1f)', accent:'#EF4444' },
          { key:'azul',     label:'🔵 Miles M.',  bg:'linear-gradient(160deg,#0a0828,#1e1b5f)', accent:'#60A5FA' },
        ]},
      ],
    },
    {
      id:'boy-pokemon',name:'Pokémon',
      img:'https://images.unsplash.com/photo-1542779867-5b23e9e44cbf?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#FBBF24',defaultBg:'dark-blue',
      heroStyle:'color:#FBBF24',overlayStyle:'',
      tweaks:[
        { type:'theme', label:'Pokémon favorito', key:'colorTheme', default:'pikachu', options:[
          { key:'pikachu',  label:'⚡ Pikachu',   bg:'linear-gradient(160deg,#1a1000,#3a2800)', accent:'#FBBF24' },
          { key:'charizard',label:'🔥 Charizard', bg:'linear-gradient(160deg,#2a0800,#5c1800)', accent:'#F97316' },
          { key:'squirtle', label:'💧 Squirtle',  bg:'linear-gradient(160deg,#0a1628,#1e3a5f)', accent:'#60A5FA' },
          { key:'bulba',    label:'🌿 Bulbasaur', bg:'linear-gradient(160deg,#0d2a10,#0d4a1a)', accent:'#4ADE80' },
        ]},
      ],
    },
    {
      id:'boy-mickey',name:'Mickey Mouse',
      img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#EF4444',defaultBg:'dark-brown',
      heroStyle:'color:#EF4444',overlayStyle:'',
      tweaks:[
        { type:'theme', label:'Tema', key:'colorTheme', default:'classico', options:[
          { key:'classico', label:'🐭 Clássico',  bg:'linear-gradient(160deg,#0a0000,#2a0000)', accent:'#EF4444' },
          { key:'colorido', label:'🎪 Colorido',  bg:'linear-gradient(160deg,#1a0000,#3d0050)', accent:'#FBBF24' },
          { key:'azul',     label:'🎩 Elegante',  bg:'linear-gradient(160deg,#0a1628,#1e3a5f)', accent:'#EF4444' },
        ]},
      ],
    },
    {
      id:'boy-spongebob',name:'Bob Esponja',
      img:'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#FBBF24',defaultBg:'dark-blue',
      heroStyle:'color:#FBBF24',overlayStyle:'',
      tweaks:[
        { type:'theme', label:'Personagem', key:'colorTheme', default:'bob', options:[
          { key:'bob',      label:'🧽 Bob Esponja',bg:'linear-gradient(160deg,#003a8c,#0055cc)', accent:'#FBBF24' },
          { key:'patrick',  label:'⭐ Patrick',   bg:'linear-gradient(160deg,#2d0020,#7f1d5a)', accent:'#F472B6' },
          { key:'lula',     label:'🐙 Lula Mosk.',bg:'linear-gradient(160deg,#1a0a3d,#3b1a6b)', accent:'#A78BFA' },
        ]},
      ],
    },
    {
      id:'boy-fotos',name:'Com suas fotos 📷',
      img:'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80',
      supportsHeroUpload:true,
      defaultAccent:'#60A5FA',defaultBg:'dark-blue',
      heroStyle:'color:#60A5FA',overlayStyle:'',
      tweaks:[
        { type:'hero', label:'Foto de fundo' },
        { type:'accent', label:'Cor de destaque' },
      ],
    },
  ],
  // ── MENINA ──
  'menina': [
    {
      id:'girl-ariel',name:'Pequena Sereia',
      img:'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#60A5FA',defaultBg:'mint',
      heroStyle:'color:#60A5FA',overlayStyle:'',
      tweaks:[
        { type:'theme', label:'Mar', key:'colorTheme', default:'oceano', options:[
          { key:'oceano',   label:'🌊 Oceano',    bg:'linear-gradient(160deg,#001a3d,#003370)', accent:'#60A5FA' },
          { key:'coral',    label:'🐚 Coral',     bg:'linear-gradient(160deg,#0d3320,#065f46)', accent:'#34D399' },
          { key:'roxo',     label:'🔮 Mágico',    bg:'linear-gradient(160deg,#1e0a2a,#6b21a8)', accent:'#C084FC' },
          { key:'dourado',  label:'✨ Dourado',   bg:'linear-gradient(160deg,#1a0a3d,#3b1a6b)', accent:'#FCD34D' },
        ]},
      ],
    },
    {
      id:'girl-cinderela',name:'Cinderela',
      img:'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#93C5FD',defaultBg:'dark-blue',
      heroStyle:'color:#93C5FD',overlayStyle:'',
      tweaks:[
        { type:'theme', label:'Castelo', key:'colorTheme', default:'azul', options:[
          { key:'azul',     label:'💙 Azul Real',  bg:'linear-gradient(160deg,#0a1040,#1a2070)', accent:'#93C5FD' },
          { key:'dourado',  label:'✨ Dourado',    bg:'linear-gradient(160deg,#1a0a3d,#3b1a6b)', accent:'#FCD34D' },
          { key:'rosa',     label:'🌸 Rosa',       bg:'linear-gradient(160deg,#2d0020,#6b0030)', accent:'#F9A8D4' },
          { key:'prata',    label:'🥈 Prata',      bg:'linear-gradient(160deg,#111,#2a2a3a)',     accent:'#E5E7EB' },
        ]},
      ],
    },
    {
      id:'girl-minnie',name:'Minnie Mouse',
      img:'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#F472B6',defaultBg:'violet',
      heroStyle:'color:#F472B6',overlayStyle:'',
      tweaks:[
        { type:'theme', label:'Laço', key:'colorTheme', default:'rosa', options:[
          { key:'rosa',     label:'🎀 Rosa Clás.', bg:'linear-gradient(160deg,#2d0010,#6b0030)', accent:'#F472B6' },
          { key:'vermelho', label:'❤️ Vermelho',  bg:'linear-gradient(160deg,#1a0000,#5a0000)', accent:'#EF4444' },
          { key:'lilas',    label:'💜 Lilás',     bg:'linear-gradient(160deg,#1e0a2a,#4c1d95)', accent:'#C084FC' },
          { key:'preto',    label:'🖤 Chique',    bg:'linear-gradient(160deg,#050505,#1a0a0a)', accent:'#F472B6' },
        ]},
      ],
    },
    {
      id:'girl-ursinha',name:'Ursinha Fofa',
      img:'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#FCD34D',defaultBg:'coral',
      heroStyle:'color:#FCD34D',overlayStyle:'',
      tweaks:[
        { type:'theme', label:'Pelagem', key:'colorTheme', default:'mel', options:[
          { key:'mel',      label:'🍯 Mel',        bg:'linear-gradient(160deg,#1a0a00,#3d2000)', accent:'#FCD34D' },
          { key:'rosa',     label:'🐻‍❄️ Rosa',    bg:'linear-gradient(160deg,#2d0010,#6b0030)', accent:'#F9A8D4' },
          { key:'lavanda',  label:'💜 Lavanda',   bg:'linear-gradient(160deg,#1e0a2a,#4c1d95)', accent:'#C084FC' },
          { key:'menta',    label:'🌿 Menta',     bg:'linear-gradient(160deg,#0d2a10,#065f46)', accent:'#6EE7B7' },
        ]},
      ],
    },
    {
      id:'girl-fotos',name:'Com suas fotos 📷',
      img:'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&q=80',
      supportsHeroUpload:true,
      defaultAccent:'#F472B6',defaultBg:'transparent',
      heroStyle:'color:#fff',overlayStyle:'',
      tweaks:[
        { type:'hero', label:'Foto de fundo' },
        { type:'accent', label:'Cor de destaque' },
      ],
    },
  ],
  // ── CASAMENTO ──
  'casamento': [
    {
      id:'wed-estrelada',name:'Noite Estrelada',
      img:'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#FFD93D',defaultBg:'dark-purple',
      heroStyle:'color:#FFD93D',overlayStyle:'background:linear-gradient(to bottom,rgba(15,5,25,.1),rgba(15,5,25,.82))',
      tweaks:[
        { type:'theme', label:'Céu noturno', key:'colorTheme', default:'dourado', options:[
          { key:'dourado',  label:'⭐ Dourado',   bg:'linear-gradient(160deg,#08030f,#1a0a3d)', accent:'#FFD93D' },
          { key:'prata',    label:'🌙 Prata',     bg:'linear-gradient(160deg,#050515,#0f0f30)', accent:'#E5E7EB' },
          { key:'rose',     label:'🌹 Rose Gold', bg:'linear-gradient(160deg,#1a0808,#3d1010)', accent:'#F9A8D4' },
          { key:'esmeralda',label:'💚 Esmeralda', bg:'linear-gradient(160deg,#03100a,#0d3320)', accent:'#6EE7B7' },
        ]},
      ],
    },
    {
      id:'wed-jardim',name:'Jardim Romântico',
      img:'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#FFFFFF',defaultBg:'dark-green',
      heroStyle:'color:#fff',overlayStyle:'background:linear-gradient(to bottom,rgba(5,25,10,.15),rgba(5,25,10,.8))',
      tweaks:[
        { type:'theme', label:'Jardim', key:'colorTheme', default:'verde', options:[
          { key:'verde',    label:'🌿 Verde',     bg:'linear-gradient(160deg,#032010,#0d3320)', accent:'#FFFFFF' },
          { key:'rosa',     label:'🌸 Rosado',    bg:'linear-gradient(160deg,#1a0010,#4a0030)', accent:'#F9A8D4' },
          { key:'branco',   label:'🤍 Branco',    bg:'#fafdf6',                                  accent:'#6B7280' },
          { key:'lavanda',  label:'💜 Lavanda',   bg:'linear-gradient(160deg,#1e0a2a,#4c1d95)', accent:'#C084FC' },
        ]},
      ],
    },
    {
      id:'wed-rosegold',name:'Rose Gold',
      img:'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#FFD93D',defaultBg:'rose-gold',
      heroStyle:'color:#fff',overlayStyle:'background:linear-gradient(to bottom,rgba(100,30,20,.1),rgba(100,30,20,.8))',
      tweaks:[
        { type:'theme', label:'Metal', key:'colorTheme', default:'rose', options:[
          { key:'rose',     label:'🌹 Rose Gold',  bg:'linear-gradient(160deg,#2a0a08,#5c1a10)', accent:'#FFD93D' },
          { key:'ouro',     label:'✨ Ouro',       bg:'linear-gradient(160deg,#1a0f00,#3d2500)', accent:'#FCD34D' },
          { key:'prata',    label:'🥈 Prata',      bg:'linear-gradient(160deg,#111,#2a2a2a)',     accent:'#E5E7EB' },
          { key:'cobre',    label:'🟤 Cobre',      bg:'linear-gradient(160deg,#2a1200,#5c2800)', accent:'#D97706' },
        ]},
      ],
    },
    {
      id:'wed-fotos',name:'Com suas fotos 📷',
      img:'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
      supportsHeroUpload:true,
      defaultAccent:'#FFFFFF',defaultBg:'transparent',
      heroStyle:'color:#fff',overlayStyle:'background:linear-gradient(to bottom,rgba(0,0,0,.05),rgba(0,0,0,.6))',
      tweaks:[
        { type:'hero', label:'Foto de fundo' },
        { type:'accent', label:'Cor de destaque' },
      ],
    },
  ],
  // ── CHÁ / REVELAÇÃO ──
  'cha': [
    {
      id:'cha-pastel',name:'Pastel Delicado',
      img:'https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#F472B6',defaultBg:'violet',
      heroStyle:'color:#F472B6',overlayStyle:'background:linear-gradient(to bottom,rgba(40,5,50,.1),rgba(40,5,50,.8))',
      tweaks:[
        { type:'theme', label:'Tom pastel', key:'colorTheme', default:'rosa', options:[
          { key:'rosa',     label:'🌸 Rosa',      bg:'linear-gradient(160deg,#fdf0ff,#f5e6ff)', accent:'#F472B6', textDark:true },
          { key:'azul',     label:'💙 Azul',      bg:'linear-gradient(160deg,#eff6ff,#dbeafe)', accent:'#60A5FA', textDark:true },
          { key:'verde',    label:'🌿 Verde',     bg:'linear-gradient(160deg,#f0fdf4,#dcfce7)', accent:'#4ADE80', textDark:true },
          { key:'amarelo',  label:'🌼 Amarelo',   bg:'linear-gradient(160deg,#fefce8,#fef9c3)', accent:'#EAB308', textDark:true },
        ]},
      ],
    },
    {
      id:'cha-revelacao-azul',name:'Revelação — Menino',
      img:'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#60A5FA',defaultBg:'dark-blue',
      heroStyle:'color:#60A5FA',overlayStyle:'background:linear-gradient(to bottom,rgba(5,15,40,.15),rgba(5,15,40,.82))',
      tweaks:[
        { type:'accent', label:'Cor de destaque' },
      ],
    },
    {
      id:'cha-revelacao-rosa',name:'Revelação — Menina',
      img:'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#F472B6',defaultBg:'violet',
      heroStyle:'color:#F472B6',overlayStyle:'background:linear-gradient(to bottom,rgba(40,5,50,.1),rgba(40,5,50,.8))',
      tweaks:[
        { type:'accent', label:'Cor de destaque' },
      ],
    },
    {
      id:'cha-fotos',name:'Com suas fotos 📷',
      img:'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=80',
      supportsHeroUpload:true,
      defaultAccent:'#F472B6',defaultBg:'transparent',
      heroStyle:'color:#fff',overlayStyle:'background:linear-gradient(to bottom,rgba(0,0,0,.05),rgba(0,0,0,.65))',
      tweaks:[
        { type:'hero', label:'Foto de fundo' },
        { type:'accent', label:'Cor de destaque' },
      ],
    },
  ],
  // ── GERAL ──
  'aniversario-adulto': [
    {
      id:'aniv-neon',name:'Neon Night',
      img:'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#FFD93D',defaultBg:'dark-purple',
      heroStyle:'color:#FFD93D;text-shadow:0 0 20px rgba(255,217,61,.5)',
      overlayStyle:'background:linear-gradient(to bottom,rgba(26,10,30,.3),rgba(26,10,30,.85))',
      tweaks:[
        { type:'theme', label:'Cor neon', key:'colorTheme', default:'amarelo', options:[
          { key:'amarelo',  label:'💛 Amarelo',   bg:'linear-gradient(160deg,#0a0010,#1a0033)', accent:'#FFD93D' },
          { key:'rosa',     label:'🩷 Pink',      bg:'linear-gradient(160deg,#0a0010,#330010)', accent:'#FF3D6B' },
          { key:'azul',     label:'💙 Azul',      bg:'linear-gradient(160deg,#000a20,#001055)', accent:'#60A5FA' },
          { key:'verde',    label:'💚 Verde',     bg:'linear-gradient(160deg,#000a05,#002010)', accent:'#34D399' },
          { key:'roxo',     label:'💜 Roxo',      bg:'linear-gradient(160deg,#0a0020,#200055)', accent:'#A78BFA' },
        ]},
      ],
    },
    {
      id:'aniv-tropical',name:'Tropical Party',
      img:'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80',
      supportsHeroUpload:false,
      defaultAccent:'#34D399',defaultBg:'dark-green',
      heroStyle:'color:#34D399',
      overlayStyle:'background:linear-gradient(to bottom,rgba(10,30,10,.2),rgba(10,30,10,.8))',
      tweaks:[
        { type:'accent', label:'Cor de destaque' },
      ],
    },
    {
      id:'aniv-elegante',name:'Elegante',
      img:'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600&q=80',
      supportsHeroUpload:true,
      defaultAccent:'#FFD93D',defaultBg:'rose-gold',
      heroStyle:'color:#FFD93D',
      overlayStyle:'background:linear-gradient(to bottom,rgba(80,10,10,.2),rgba(50,5,5,.85))',
      tweaks:[
        { type:'hero', label:'Foto de fundo' },
        { type:'accent', label:'Cor de destaque' },
      ],
    },
    {
      id:'aniv-fotos',name:'Com suas fotos 📷',
      img:'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80',
      supportsHeroUpload:true,
      defaultAccent:'#F472B6',defaultBg:'violet',
      heroStyle:'color:#F472B6',
      overlayStyle:'background:linear-gradient(to bottom,rgba(30,10,40,.1),rgba(30,10,40,.82))',
      tweaks:[
        { type:'hero', label:'Foto de fundo' },
        { type:'accent', label:'Cor de destaque' },
      ],
    },
  ],
  // ── CUSTOM (templates criados pelo admin) ──
  'custom': [],
};

const BG_GRADIENTS = {
  'dark-purple':'linear-gradient(135deg,#1a0a1e,#2d0a3a)',
  'dark-blue':'linear-gradient(135deg,#0a1628,#1e3a5f)',
  'dark-green':'linear-gradient(135deg,#0d2a10,#1a4020)',
  'dark-brown':'linear-gradient(135deg,#2a1a0a,#3d1a0d)',
  'coral':'linear-gradient(135deg,#FF3D6B,#ff7043)',
  'violet':'linear-gradient(135deg,#1e0a2a,#6b21a8)',
  'rose-gold':'linear-gradient(135deg,#c0392b,#f39c12)',
  'mint':'linear-gradient(135deg,#134e4a,#0d9488)',
  'transparent':'transparent',
};

function getTemplate(id){
  for(const cat of Object.values(TEMPLATES)){
    const t = cat.find(t=>t.id===id);
    if(t) return t;
  }
  return null;
}

function getCurrentTemplate(){
  return getTemplate(state.tplId) || TEMPLATES['aniversario-adulto'][0];
}

// state mutável usado pelo renderer e getCurrentTemplate
let state = { tplId:'', themeBg:null, themeTextDark:false };
function getCurrentTemplate(){ return getTemplate(state.tplId) || {img:'',defaultAccent:'#FFD93D'}; }

// dados de exemplo para o preview
const __SAMPLE = {
  titulo:'Festa de Aniversário', nome:'Maria Clara', data:'2026-09-12',
  hora:'19:00', horaFim:'', local:'Salão Estrela', endereco:'Rua das Flores, 123',
  idade:'7', dress:'Esporte fino', msg:'Sua presença é o nosso melhor presente!',
  gifts:[], heroPhotoUrl:''
};
function __buildPreviewState(tpl){
  const s = Object.assign({}, __SAMPLE, { tplId: tpl.id });
  s.accent = tpl.defaultAccent || '#FFD93D';
  s.themeBg = null; s.themeTextDark = false;
  (tpl.tweaks||[]).forEach(tw=>{
    if(tw.type==='theme' && tw.options){
      const def = tw.options.find(o=>o.key===tw.default) || tw.options[0];
      if(def){ if(def.bg) s.themeBg = def.bg; if(def.accent) s.accent = def.accent; if(def.textDark) s.themeTextDark = true; }
    }
  });
  return s;
}
function renderTemplateHTML(tplId, s){
  const tpl = getCurrentTemplate();
  const heroImg = s.heroPhotoUrl || tpl.img;
  const ac = s.accent || tpl.defaultAccent || '#FFD93D';

  // Resolve background: theme tweak overrides defaultBg
  const themeBg = state.themeBg || null;
  const themeTextDark = state.themeTextDark || false;
  // Helper to get bg string for templates that use theme bg
  function getBg(fallback){ return themeBg || fallback; }
  // Helper for text color — dark bg = white text, light bg = dark text
  function getTextColor(defaultDark){ return (themeTextDark || defaultDark) ? '#1A0A00' : '#fff'; }

  const date = s.data ? new Date(s.data+'T12:00:00') : null;
  const dateStr = date ? date.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : '—';
  const dateShort = date ? date.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'}) : '—';
  let days='—';
  if(date){ const d=Math.floor((date-new Date())/86400000); days=d>0?d+'':'🎉'; }
  // Horário formatado com término opcional
  const _hora = s.hora || '';
  const _horaFim = s.horaFim || '';
  const horaDisplay = _hora ? (_horaFim ? `das ${_hora} às ${_horaFim}` : _hora) : '';

  const giftsChips = s.gifts.slice(0,3).map(g=>`
    <div style="display:flex;align-items:center;gap:.4rem;background:rgba(255,255,255,.12);border-radius:8px;padding:.35rem .65rem;font-size:.75rem;color:inherit">
      ${g.imageUrl?`<img src="${g.imageUrl}" style="width:14px;height:14px;border-radius:3px;object-fit:cover"/>`:'🎁'}
      ${g.name}
    </div>`).join('');

  const rsvpBtn = `<div style="background:${ac};color:${ac==='#FFFFFF'?'#1A0A00':'#1a0a00'};font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem;cursor:pointer">✅ Confirmar presença</div>`;

  // ── LAYOUTS POR TEMPLATE ──

  // ── 1. NEON NIGHT — fundo escuro, texto brilhante, moldura neon ──
  if(tplId==='aniv-neon') return `
    <div style="background:${getBg('#0a0010')};min-height:100%;font-family:'Nunito',sans-serif;color:#fff;position:relative;overflow:hidden">
      <div style="position:absolute;inset:0;background-image:url('${heroImg}');background-size:cover;background-position:center;opacity:.15"></div>
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,${ac},#ff3d6b,${ac})"></div>
      <div style="position:relative;padding:2.5rem 1.5rem 1.5rem;text-align:center">
        <div style="display:inline-block;border:1px solid ${ac};border-radius:99px;padding:.25rem .9rem;font-size:.65rem;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:${ac};margin-bottom:1rem">✦ Você está convidado ✦</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(2rem,8vw,3rem);font-weight:900;font-style:italic;line-height:1;color:${ac};text-shadow:0 0 40px ${ac}88;margin-bottom:.5rem">${s.titulo||'Festa!'}</div>
        <div style="font-size:1.1rem;font-weight:700;color:rgba(255,255,255,.7);margin-bottom:1.5rem">${s.nome||'Nome do homenageado'}</div>
        <div style="display:inline-flex;flex-direction:column;gap:.4rem;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:1rem 1.5rem;margin-bottom:1.5rem;min-width:200px">
          <div style="font-size:.85rem;color:rgba(255,255,255,.6)">📅 ${dateStr}</div>
          ${horaDisplay?`<div style="font-size:.85rem;color:rgba(255,255,255,.6)">⏰ ${horaDisplay}</div>`:''}
          ${s.local?`<div style="font-size:.85rem;color:rgba(255,255,255,.6)">📍 ${s.local}</div>`:''}
          ${s.dress?`<div style="font-size:.85rem;color:rgba(255,255,255,.6)">👗 ${s.dress}</div>`:''}
        </div>
        <div style="display:flex;justify-content:center;gap:.5rem;margin-bottom:1.5rem">
          <div style="text-align:center;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:.75rem 1.25rem">
            <div style="font-family:'Fraunces',serif;font-size:2rem;font-weight:900;color:${ac}">${days}</div>
            <div style="font-size:.6rem;color:rgba(255,255,255,.4);letter-spacing:.1em;text-transform:uppercase">dias</div>
          </div>
        </div>
        ${s.msg?`<div style="background:rgba(255,255,255,.04);border-left:3px solid ${ac};border-radius:0 8px 8px 0;padding:.85rem 1rem;font-size:.85rem;color:rgba(255,255,255,.6);line-height:1.6;text-align:left;margin-bottom:1rem;font-style:italic">"${s.msg}"</div>`:''}
        ${rsvpBtn}
        ${s.gifts.length?`<div style="margin-top:1rem"><div style="font-size:.65rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:.5rem">🎁 Lista de presentes</div><div style="display:flex;flex-wrap:wrap;gap:.35rem;justify-content:center">${giftsChips}</div></div>`:''}
      </div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,${ac},#ff3d6b,${ac})"></div>
    </div>`;

  // ── 2. TROPICAL PARTY — fundo vibrante, círculo de foto central ──
  if(tplId==='aniv-tropical') return `
    <div style="background:linear-gradient(160deg,#0d3320,#1a5c3a);min-height:100%;font-family:'Nunito',sans-serif;color:#fff;overflow:hidden;position:relative">
      <div style="position:absolute;top:-60px;right:-60px;width:200px;height:200px;background:${ac};opacity:.08;border-radius:50%"></div>
      <div style="position:absolute;bottom:-40px;left:-40px;width:160px;height:160px;background:${ac};opacity:.08;border-radius:50%"></div>
      <div style="position:relative;padding:2rem 1.5rem;text-align:center">
        <div style="width:110px;height:110px;border-radius:50%;overflow:hidden;margin:0 auto 1rem;border:4px solid ${ac};box-shadow:0 0 0 8px ${ac}22">
          <img src="${heroImg}" style="width:100%;height:100%;object-fit:cover"/>
        </div>
        <div style="font-size:.65rem;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:${ac};margin-bottom:.4rem">🌺 Você está convidado!</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.8rem,7vw,2.6rem);font-weight:900;font-style:italic;line-height:1.1;margin-bottom:.3rem">${s.titulo||'Festa!'}</div>
        <div style="font-size:1rem;color:rgba(255,255,255,.7);margin-bottom:1.5rem">${s.nome||''}</div>
        <div style="background:rgba(255,255,255,.08);border-radius:16px;padding:1rem;margin-bottom:1.5rem;display:flex;flex-direction:column;gap:.4rem">
          ${[['📅',dateStr],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local],[s.dress?'👗':null,s.dress]].filter(x=>x[0]).map(([i,v])=>`<div style="display:flex;align-items:center;gap:.5rem;font-size:.82rem"><span>${i}</span><span>${v}</span></div>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:1.5rem;text-align:center">
          ${[['Dias',days],['Hora',horaDisplay||'—'],['Local',s.local?s.local.split(',')[0]:'—']].map(([l,v])=>`<div style="background:rgba(255,255,255,.07);border-radius:10px;padding:.65rem .25rem"><div style="font-family:'Fraunces',serif;font-size:1.1rem;font-weight:900;color:${ac}">${v}</div><div style="font-size:.6rem;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.08em">${l}</div></div>`).join('')}
        </div>
        ${s.msg?`<div style="font-style:italic;font-size:.85rem;color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:.85rem;margin-bottom:1rem;line-height:1.6">"${s.msg}"</div>`:''}
        ${rsvpBtn}
      </div>
    </div>`;

  // ── 3. ELEGANTE — layout minimalista, foto full, texto sobreposto em baixo ──
  if(tplId==='aniv-elegante') return `
    <div style="background:#fff;min-height:100%;font-family:'Nunito',sans-serif;color:#1A0A00;overflow:hidden">
      <div style="height:260px;position:relative;overflow:hidden">
        <img src="${heroImg}" style="width:100%;height:100%;object-fit:cover;display:block"/>
        <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 30%,rgba(0,0,0,.75))"></div>
        <div style="position:absolute;bottom:1.25rem;left:1.25rem;right:1.25rem">
          <div style="font-size:.6rem;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:${ac};margin-bottom:.35rem">Você está convidado</div>
          <div style="font-family:'Fraunces',serif;font-size:clamp(1.6rem,6vw,2.4rem);font-weight:900;font-style:italic;color:#fff;line-height:1.1">${s.titulo||'Celebração'}</div>
        </div>
      </div>
      <div style="padding:1.5rem">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.25rem;padding-bottom:1.25rem;border-bottom:1px solid rgba(26,10,0,.08)">
          <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,${ac},${ac}88);display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-size:1.4rem;font-weight:900;font-style:italic;flex-shrink:0">${days}</div>
          <div>
            <div style="font-size:.65rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:rgba(26,10,0,.3)">dias para o evento</div>
            <div style="font-weight:800;font-size:.95rem">${s.nome||'Nome do homenageado'}</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:.55rem;margin-bottom:1.25rem">
          ${[['📅',dateStr],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local],[s.dress?'👗':null,s.dress]].filter(x=>x[0]).map(([i,v])=>`<div style="display:flex;gap:.6rem;font-size:.85rem;align-items:flex-start"><span style="flex-shrink:0">${i}</span><span style="color:rgba(26,10,0,.65)">${v}</span></div>`).join('')}
        </div>
        ${s.msg?`<div style="background:rgba(26,10,0,.03);border-left:3px solid ${ac};padding:.8rem 1rem;border-radius:0 8px 8px 0;font-style:italic;font-size:.85rem;color:rgba(26,10,0,.55);margin-bottom:1rem;line-height:1.6">"${s.msg}"</div>`:''}
        <div style="background:${ac};color:${ac==='#FFFFFF'?'#1A0A00':'#1a0a00'};font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem;cursor:pointer">✅ Confirmar presença</div>
        ${s.gifts.length?`<div style="margin-top:1rem;display:flex;flex-wrap:wrap;gap:.3rem">${s.gifts.slice(0,3).map(g=>`<div style="background:rgba(26,10,0,.04);border:1px solid rgba(26,10,0,.08);border-radius:8px;padding:.35rem .65rem;font-size:.72rem;display:flex;gap:.3rem;align-items:center">${g.imageUrl?`<img src="${g.imageUrl}" style="width:14px;height:14px;border-radius:2px;object-fit:cover"/>`:'🎁'} ${g.name}</div>`).join('')}</div>`:''}
      </div>
    </div>`;

  // ── 4. COM FOTOS (aniversário adulto) — foto de fundo total, texto centralizado ──
  if(tplId==='aniv-fotos') return `
    <div style="min-height:100%;font-family:'Nunito',sans-serif;position:relative;overflow:hidden">
      <img src="${heroImg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"/>
      <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.2),rgba(0,0,0,.75))"></div>
      <div style="position:relative;padding:3rem 1.5rem 2rem;text-align:center;color:#fff;min-height:580px;display:flex;flex-direction:column;justify-content:space-between">
        <div>
          <div style="font-size:.6rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:${ac};margin-bottom:.75rem">✦ Convite especial ✦</div>
          <div style="font-family:'Fraunces',serif;font-size:clamp(2.2rem,8vw,3.2rem);font-weight:900;font-style:italic;line-height:1;text-shadow:0 2px 16px rgba(0,0,0,.5);margin-bottom:.5rem;color:${ac}">${s.titulo||'Festa!'}</div>
          <div style="font-size:1.1rem;font-weight:700;color:rgba(255,255,255,.85);margin-bottom:2rem">${s.nome||''}</div>
        </div>
        <div>
          <div style="background:rgba(255,255,255,.12);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.2);border-radius:20px;padding:1.25rem;margin-bottom:1.5rem">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;text-align:left">
              <div style="font-size:.78rem;color:rgba(255,255,255,.7)">📅 ${dateShort}</div>
              <div style="font-size:.78rem;color:rgba(255,255,255,.7)">${horaDisplay?'⏰ '+horaDisplay:''}</div>
              <div style="font-size:.78rem;color:rgba(255,255,255,.7);grid-column:1/-1">${s.local?'📍 '+s.local:''}</div>
              <div style="font-size:.78rem;color:rgba(255,255,255,.7);grid-column:1/-1">${s.dress?'👗 '+s.dress:''}</div>
            </div>
            ${s.msg?`<div style="border-top:1px solid rgba(255,255,255,.15);margin-top:.75rem;padding-top:.75rem;font-style:italic;font-size:.82rem;color:rgba(255,255,255,.65);line-height:1.5">"${s.msg}"</div>`:''}
          </div>
          <div style="background:${ac};color:#1a0a00;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem">✅ Confirmar presença</div>
          ${s.gifts.length?`<div style="margin-top:.75rem;display:flex;flex-wrap:wrap;gap:.3rem;justify-content:center">${giftsChips}</div>`:''}
        </div>
      </div>
    </div>`;

  // ── 5. BALÕES COLORIDOS (infantil) — fundo branco, balões decorativos ──
  if(tplId==='kids-baloes') return `
    <div style="background:#fff5f0;min-height:100%;font-family:'Nunito',sans-serif;overflow:hidden;position:relative">
      <div style="position:absolute;top:0;left:0;right:0;height:180px;background:linear-gradient(135deg,${ac},#FF3D6B);overflow:hidden">
        <img src="${heroImg}" style="width:100%;height:100%;object-fit:cover;opacity:.3;mix-blend-mode:overlay"/>
        <div style="position:absolute;top:.5rem;left:50%;transform:translateX(-50%);font-size:2rem;opacity:.4">🎈🎈🎈</div>
      </div>
      <div style="position:relative;padding-top:120px;padding:0 1.25rem;text-align:center">
        <div style="width:90px;height:90px;border-radius:50%;overflow:hidden;border:4px solid #fff;margin:-45px auto 1rem;box-shadow:0 8px 24px rgba(0,0,0,.15);position:relative;z-index:1">
          <img src="${heroImg}" style="width:100%;height:100%;object-fit:cover"/>
        </div>
        <div style="font-size:.65rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:${ac};margin-bottom:.3rem">🎉 Festa de Aniversário!</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.8rem,7vw,2.6rem);font-weight:900;font-style:italic;color:#1A0A00;line-height:1.1;margin-bottom:.3rem">${s.titulo||'Festa!'}</div>
        <div style="font-weight:700;color:rgba(26,10,0,.5);margin-bottom:1.5rem">${s.nome||''}</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:1.5rem">
          ${[['🗓',dateShort,'Data'],['⏰',horaDisplay||'—','Hora'],['📍',s.local?s.local.split(',')[0]:'—','Local']].map(([i,v,l])=>`<div style="background:#fff;border-radius:12px;padding:.65rem .35rem;box-shadow:0 2px 8px rgba(0,0,0,.06)"><div style="font-size:1.1rem">${i}</div><div style="font-size:.72rem;font-weight:800;color:#1A0A00">${v}</div><div style="font-size:.58rem;color:rgba(26,10,0,.3);text-transform:uppercase;letter-spacing:.06em">${l}</div></div>`).join('')}
        </div>
        ${s.dress?`<div style="background:#fff;border-radius:10px;padding:.6rem;font-size:.8rem;color:rgba(26,10,0,.6);margin-bottom:1rem;box-shadow:0 2px 8px rgba(0,0,0,.06)">👗 Dress code: <strong>${s.dress}</strong></div>`:''}
        ${s.msg?`<div style="background:rgba(255,61,107,.06);border-radius:12px;padding:.85rem;font-style:italic;font-size:.85rem;color:rgba(26,10,0,.6);margin-bottom:1rem;line-height:1.6">"${s.msg}"</div>`:''}
        <div style="background:linear-gradient(135deg,${ac},#FF3D6B);color:#fff;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem;margin-bottom:1rem;box-shadow:0 6px 20px rgba(255,61,107,.3)">✅ Confirmar presença</div>
        ${s.gifts.length?`<div style="display:flex;flex-wrap:wrap;gap:.3rem;justify-content:center;margin-bottom:1.5rem">${s.gifts.slice(0,3).map(g=>`<div style="background:#fff;border:1px solid rgba(26,10,0,.08);border-radius:8px;padding:.35rem .65rem;font-size:.72rem;display:flex;gap:.3rem;align-items:center;box-shadow:0 1px 4px rgba(0,0,0,.05)">${g.imageUrl?`<img src="${g.imageUrl}" style="width:14px;height:14px;border-radius:2px;object-fit:cover"/>`:'🎁'} ${g.name}</div>`).join('')}</div>`:''}
      </div>
    </div>`;

  // ── 6. UNICÓRNIO — gradiente roxo/rosa, elementos mágicos ──
  if(tplId==='kids-unicorn') return `
    <div style="background:linear-gradient(160deg,#2d0a4a,#6b21a8,#c026d3);min-height:100%;font-family:'Nunito',sans-serif;color:#fff;overflow:hidden;position:relative">
      <div style="position:absolute;top:0;left:0;right:0;height:100%;opacity:.08;background-image:url('${heroImg}');background-size:cover"></div>
      <div style="position:absolute;top:1rem;right:1rem;font-size:3rem;opacity:.3">🦄</div>
      <div style="position:absolute;bottom:2rem;left:1rem;font-size:2rem;opacity:.2">⭐✨🌟</div>
      <div style="position:relative;padding:2.5rem 1.5rem 2rem;text-align:center">
        <div style="font-size:3rem;margin-bottom:.5rem">🦄</div>
        <div style="font-size:.6rem;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:${ac};margin-bottom:.4rem">✨ Você está convidada!</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(2rem,7vw,2.8rem);font-weight:900;font-style:italic;line-height:1.1;margin-bottom:.3rem;color:${ac}">${s.titulo||'Festa!'}</div>
        <div style="font-size:1rem;color:rgba(255,255,255,.75);margin-bottom:1.75rem">${s.nome||''}</div>
        <div style="background:rgba(255,255,255,.1);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.15);border-radius:20px;padding:1.25rem;margin-bottom:1.5rem">
          <div style="display:flex;flex-direction:column;gap:.4rem">
            <div style="font-size:.82rem;color:rgba(255,255,255,.75)">🗓 ${dateStr}</div>
            ${horaDisplay?`<div style="font-size:.82rem;color:rgba(255,255,255,.75)">⏰ ${horaDisplay}</div>`:''}
            ${s.local?`<div style="font-size:.82rem;color:rgba(255,255,255,.75)">📍 ${s.local}</div>`:''}
            ${s.dress?`<div style="font-size:.82rem;color:rgba(255,255,255,.75)">👗 ${s.dress}</div>`:''}
          </div>
          ${s.msg?`<div style="border-top:1px solid rgba(255,255,255,.12);margin-top:.75rem;padding-top:.75rem;font-style:italic;font-size:.82rem;color:rgba(255,255,255,.6);line-height:1.5">"${s.msg}"</div>`:''}
        </div>
        <div style="display:flex;justify-content:center;gap:.5rem;margin-bottom:1.5rem">
          <div style="background:rgba(255,255,255,.12);border-radius:12px;padding:.65rem 1.25rem;text-align:center"><div style="font-family:'Fraunces',serif;font-size:1.8rem;font-weight:900;color:${ac}">${days}</div><div style="font-size:.6rem;color:rgba(255,255,255,.4);text-transform:uppercase">dias</div></div>
        </div>
        <div style="background:${ac};color:#2d0a4a;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem;margin-bottom:1rem">✅ Confirmar presença</div>
        ${s.gifts.length?`<div style="display:flex;flex-wrap:wrap;gap:.3rem;justify-content:center">${giftsChips}</div>`:''}
      </div>
    </div>`;

  // ── 7. DINOSSAURO (infantil) — verde escuro, elementos de aventura ──
  if(tplId==='kids-dinossauro') return `
    <div style="background:linear-gradient(160deg,#052a10,#0d4a1a);min-height:100%;font-family:'Nunito',sans-serif;color:#fff;overflow:hidden;position:relative">
      <div style="position:absolute;inset:0;background-image:url('${heroImg}');background-size:cover;background-position:center;opacity:.15"></div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:80px;opacity:.15;font-size:4rem;text-align:center">🦕🌿🦖</div>
      <div style="position:relative;padding:2rem 1.5rem;text-align:center">
        <div style="font-size:3.5rem;margin-bottom:.5rem">🦖</div>
        <div style="background:${ac};color:#052a10;display:inline-block;padding:.2rem .9rem;border-radius:99px;font-size:.65rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;margin-bottom:.75rem">Vem aí!</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.8rem,7vw,2.6rem);font-weight:900;font-style:italic;line-height:1.1;color:${ac};margin-bottom:.35rem">${s.titulo||'Festa!'}</div>
        <div style="font-size:1rem;color:rgba(255,255,255,.65);margin-bottom:1.5rem">${s.nome||''}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin-bottom:1.5rem;text-align:left">
          ${[['📅',dateStr],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local],[s.dress?'👗':null,s.dress]].filter(x=>x[0]).map(([i,v])=>`<div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:.55rem .75rem;font-size:.75rem;display:flex;align-items:center;gap:.35rem"><span>${i}</span><span style="color:rgba(255,255,255,.7)">${v}</span></div>`).join('')}
        </div>
        ${s.msg?`<div style="background:rgba(255,255,255,.05);border-left:3px solid ${ac};border-radius:0 8px 8px 0;padding:.8rem 1rem;font-style:italic;font-size:.82rem;color:rgba(255,255,255,.55);margin-bottom:1rem;line-height:1.5;text-align:left">"${s.msg}"</div>`:''}
        <div style="background:${ac};color:#052a10;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem;margin-bottom:1rem">✅ Confirmar presença</div>
        ${s.gifts.length?`<div style="display:flex;flex-wrap:wrap;gap:.3rem;justify-content:center">${giftsChips}</div>`:''}
      </div>
    </div>`;

  // ── 8. KIDS COM FOTOS — foto circular dupla, fundo suave ──
  if(tplId==='kids-fotos') return `
    <div style="background:linear-gradient(160deg,#fff5f8,#ffeef5);min-height:100%;font-family:'Nunito',sans-serif;color:#1A0A00;overflow:hidden">
      <div style="height:200px;position:relative;overflow:hidden">
        <img src="${heroImg}" style="width:100%;height:100%;object-fit:cover"/>
        <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent,rgba(255,245,248,1))"></div>
      </div>
      <div style="padding:0 1.5rem 2rem;text-align:center;margin-top:-2rem;position:relative">
        <div style="font-size:.65rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:${ac};margin-bottom:.4rem">🎉 Você está convidado!</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.8rem,7vw,2.6rem);font-weight:900;font-style:italic;color:#1A0A00;line-height:1.1;margin-bottom:.3rem">${s.titulo||'Festa!'}</div>
        <div style="color:rgba(26,10,0,.5);font-weight:700;margin-bottom:1.5rem">${s.nome||''}</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:1.25rem">
          ${[['🗓',dateShort,'Data'],['⏰',horaDisplay||'—','Hora'],['📍',s.local?s.local.split(',')[0]:'—','Local']].map(([i,v,l])=>`<div style="background:#fff;border-radius:12px;padding:.65rem .35rem;box-shadow:0 2px 8px rgba(0,0,0,.06)"><div style="font-size:1rem">${i}</div><div style="font-size:.7rem;font-weight:800">${v}</div><div style="font-size:.55rem;color:rgba(26,10,0,.3);text-transform:uppercase">${l}</div></div>`).join('')}
        </div>
        ${s.msg?`<div style="background:#fff;border-radius:12px;padding:.85rem;font-style:italic;font-size:.83rem;color:rgba(26,10,0,.55);margin-bottom:1rem;line-height:1.6;box-shadow:0 2px 8px rgba(0,0,0,.05)">"${s.msg}"</div>`:''}
        <div style="background:${ac};color:${ac==='#FFFFFF'?'#1A0A00':'#fff'};font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem;margin-bottom:1rem;box-shadow:0 6px 20px rgba(255,61,107,.2)">✅ Confirmar presença</div>
      </div>
    </div>`;

  // ── 9. NOITE ESTRELADA (casamento) — escuro luxuoso, estrelas, dourado ──
  if(tplId==='wed-estrelada') return `
    <div style="background:${getBg('#08030f')};min-height:100%;font-family:'Nunito',sans-serif;color:#fff;position:relative;overflow:hidden">
      <div style="position:absolute;inset:0;background-image:url('${heroImg}');background-size:cover;background-position:center;opacity:.25"></div>
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center top,rgba(255,215,61,.05) 0%,transparent 70%)"></div>
      <div style="position:relative;padding:3rem 1.5rem 2rem;text-align:center">
        <div style="font-size:.6rem;font-weight:800;letter-spacing:.25em;text-transform:uppercase;color:${ac};opacity:.7;margin-bottom:1rem">— Celebração de Amor —</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(2rem,7vw,3rem);font-weight:900;font-style:italic;color:${ac};line-height:1;margin-bottom:.5rem;text-shadow:0 0 30px ${ac}44">${s.titulo||'Casamento'}</div>
        <div style="font-family:'Fraunces',serif;font-size:1.1rem;font-style:italic;color:rgba(255,255,255,.55);margin-bottom:.3rem">de</div>
        <div style="font-family:'Fraunces',serif;font-size:1.4rem;font-weight:700;color:rgba(255,255,255,.9);margin-bottom:2rem">${s.nome||'Os Noivos'}</div>
        <div style="width:60px;height:1px;background:${ac};opacity:.4;margin:0 auto 2rem"></div>
        <div style="display:flex;flex-direction:column;gap:.6rem;margin-bottom:2rem">
          ${[['📅',dateStr],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local],[s.dress?'👗':null,s.dress]].filter(x=>x[0]).map(([i,v])=>`<div style="font-size:.85rem;color:rgba(255,255,255,.6);letter-spacing:.02em">${i} ${v}</div>`).join('')}
        </div>
        ${s.msg?`<div style="border:1px solid rgba(255,215,61,.2);border-radius:16px;padding:1.25rem;font-style:italic;font-size:.88rem;color:rgba(255,255,255,.55);margin-bottom:1.5rem;line-height:1.7">"${s.msg}"</div>`:''}
        <div style="background:transparent;border:1px solid ${ac};color:${ac};font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem;letter-spacing:.05em">✅ Confirmar Presença</div>
      </div>
    </div>`;

  // ── 10. JARDIM ROMÂNTICO — branco, flores, delicado ──
  if(tplId==='wed-jardim') return `
    <div style="background:${getBg('#fafdf6')};min-height:100%;font-family:'Nunito',sans-serif;color:${themeBg?'#fff':'#1A0A00'};overflow:hidden">
      <div style="height:220px;position:relative;overflow:hidden">
        <img src="${heroImg}" style="width:100%;height:100%;object-fit:cover"/>
        <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 40%,#fafdf6)"></div>
      </div>
      <div style="padding:0 1.5rem 2rem;text-align:center">
        <div style="font-size:.6rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:${ac};margin-bottom:.5rem">🌸 Você está convidado 🌸</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.8rem,6vw,2.6rem);font-weight:900;font-style:italic;color:#1A0A00;line-height:1.1;margin-bottom:.3rem">${s.titulo||'Casamento'}</div>
        <div style="font-family:'Fraunces',serif;font-size:.95rem;font-style:italic;color:rgba(26,10,0,.4);margin-bottom:.3rem">de</div>
        <div style="font-size:1rem;font-weight:700;color:rgba(26,10,0,.7);margin-bottom:1.5rem">${s.nome||''}</div>
        <div style="display:flex;gap:.4rem;justify-content:center;margin-bottom:1.5rem">
          ${[['📅',dateShort],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local]].filter(x=>x[0]).map(([i,v])=>`<div style="background:rgba(26,10,0,.04);border:1px solid rgba(26,10,0,.07);border-radius:8px;padding:.4rem .7rem;font-size:.75rem;color:rgba(26,10,0,.6)">${i} ${v}</div>`).join('')}
        </div>
        ${s.dress?`<div style="font-size:.8rem;color:rgba(26,10,0,.4);margin-bottom:1.25rem">👗 ${s.dress}</div>`:''}
        ${s.msg?`<div style="font-style:italic;font-size:.85rem;color:rgba(26,10,0,.45);line-height:1.6;margin-bottom:1.25rem;padding:0 .5rem">"${s.msg}"</div>`:''}
        <div style="background:${ac};color:${ac==='#FFFFFF'?'#1A0A00':'#1a0a00'};font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem">✅ Confirmar presença</div>
      </div>
    </div>`;

  // ── 11. ROSE GOLD — fundo morno, dourado rosado ──
  if(tplId==='wed-rosegold') return `
    <div style="background:${getBg('linear-gradient(160deg,#2a0a08,#5c1a10)')};min-height:100%;font-family:'Nunito',sans-serif;color:#fff;overflow:hidden;position:relative">
      <div style="position:absolute;inset:0;background-image:url('${heroImg}');background-size:cover;opacity:.2"></div>
      <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,${ac},transparent)"></div>
      <div style="position:relative;padding:2.5rem 1.5rem 2rem;text-align:center">
        <div style="width:80px;height:80px;border-radius:50%;overflow:hidden;margin:0 auto 1.25rem;border:2px solid ${ac};box-shadow:0 0 0 6px ${ac}22">
          <img src="${heroImg}" style="width:100%;height:100%;object-fit:cover"/>
        </div>
        <div style="font-size:.6rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:${ac};opacity:.8;margin-bottom:.5rem">Com amor, celebramos</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.8rem,7vw,2.8rem);font-weight:900;font-style:italic;color:${ac};line-height:1.1;margin-bottom:.3rem">${s.titulo||'Casamento'}</div>
        <div style="font-size:.95rem;color:rgba(255,255,255,.65);margin-bottom:2rem">${s.nome||''}</div>
        <div style="background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:1.25rem;margin-bottom:1.5rem;display:flex;flex-direction:column;gap:.5rem">
          ${[['📅',dateStr],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local],[s.dress?'👗':null,s.dress]].filter(x=>x[0]).map(([i,v])=>`<div style="font-size:.82rem;color:rgba(255,255,255,.6)">${i} ${v}</div>`).join('')}
        </div>
        ${s.msg?`<div style="border-left:2px solid ${ac};padding:.75rem 1rem;text-align:left;font-style:italic;font-size:.83rem;color:rgba(255,255,255,.5);margin-bottom:1.25rem;line-height:1.6">"${s.msg}"</div>`:''}
        <div style="border:1px solid ${ac};color:${ac};background:transparent;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem">✅ Confirmar presença</div>
        <div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,${ac},transparent)"></div>
      </div>
    </div>`;

  // ── 12. CASAMENTO COM FOTOS — foto full-bleed, informações em card ──
  if(tplId==='wed-fotos') return `
    <div style="min-height:100%;font-family:'Nunito',sans-serif;overflow:hidden;position:relative;background:#000">
      <img src="${heroImg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.6"/>
      <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.1),rgba(0,0,0,.8))"></div>
      <div style="position:relative;padding:3rem 1.5rem 2rem;display:flex;flex-direction:column;min-height:580px;justify-content:flex-end;color:#fff;text-align:center">
        <div style="font-size:.6rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:${ac};margin-bottom:.6rem">— Celebração de amor —</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(2rem,8vw,3rem);font-weight:900;font-style:italic;color:${ac};line-height:1;margin-bottom:.4rem">${s.titulo||'Casamento'}</div>
        <div style="font-size:1rem;color:rgba(255,255,255,.75);margin-bottom:1.5rem">${s.nome||''}</div>
        <div style="background:rgba(255,255,255,.1);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.15);border-radius:16px;padding:1rem;margin-bottom:1rem">
          <div style="display:flex;flex-direction:column;gap:.4rem;font-size:.82rem;color:rgba(255,255,255,.75)">
            <div>📅 ${dateStr}</div>
            ${s.hora?`<div>⏰ ${s.hora}</div>`:''}
            ${s.local?`<div>📍 ${s.local}</div>`:''}
            ${s.dress?`<div>👗 ${s.dress}</div>`:''}
          </div>
          ${s.msg?`<div style="border-top:1px solid rgba(255,255,255,.12);margin-top:.75rem;padding-top:.75rem;font-style:italic;font-size:.8rem;color:rgba(255,255,255,.5);line-height:1.5">"${s.msg}"</div>`:''}
        </div>
        <div style="background:${ac};color:#1a0a00;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem">✅ Confirmar presença</div>
      </div>
    </div>`;

  // ── 13. PASTEL DELICADO (chá) — tons pastel, lacinhos ──
  if(tplId==='cha-pastel') return `
    <div style="background:${getBg('linear-gradient(160deg,#fdf0ff,#f5e6ff)')};min-height:100%;font-family:'Nunito',sans-serif;color:#1A0A00;overflow:hidden">
      <div style="height:180px;position:relative;overflow:hidden">
        <img src="${heroImg}" style="width:100%;height:100%;object-fit:cover"/>
        <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 30%,#fdf0ff)"></div>
      </div>
      <div style="padding:0 1.5rem 2rem;text-align:center">
        <div style="font-size:2rem;margin-bottom:.5rem">👶🏻</div>
        <div style="font-size:.65rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:${ac};margin-bottom:.4rem">Você está convidado!</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.7rem,6vw,2.4rem);font-weight:900;font-style:italic;color:#1A0A00;line-height:1.1;margin-bottom:.3rem">${s.titulo||'Chá de Bebê'}</div>
        <div style="color:rgba(26,10,0,.5);margin-bottom:1.5rem">${s.nome||''}</div>
        <div style="background:#fff;border-radius:16px;padding:1rem;margin-bottom:1.25rem;box-shadow:0 4px 16px rgba(200,100,220,.1)">
          <div style="display:flex;flex-direction:column;gap:.4rem">
            <div style="font-size:.82rem;color:rgba(26,10,0,.6)">📅 ${dateStr}</div>
            ${s.hora?`<div style="font-size:.82rem;color:rgba(26,10,0,.6)">⏰ ${s.hora}</div>`:''}
            ${s.local?`<div style="font-size:.82rem;color:rgba(26,10,0,.6)">📍 ${s.local}</div>`:''}
            ${s.dress?`<div style="font-size:.82rem;color:rgba(26,10,0,.6)">👗 ${s.dress}</div>`:''}
          </div>
        </div>
        ${s.msg?`<div style="background:#fff;border-radius:12px;padding:.85rem;font-style:italic;font-size:.83rem;color:rgba(26,10,0,.5);margin-bottom:1rem;line-height:1.6;box-shadow:0 2px 8px rgba(200,100,220,.08)">"${s.msg}"</div>`:''}
        <div style="background:${ac};color:#fff;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem;box-shadow:0 6px 20px ${ac}44">✅ Confirmar presença</div>
      </div>
    </div>`;

  // ── 14. REVELAÇÃO MENINO — azul, tema espacial ──
  if(tplId==='cha-revelacao-azul') return `
    <div style="background:linear-gradient(160deg,#040d1f,#0a2550);min-height:100%;font-family:'Nunito',sans-serif;color:#fff;overflow:hidden;position:relative">
      <div style="position:absolute;inset:0;background-image:url('${heroImg}');background-size:cover;opacity:.15"></div>
      <div style="position:absolute;top:1rem;right:1rem;font-size:2.5rem;opacity:.25">🚀⭐🌙</div>
      <div style="position:relative;padding:2.5rem 1.5rem 2rem;text-align:center">
        <div style="font-size:3rem;margin-bottom:.5rem">👶💙</div>
        <div style="background:${ac};color:#040d1f;display:inline-block;padding:.25rem 1rem;border-radius:99px;font-size:.65rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;margin-bottom:.75rem">É MENINO!</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.8rem,7vw,2.6rem);font-weight:900;font-style:italic;color:${ac};line-height:1.1;margin-bottom:.3rem">${s.titulo||'Chá Revelação'}</div>
        <div style="color:rgba(255,255,255,.6);margin-bottom:1.75rem">${s.nome||''}</div>
        <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:1.1rem;margin-bottom:1.5rem">
          ${[['📅',dateStr],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local],[s.dress?'👗':null,s.dress]].filter(x=>x[0]).map(([i,v])=>`<div style="font-size:.82rem;color:rgba(255,255,255,.6);margin-bottom:.35rem">${i} ${v}</div>`).join('')}
          ${s.msg?`<div style="border-top:1px solid rgba(255,255,255,.08);margin-top:.7rem;padding-top:.7rem;font-style:italic;font-size:.8rem;color:rgba(255,255,255,.45);line-height:1.5">"${s.msg}"</div>`:''}
        </div>
        <div style="background:${ac};color:#040d1f;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem">✅ Confirmar presença</div>
      </div>
    </div>`;

  // ── 15. REVELAÇÃO MENINA — rosa, tema floral ──
  if(tplId==='cha-revelacao-rosa') return `
    <div style="background:linear-gradient(160deg,#2d0020,#6b0a35);min-height:100%;font-family:'Nunito',sans-serif;color:#fff;overflow:hidden;position:relative">
      <div style="position:absolute;inset:0;background-image:url('${heroImg}');background-size:cover;opacity:.18"></div>
      <div style="position:absolute;top:1rem;right:1rem;font-size:2rem;opacity:.25">🌸🌷💕</div>
      <div style="position:relative;padding:2.5rem 1.5rem 2rem;text-align:center">
        <div style="font-size:3rem;margin-bottom:.5rem">👶💗</div>
        <div style="background:${ac};color:#2d0020;display:inline-block;padding:.25rem 1rem;border-radius:99px;font-size:.65rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;margin-bottom:.75rem">É MENINA!</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.8rem,7vw,2.6rem);font-weight:900;font-style:italic;color:${ac};line-height:1.1;margin-bottom:.3rem">${s.titulo||'Chá Revelação'}</div>
        <div style="color:rgba(255,255,255,.6);margin-bottom:1.75rem">${s.nome||''}</div>
        <div style="background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:1.1rem;margin-bottom:1.5rem">
          ${[['📅',dateStr],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local],[s.dress?'👗':null,s.dress]].filter(x=>x[0]).map(([i,v])=>`<div style="font-size:.82rem;color:rgba(255,255,255,.6);margin-bottom:.35rem">${i} ${v}</div>`).join('')}
          ${s.msg?`<div style="border-top:1px solid rgba(255,255,255,.08);margin-top:.7rem;padding-top:.7rem;font-style:italic;font-size:.8rem;color:rgba(255,255,255,.45);line-height:1.5">"${s.msg}"</div>`:''}
        </div>
        <div style="background:${ac};color:#2d0020;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem">✅ Confirmar presença</div>
      </div>
    </div>`;

  // ── 16. CHÁ COM FOTOS — layout polaroid/scrapbook ──
  if(tplId==='cha-fotos') return `
    <div style="background:linear-gradient(160deg,#fff8f0,#fff0f5);min-height:100%;font-family:'Nunito',sans-serif;color:#1A0A00;overflow:hidden">
      <div style="padding:1.5rem;text-align:center">
        <div style="background:#fff;border-radius:4px;padding:.75rem;box-shadow:0 8px 24px rgba(0,0,0,.12);transform:rotate(-1.5deg);margin-bottom:1.25rem;max-width:240px;margin-left:auto;margin-right:auto">
          <img src="${heroImg}" style="width:100%;aspect-ratio:1;object-fit:cover;display:block;border-radius:2px;margin-bottom:.5rem"/>
          <div style="font-size:.72rem;color:rgba(26,10,0,.4);font-style:italic">${s.nome||'Bebê'} 💕</div>
        </div>
        <div style="font-size:.65rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:${ac};margin-bottom:.4rem">Você está convidado!</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.7rem,6vw,2.4rem);font-weight:900;font-style:italic;color:#1A0A00;line-height:1.1;margin-bottom:1.25rem">${s.titulo||'Chá de Bebê'}</div>
        <div style="background:#fff;border-radius:12px;padding:1rem;margin-bottom:1rem;box-shadow:0 2px 8px rgba(0,0,0,.06);text-align:left">
          ${[['📅',dateStr],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local],[s.dress?'👗':null,s.dress]].filter(x=>x[0]).map(([i,v])=>`<div style="font-size:.82rem;color:rgba(26,10,0,.6);margin-bottom:.3rem;display:flex;gap:.4rem"><span>${i}</span><span>${v}</span></div>`).join('')}
        </div>
        ${s.msg?`<div style="background:#fff;border-radius:12px;padding:.85rem;font-style:italic;font-size:.83rem;color:rgba(26,10,0,.5);margin-bottom:1rem;line-height:1.6;box-shadow:0 2px 8px rgba(0,0,0,.05)">"${s.msg}"</div>`:''}
        <div style="background:${ac};color:${ac==='#FFFFFF'?'#1A0A00':'#fff'};font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem">✅ Confirmar presença</div>
      </div>
    </div>`;

  // ── HOMEM ──

  // ── CHOPE & FUTEBOL ──
  if(tplId==='hom-cerveja') return `
    <div style="background:${getBg('linear-gradient(160deg,#1a0e00,#3d2200)')};min-height:100%;font-family:'Nunito',sans-serif;color:#fff;overflow:hidden;position:relative">
      <div style="position:absolute;inset:0;background-image:url('${heroImg}');background-size:cover;opacity:.18"></div>
      <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#F59E0B,#EF4444,#F59E0B)"></div>
      <div style="position:relative;padding:2.5rem 1.5rem 2rem;text-align:center">
        <div style="font-size:3rem;margin-bottom:.5rem">🍺⚽🎉</div>
        <div style="display:inline-block;background:${ac};color:#1a0e00;padding:.2rem 1rem;border-radius:99px;font-size:.65rem;font-weight:800;letter-spacing:.15em;text-transform:uppercase;margin-bottom:.75rem">Você está convidado!</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(2rem,7vw,3rem);font-weight:900;font-style:italic;color:${ac};line-height:1;margin-bottom:.4rem;text-shadow:0 0 20px ${ac}55">${s.titulo||'Festa do Cara!'}</div>
        <div style="font-size:1.1rem;color:rgba(255,255,255,.7);font-weight:700;margin-bottom:1.75rem">${s.nome||''}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin-bottom:1.5rem;text-align:left">
          ${[['📅',dateStr],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local],[s.dress?'👕':null,s.dress]].filter(x=>x[0]).map(([i,v])=>`<div style="background:rgba(255,255,255,.07);border:1px solid rgba(255,165,0,.2);border-radius:10px;padding:.55rem .75rem;font-size:.75rem;display:flex;gap:.35rem;align-items:center"><span>${i}</span><span style="color:rgba(255,255,255,.75)">${v}</span></div>`).join('')}
        </div>
        ${s.msg?`<div style="background:rgba(245,158,11,.08);border-left:3px solid ${ac};padding:.8rem 1rem;font-style:italic;font-size:.85rem;color:rgba(255,255,255,.55);margin-bottom:1rem;line-height:1.5;text-align:left">"${s.msg}"</div>`:''}
        ${rsvpBtn}
        ${s.gifts.length?`<div style="margin-top:1rem;display:flex;flex-wrap:wrap;gap:.3rem;justify-content:center">${giftsChips}</div>`:''}
      </div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#F59E0B,#EF4444,#F59E0B)"></div>
    </div>`;

  // ── CAMPO DE FUTEBOL ──
  if(tplId==='hom-futebol') return `
    <div style="background:${getBg('linear-gradient(160deg,#052a10,#0a4a1a)')};min-height:100%;font-family:'Nunito',sans-serif;color:#fff;overflow:hidden;position:relative">
      <div style="position:absolute;inset:0;background-image:url('${heroImg}');background-size:cover;opacity:.12"></div>
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:220px;height:140px;border:2px solid rgba(255,255,255,.08);border-radius:4px;pointer-events:none"></div>
      <div style="position:relative;padding:2.5rem 1.5rem 2rem;text-align:center">
        <div style="font-size:3rem;margin-bottom:.75rem">⚽🏆</div>
        <div style="font-size:.65rem;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:${ac};margin-bottom:.4rem">⚡ CONVITE ESPECIAL ⚡</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(2rem,7vw,2.8rem);font-weight:900;font-style:italic;color:#fff;line-height:1.1;margin-bottom:.3rem">${s.titulo||'A Festa!'}</div>
        <div style="font-size:1rem;color:rgba(255,255,255,.65);margin-bottom:1.5rem">${s.nome||''}</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:1.5rem">
          ${[['📅',dateShort,'Data'],['⏰',horaDisplay||'—','Hora'],['📍',s.local?s.local.split(',')[0]:'—','Local']].map(([i,v,l])=>`<div style="background:rgba(255,255,255,.08);border:1px solid rgba(52,211,153,.2);border-radius:10px;padding:.6rem .25rem;text-align:center"><div style="font-size:1rem">${i}</div><div style="font-size:.7rem;font-weight:800;color:${ac}">${v}</div><div style="font-size:.55rem;color:rgba(255,255,255,.35);text-transform:uppercase">${l}</div></div>`).join('')}
        </div>
        ${s.msg?`<div style="border:1px solid rgba(52,211,153,.15);border-radius:12px;padding:.85rem;font-style:italic;font-size:.83rem;color:rgba(255,255,255,.5);margin-bottom:1rem;line-height:1.5">"${s.msg}"</div>`:''}
        <div style="background:${ac};color:#052a10;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem">✅ Confirmar presença</div>
        ${s.gifts.length?`<div style="margin-top:1rem;display:flex;flex-wrap:wrap;gap:.3rem;justify-content:center">${giftsChips}</div>`:''}
      </div>
    </div>`;

  // ── MINIMALISTA (homem) ──
  if(tplId==='hom-minimalista') return `
    <div style="background:#111;min-height:100%;font-family:'Nunito',sans-serif;color:#fff;overflow:hidden;position:relative">
      <div style="position:absolute;inset:0;background-image:url('${heroImg}');background-size:cover;opacity:.1;filter:grayscale(80%)"></div>
      <div style="position:relative;padding:3rem 1.75rem 2rem">
        <div style="width:40px;height:2px;background:${ac};margin-bottom:1.5rem"></div>
        <div style="font-size:.65rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:.5rem">Você está convidado</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(2rem,7vw,3rem);font-weight:900;font-style:italic;color:#fff;line-height:1;margin-bottom:.4rem">${s.titulo||'Evento'}</div>
        <div style="font-size:1rem;color:rgba(255,255,255,.5);margin-bottom:2.5rem">${s.nome||''}</div>
        <div style="display:flex;flex-direction:column;gap:.6rem;margin-bottom:2.5rem">
          ${[['—',dateStr],[s.hora?'—':null,s.hora],[s.local?'—':null,s.local],[s.dress?'—':null,s.dress]].filter(x=>x[0]).map(([i,v])=>`<div style="display:flex;gap:.75rem;font-size:.88rem;color:rgba(255,255,255,.5)"><span style="color:${ac};font-weight:900">${i}</span><span>${v}</span></div>`).join('')}
        </div>
        ${s.msg?`<div style="border-top:1px solid rgba(255,255,255,.1);padding-top:1.25rem;font-style:italic;font-size:.85rem;color:rgba(255,255,255,.35);line-height:1.7;margin-bottom:1.5rem">"${s.msg}"</div>`:''}
        <div style="background:transparent;border:1px solid ${ac};color:${ac};font-weight:800;text-align:center;padding:.85rem;border-radius:4px;font-size:.9rem;letter-spacing:.08em">CONFIRMAR PRESENÇA →</div>
        <div style="width:40px;height:2px;background:${ac};margin-top:1.5rem"></div>
      </div>
    </div>`;

  // ── HOMEM COM FOTOS ──
  if(tplId==='hom-fotos') return `
    <div style="min-height:100%;font-family:'Nunito',sans-serif;overflow:hidden;position:relative;background:#111">
      <img src="${heroImg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55"/>
      <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.1),rgba(0,0,0,.85))"></div>
      <div style="position:relative;padding:3rem 1.5rem 2rem;min-height:580px;display:flex;flex-direction:column;justify-content:flex-end;color:#fff;text-align:left">
        <div style="font-size:.6rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:${ac};margin-bottom:.6rem">VOCÊ ESTÁ CONVIDADO</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(2rem,8vw,3rem);font-weight:900;font-style:italic;color:#fff;line-height:1;margin-bottom:.4rem">${s.titulo||'Evento!'}</div>
        <div style="font-size:1rem;color:rgba(255,255,255,.7);margin-bottom:1.5rem">${s.nome||''}</div>
        <div style="background:rgba(255,255,255,.1);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.15);border-radius:12px;padding:1rem;margin-bottom:1.25rem;display:flex;flex-direction:column;gap:.4rem">
          ${[['📅',dateStr],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local]].filter(x=>x[0]).map(([i,v])=>`<div style="font-size:.82rem;color:rgba(255,255,255,.75)">${i} ${v}</div>`).join('')}
        </div>
        <div style="background:${ac};color:#1a0a00;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem">✅ Confirmar presença</div>
      </div>
    </div>`;

  // ── MULHER ──

  // ── CHAMPANHE & GLAMOUR ──
  if(tplId==='mul-champanhe') return `
    <div style="background:${getBg('linear-gradient(160deg,#1a1000,#3d2800)')};min-height:100%;font-family:'Nunito',sans-serif;color:#fff;overflow:hidden;position:relative">
      <div style="position:absolute;inset:0;background-image:url('${heroImg}');background-size:cover;opacity:.2"></div>
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,${ac},transparent)"></div>
      <div style="position:relative;padding:3rem 1.5rem 2rem;text-align:center">
        <div style="font-size:2.5rem;margin-bottom:.75rem">🥂✨</div>
        <div style="font-size:.6rem;font-weight:800;letter-spacing:.25em;text-transform:uppercase;color:${ac};opacity:.8;margin-bottom:.75rem">— Com muito glamour —</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(2rem,7vw,3rem);font-weight:900;font-style:italic;color:${ac};line-height:1;margin-bottom:.5rem;text-shadow:0 0 30px ${ac}44">${s.titulo||'Festa!'}</div>
        <div style="font-family:'Fraunces',serif;font-size:1.1rem;font-style:italic;color:rgba(255,255,255,.6);margin-bottom:2rem">${s.nome||''}</div>
        <div style="width:50px;height:1px;background:${ac};opacity:.5;margin:0 auto 1.5rem"></div>
        <div style="display:flex;flex-direction:column;gap:.5rem;margin-bottom:1.75rem">
          ${[['📅',dateStr],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local],[s.dress?'👗':null,s.dress]].filter(x=>x[0]).map(([i,v])=>`<div style="font-size:.85rem;color:rgba(255,255,255,.6)">${i} ${v}</div>`).join('')}
        </div>
        ${s.msg?`<div style="border:1px solid rgba(252,211,77,.15);border-radius:16px;padding:1.1rem;font-style:italic;font-size:.85rem;color:rgba(255,255,255,.5);margin-bottom:1.5rem;line-height:1.7">"${s.msg}"</div>`:''}
        <div style="background:transparent;border:1px solid ${ac};color:${ac};font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem;letter-spacing:.05em">✅ Confirmar presença</div>
        ${s.gifts.length?`<div style="margin-top:1rem;display:flex;flex-wrap:wrap;gap:.3rem;justify-content:center">${giftsChips}</div>`:''}
      </div>
    </div>`;

  // ── ROSA & FOFO ──
  if(tplId==='mul-rosa') return `
    <div style="background:${getBg('linear-gradient(160deg,#fff0f8,#ffe4f5)')};min-height:100%;font-family:'Nunito',sans-serif;color:${themeBg?'#fff':'#1A0A00'};overflow:hidden;position:relative">
      <div style="position:absolute;top:0;left:0;right:0;height:160px;background:linear-gradient(135deg,#f9a8d4,#ec4899);overflow:hidden">
        <img src="${heroImg}" style="width:100%;height:100%;object-fit:cover;opacity:.25;mix-blend-mode:overlay"/>
        <div style="position:absolute;top:.75rem;right:1rem;font-size:2rem;opacity:.4">🌸💕🌸</div>
      </div>
      <div style="position:relative;padding-top:110px;text-align:center;padding:0 1.25rem 2rem">
        <div style="width:90px;height:90px;border-radius:50%;overflow:hidden;border:4px solid #fff;margin:110px auto 1rem;box-shadow:0 8px 24px rgba(236,72,153,.25);position:relative;z-index:1;margin-top:90px">
          <img src="${heroImg}" style="width:100%;height:100%;object-fit:cover"/>
        </div>
        <div style="font-size:.65rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#ec4899;margin-bottom:.3rem">💕 Você está convidada!</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.8rem,7vw,2.6rem);font-weight:900;font-style:italic;color:#1A0A00;line-height:1.1;margin-bottom:.3rem">${s.titulo||'Festa!'}</div>
        <div style="color:rgba(26,10,0,.5);font-weight:700;margin-bottom:1.5rem">${s.nome||''}</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:1.25rem">
          ${[['🗓',dateShort,'Data'],['⏰',horaDisplay||'—','Hora'],['📍',s.local?s.local.split(',')[0]:'—','Local']].map(([i,v,l])=>`<div style="background:#fff;border-radius:12px;padding:.65rem .35rem;box-shadow:0 2px 8px rgba(236,72,153,.12)"><div style="font-size:1rem">${i}</div><div style="font-size:.7rem;font-weight:800">${v}</div><div style="font-size:.55rem;color:rgba(26,10,0,.3);text-transform:uppercase">${l}</div></div>`).join('')}
        </div>
        ${s.dress?`<div style="background:#fff;border-radius:10px;padding:.6rem;font-size:.8rem;color:rgba(26,10,0,.6);margin-bottom:1rem;box-shadow:0 2px 8px rgba(236,72,153,.08)">👗 Dress code: <strong>${s.dress}</strong></div>`:''}
        ${s.msg?`<div style="background:rgba(249,168,212,.15);border-radius:12px;padding:.85rem;font-style:italic;font-size:.85rem;color:rgba(26,10,0,.55);margin-bottom:1rem;line-height:1.6">"${s.msg}"</div>`:''}
        <div style="background:linear-gradient(135deg,#f472b6,#ec4899);color:#fff;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem;box-shadow:0 6px 20px rgba(236,72,153,.3)">✅ Confirmar presença</div>
        ${s.gifts.length?`<div style="margin-top:.75rem;display:flex;flex-wrap:wrap;gap:.3rem;justify-content:center">${giftsChips}</div>`:''}
      </div>
    </div>`;

  // ── POOL PARTY ──
  if(tplId==='mul-pool') return `
    <div style="background:${getBg('linear-gradient(160deg,#0c3a4a,#0e6b8a)')};min-height:100%;font-family:'Nunito',sans-serif;color:#fff;overflow:hidden;position:relative">
      <div style="position:absolute;inset:0;background-image:url('${heroImg}');background-size:cover;opacity:.2"></div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:60px;background:rgba(255,255,255,.05);clip-path:ellipse(55% 100% at 50% 100%)"></div>
      <div style="position:relative;padding:2.5rem 1.5rem 2rem;text-align:center">
        <div style="font-size:3rem;margin-bottom:.5rem">🏊‍♀️☀️🍹</div>
        <div style="display:inline-block;background:${ac};color:#0c3a4a;padding:.2rem 1rem;border-radius:99px;font-size:.65rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;margin-bottom:.75rem">Você está convidada!</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(2rem,7vw,2.8rem);font-weight:900;font-style:italic;line-height:1.1;margin-bottom:.3rem">${s.titulo||'Pool Party!'}</div>
        <div style="font-size:1rem;color:rgba(255,255,255,.7);margin-bottom:1.5rem">${s.nome||''}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin-bottom:1.5rem">
          ${[['📅',dateStr],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local],[s.dress?'👙':null,s.dress]].filter(x=>x[0]).map(([i,v])=>`<div style="background:rgba(255,255,255,.1);border:1px solid rgba(96,165,250,.2);border-radius:10px;padding:.55rem .75rem;font-size:.75rem;display:flex;gap:.35rem;align-items:center"><span>${i}</span><span style="color:rgba(255,255,255,.8)">${v}</span></div>`).join('')}
        </div>
        ${s.msg?`<div style="background:rgba(96,165,250,.1);border-radius:12px;padding:.85rem;font-style:italic;font-size:.83rem;color:rgba(255,255,255,.55);margin-bottom:1rem;line-height:1.5">"${s.msg}"</div>`:''}
        <div style="background:${ac};color:#0c3a4a;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem">✅ Confirmar presença</div>
        ${s.gifts.length?`<div style="margin-top:.75rem;display:flex;flex-wrap:wrap;gap:.3rem;justify-content:center">${giftsChips}</div>`:''}
      </div>
    </div>`;

  // ── MULHER COM FOTOS ──
  if(tplId==='mul-fotos') return `
    <div style="min-height:100%;font-family:'Nunito',sans-serif;overflow:hidden;position:relative;background:#1a0020">
      <img src="${heroImg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.5"/>
      <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(80,0,80,.2),rgba(40,0,40,.85))"></div>
      <div style="position:relative;padding:3rem 1.5rem 2rem;text-align:center;min-height:540px;display:flex;flex-direction:column;justify-content:flex-end;color:#fff">
        <div style="font-size:.6rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:${ac};margin-bottom:.6rem">✨ Celebração especial ✨</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(2rem,8vw,3rem);font-weight:900;font-style:italic;color:${ac};line-height:1;margin-bottom:.4rem">${s.titulo||'Festa!'}</div>
        <div style="font-size:1rem;color:rgba(255,255,255,.75);margin-bottom:1.25rem">${s.nome||''}</div>
        <div style="background:rgba(255,255,255,.12);backdrop-filter:blur(12px);border:1px solid rgba(244,114,182,.2);border-radius:16px;padding:1rem;margin-bottom:1rem">
          <div style="display:flex;flex-direction:column;gap:.4rem;font-size:.82rem;color:rgba(255,255,255,.75)">
            <div>📅 ${dateStr}</div>
            ${s.hora?`<div>⏰ ${s.hora}</div>`:''}
            ${s.local?`<div>📍 ${s.local}</div>`:''}
          </div>
        </div>
        <div style="background:${ac};color:#1a0020;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem">✅ Confirmar presença</div>
      </div>
    </div>`;

  // ── 15 ANOS ──

  // ── VALSA REAL ──
  if(tplId==='deb-valsa') return `
    <div style="background:${getBg('#08030f')};min-height:100%;font-family:'Nunito',sans-serif;color:#fff;position:relative;overflow:hidden">
      <div style="position:absolute;inset:0;background-image:url('${heroImg}');background-size:cover;background-position:center;opacity:.22"></div>
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center top,rgba(252,211,77,.06) 0%,transparent 65%)"></div>
      <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,${ac},transparent)"></div>
      <div style="position:relative;padding:3rem 1.5rem 2rem;text-align:center">
        <div style="font-size:2.5rem;margin-bottom:.5rem">👑💫</div>
        <div style="font-size:.6rem;font-weight:800;letter-spacing:.25em;text-transform:uppercase;color:${ac};opacity:.7;margin-bottom:.75rem">— Uma noite inesquecível —</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(2rem,7vw,2.8rem);font-weight:900;font-style:italic;color:${ac};line-height:1;margin-bottom:.4rem;text-shadow:0 0 30px ${ac}44">${s.titulo||'Debutante'}</div>
        <div style="font-family:'Fraunces',serif;font-size:1rem;font-style:italic;color:rgba(255,255,255,.5);margin-bottom:.3rem">Os 15 anos de</div>
        <div style="font-family:'Fraunces',serif;font-size:1.5rem;font-weight:700;color:rgba(255,255,255,.9);margin-bottom:2rem">${s.nome||''}</div>
        <div style="width:50px;height:1px;background:${ac};opacity:.45;margin:0 auto 1.5rem"></div>
        <div style="display:flex;flex-direction:column;gap:.5rem;margin-bottom:1.75rem">
          ${[['📅',dateStr],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local],[s.dress?'👗':null,s.dress]].filter(x=>x[0]).map(([i,v])=>`<div style="font-size:.85rem;color:rgba(255,255,255,.55)">${i} ${v}</div>`).join('')}
        </div>
        ${s.msg?`<div style="border:1px solid rgba(252,211,77,.18);border-radius:16px;padding:1.1rem;font-style:italic;font-size:.85rem;color:rgba(255,255,255,.5);margin-bottom:1.5rem;line-height:1.7">"${s.msg}"</div>`:''}
        <div style="background:transparent;border:1px solid ${ac};color:${ac};font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem">✅ Confirmar presença</div>
      </div>
    </div>`;

  // ── CLEAN & MODERNO (15 anos) ──
  if(tplId==='deb-clean') return `
    <div style="background:#fff;min-height:100%;font-family:'Nunito',sans-serif;color:#1A0A00;overflow:hidden">
      <div style="height:240px;position:relative;overflow:hidden">
        <img src="${heroImg}" style="width:100%;height:100%;object-fit:cover;display:block"/>
        <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 25%,rgba(255,255,255,1))"></div>
        <div style="position:absolute;bottom:1rem;left:1.25rem;right:1.25rem;text-align:center">
          <div style="display:inline-block;background:${ac};color:#fff;padding:.2rem .9rem;border-radius:99px;font-size:.6rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase">👑 15 anos</div>
        </div>
      </div>
      <div style="padding:.5rem 1.5rem 2rem;text-align:center">
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.8rem,6vw,2.6rem);font-weight:900;font-style:italic;color:#1A0A00;line-height:1.1;margin-bottom:.25rem">${s.titulo||'Uma noite mágica'}</div>
        <div style="font-size:.95rem;color:rgba(26,10,0,.4);font-style:italic;margin-bottom:.3rem">Os 15 anos de</div>
        <div style="font-size:1.15rem;font-weight:800;color:rgba(26,10,0,.8);margin-bottom:1.5rem">${s.nome||''}</div>
        <div style="display:flex;gap:.4rem;justify-content:center;flex-wrap:wrap;margin-bottom:1.25rem">
          ${[['📅',dateShort],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local]].filter(x=>x[0]).map(([i,v])=>`<div style="background:rgba(26,10,0,.04);border:1px solid rgba(26,10,0,.07);border-radius:8px;padding:.4rem .75rem;font-size:.77rem;color:rgba(26,10,0,.6)">${i} ${v}</div>`).join('')}
        </div>
        ${s.dress?`<div style="font-size:.82rem;color:rgba(26,10,0,.4);margin-bottom:1.25rem">👗 ${s.dress}</div>`:''}
        ${s.msg?`<div style="font-style:italic;font-size:.85rem;color:rgba(26,10,0,.4);line-height:1.6;margin-bottom:1.25rem;padding:0 .5rem">"${s.msg}"</div>`:''}
        <div style="background:${ac};color:#fff;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem;box-shadow:0 6px 20px ${ac}55">✅ Confirmar presença</div>
      </div>
    </div>`;

  // ── VINTAGE DOURADO (15 anos) ──
  if(tplId==='deb-vintage') return `
    <div style="background:${getBg('linear-gradient(160deg,#2a0a08,#5c1a10)')};min-height:100%;font-family:'Nunito',sans-serif;color:#fff;overflow:hidden;position:relative">
      <div style="position:absolute;inset:0;background-image:url('${heroImg}');background-size:cover;opacity:.18"></div>
      <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,${ac},transparent)"></div>
      <div style="position:relative;padding:2.5rem 1.5rem 2rem;text-align:center">
        <div style="font-size:2.5rem;margin-bottom:.5rem">🌹👑🌹</div>
        <div style="font-size:.6rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:${ac};opacity:.8;margin-bottom:.5rem">Com toda elegância</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.8rem,7vw,2.8rem);font-weight:900;font-style:italic;color:${ac};line-height:1.1;margin-bottom:.3rem">${s.titulo||'Debutante'}</div>
        <div style="font-family:'Fraunces',serif;font-size:.9rem;font-style:italic;color:rgba(255,255,255,.45);margin-bottom:.25rem">Os 15 anos de</div>
        <div style="font-size:1.15rem;font-weight:700;color:rgba(255,255,255,.85);margin-bottom:2rem">${s.nome||''}</div>
        <div style="background:rgba(255,255,255,.07);border:1px solid rgba(252,211,77,.2);border-radius:16px;padding:1.1rem;margin-bottom:1.5rem">
          ${[['📅',dateStr],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local],[s.dress?'👗':null,s.dress]].filter(x=>x[0]).map(([i,v])=>`<div style="font-size:.82rem;color:rgba(255,255,255,.55);margin-bottom:.35rem">${i} ${v}</div>`).join('')}
        </div>
        ${s.msg?`<div style="border-left:2px solid ${ac};padding:.75rem 1rem;text-align:left;font-style:italic;font-size:.83rem;color:rgba(255,255,255,.45);margin-bottom:1.25rem;line-height:1.6">"${s.msg}"</div>`:''}
        <div style="border:1px solid ${ac};color:${ac};background:transparent;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem">✅ Confirmar presença</div>
      </div>
    </div>`;

  // ── 15 ANOS COM FOTOS ──
  if(tplId==='deb-fotos') return `
    <div style="min-height:100%;font-family:'Nunito',sans-serif;overflow:hidden;position:relative;background:#0a001a">
      <img src="${heroImg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.5"/>
      <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(60,0,80,.2),rgba(30,0,40,.88))"></div>
      <div style="position:relative;padding:3rem 1.5rem 2rem;text-align:center;min-height:540px;display:flex;flex-direction:column;justify-content:flex-end;color:#fff">
        <div style="font-size:.6rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:${ac};margin-bottom:.6rem">👑 Festa de 15 anos</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(2rem,8vw,3rem);font-weight:900;font-style:italic;color:${ac};line-height:1;margin-bottom:.4rem">${s.titulo||'Debutante'}</div>
        <div style="font-size:1rem;color:rgba(255,255,255,.7);margin-bottom:1.25rem">${s.nome||''}</div>
        <div style="background:rgba(255,255,255,.1);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.15);border-radius:16px;padding:1rem;margin-bottom:1rem">
          <div style="display:flex;flex-direction:column;gap:.4rem;font-size:.82rem;color:rgba(255,255,255,.75)">
            <div>📅 ${dateStr}</div>
            ${s.hora?`<div>⏰ ${s.hora}</div>`:''}
            ${s.local?`<div>📍 ${s.local}</div>`:''}
          </div>
        </div>
        <div style="background:${ac};color:#0a001a;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem">✅ Confirmar presença</div>
      </div>
    </div>`;

  // ── MENINO ──

  // ── HOMEM-ARANHA ──
  if(tplId==='boy-spiderman') return `
    <div style="background:${getBg('linear-gradient(160deg,#0f0020,#1a0040)')};min-height:100%;font-family:'Nunito',sans-serif;color:#fff;overflow:hidden;position:relative">
      <div style="position:absolute;inset:0;background-image:url('${heroImg}');background-size:cover;opacity:.12"></div>
      <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#EF4444,#1d4ed8,#EF4444)"></div>
      <div style="position:absolute;bottom:0;right:0;font-size:8rem;opacity:.06;line-height:1">🕷️</div>
      <div style="position:relative;padding:2.5rem 1.5rem 2rem;text-align:center">
        <div style="font-size:3.5rem;margin-bottom:.5rem">🕷️🦸</div>
        <div style="display:inline-block;background:#EF4444;color:#fff;padding:.2rem 1rem;border-radius:6px;font-size:.65rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;margin-bottom:.75rem">⚡ Convite especial!</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.8rem,7vw,2.6rem);font-weight:900;font-style:italic;color:#EF4444;line-height:1.1;margin-bottom:.3rem">${s.titulo||'Festa do Homem-Aranha!'}</div>
        <div style="font-size:.95rem;color:rgba(255,255,255,.6);margin-bottom:1.5rem">${s.nome||''}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:1.5rem">
          ${[['📅',dateStr],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local],[s.dress?'👕':null,s.dress]].filter(x=>x[0]).map(([i,v])=>`<div style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);border-radius:8px;padding:.5rem .65rem;font-size:.75rem;display:flex;gap:.35rem;align-items:center"><span>${i}</span><span style="color:rgba(255,255,255,.7)">${v}</span></div>`).join('')}
        </div>
        ${s.msg?`<div style="background:rgba(239,68,68,.07);border-left:3px solid #EF4444;padding:.75rem 1rem;font-style:italic;font-size:.82rem;color:rgba(255,255,255,.5);margin-bottom:1rem;line-height:1.5">"${s.msg}"</div>`:''}
        <div style="background:linear-gradient(135deg,#EF4444,#1d4ed8);color:#fff;font-weight:800;text-align:center;padding:.85rem;border-radius:8px;font-size:.9rem">✅ Confirmar presença</div>
        ${s.gifts.length?`<div style="margin-top:.75rem;display:flex;flex-wrap:wrap;gap:.3rem;justify-content:center">${giftsChips}</div>`:''}
      </div>
    </div>`;

  // ── POKÉMON ──
  if(tplId==='boy-pokemon') return `
    <div style="background:${getBg('linear-gradient(160deg,#0a1a3a,#1a3a6a)')};min-height:100%;font-family:'Nunito',sans-serif;color:#fff;overflow:hidden;position:relative">
      <div style="position:absolute;inset:0;background-image:url('${heroImg}');background-size:cover;opacity:.1"></div>
      <div style="position:absolute;top:1rem;right:1rem;font-size:3rem;opacity:.15">⚡🎮</div>
      <div style="position:relative;padding:2.5rem 1.5rem 2rem;text-align:center">
        <div style="font-size:3rem;margin-bottom:.5rem">⚡🎮⚡</div>
        <div style="display:inline-block;background:#FBBF24;color:#0a1a3a;padding:.25rem 1rem;border-radius:6px;font-size:.65rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;margin-bottom:.75rem">Você está convidado!</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.8rem,7vw,2.6rem);font-weight:900;font-style:italic;color:#FBBF24;line-height:1.1;margin-bottom:.3rem">${s.titulo||'Festa Pokémon!'}</div>
        <div style="font-size:.95rem;color:rgba(255,255,255,.65);margin-bottom:1.5rem">${s.nome||''}</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:1.5rem">
          ${[['📅',dateShort,'Data'],['⏰',horaDisplay||'—','Hora'],['📍',s.local?s.local.split(',')[0]:'—','Local']].map(([i,v,l])=>`<div style="background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.2);border-radius:10px;padding:.6rem .25rem;text-align:center"><div style="font-size:1rem">${i}</div><div style="font-size:.7rem;font-weight:800;color:#FBBF24">${v}</div><div style="font-size:.55rem;color:rgba(255,255,255,.35);text-transform:uppercase">${l}</div></div>`).join('')}
        </div>
        ${s.msg?`<div style="border:1px solid rgba(251,191,36,.15);border-radius:12px;padding:.85rem;font-style:italic;font-size:.83rem;color:rgba(255,255,255,.5);margin-bottom:1rem;line-height:1.5">"${s.msg}"</div>`:''}
        <div style="background:#FBBF24;color:#0a1a3a;font-weight:800;text-align:center;padding:.85rem;border-radius:8px;font-size:.9rem">✅ Confirmar presença</div>
        ${s.gifts.length?`<div style="margin-top:.75rem;display:flex;flex-wrap:wrap;gap:.3rem;justify-content:center">${giftsChips}</div>`:''}
      </div>
    </div>`;

  // ── MICKEY ──
  if(tplId==='boy-mickey') return `
    <div style="background:${getBg('#0a0000')};min-height:100%;font-family:'Nunito',sans-serif;color:#fff;overflow:hidden;position:relative">
      <div style="position:absolute;inset:0;background-image:url('${heroImg}');background-size:cover;opacity:.12"></div>
      <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#EF4444,#1a0000,#EF4444)"></div>
      <div style="position:relative;padding:2.5rem 1.5rem 2rem;text-align:center">
        <div style="font-size:3rem;margin-bottom:.5rem">🎪🐭🎉</div>
        <div style="display:inline-block;border:2px solid #EF4444;color:#EF4444;padding:.2rem .9rem;border-radius:99px;font-size:.65rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;margin-bottom:.75rem">Você está convidado!</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.8rem,7vw,2.6rem);font-weight:900;font-style:italic;color:#EF4444;line-height:1.1;margin-bottom:.3rem">${s.titulo||'Festa do Mickey!'}</div>
        <div style="font-size:.95rem;color:rgba(255,255,255,.6);margin-bottom:1.5rem">${s.nome||''}</div>
        <div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:16px;padding:1.1rem;margin-bottom:1.5rem">
          ${[['📅',dateStr],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local],[s.dress?'👕':null,s.dress]].filter(x=>x[0]).map(([i,v])=>`<div style="font-size:.82rem;color:rgba(255,255,255,.6);margin-bottom:.3rem">${i} ${v}</div>`).join('')}
        </div>
        ${s.msg?`<div style="border-left:3px solid #EF4444;padding:.75rem 1rem;font-style:italic;font-size:.82rem;color:rgba(255,255,255,.45);margin-bottom:1rem;line-height:1.5;text-align:left">"${s.msg}"</div>`:''}
        <div style="background:#EF4444;color:#fff;font-weight:800;text-align:center;padding:.85rem;border-radius:99px;font-size:.9rem">✅ Confirmar presença</div>
        ${s.gifts.length?`<div style="margin-top:.75rem;display:flex;flex-wrap:wrap;gap:.3rem;justify-content:center">${giftsChips}</div>`:''}
      </div>
    </div>`;

  // ── BOB ESPONJA ──
  if(tplId==='boy-spongebob') return `
    <div style="background:${getBg('linear-gradient(160deg,#001a3a,#003566)')};min-height:100%;font-family:'Nunito',sans-serif;color:#fff;overflow:hidden;position:relative">
      <div style="position:absolute;bottom:0;left:0;right:0;height:80px;background:linear-gradient(to top,rgba(251,191,36,.12),transparent)"></div>
      <div style="position:relative;padding:2.5rem 1.5rem 2rem;text-align:center">
        <div style="font-size:3rem;margin-bottom:.5rem">🧽🌊⭐</div>
        <div style="display:inline-block;background:#FBBF24;color:#001a3a;padding:.25rem 1rem;border-radius:4px;font-size:.65rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;margin-bottom:.75rem">Estão prontos?!</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.8rem,7vw,2.6rem);font-weight:900;font-style:italic;color:#FBBF24;line-height:1.1;margin-bottom:.3rem">${s.titulo||'Festa do Bob Esponja!'}</div>
        <div style="font-size:.95rem;color:rgba(255,255,255,.65);margin-bottom:1.5rem">${s.nome||''}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:1.5rem">
          ${[['📅',dateStr],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local],[s.dress?'👕':null,s.dress]].filter(x=>x[0]).map(([i,v])=>`<div style="background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.25);border-radius:10px;padding:.55rem .65rem;font-size:.75rem;display:flex;gap:.35rem;align-items:center"><span>${i}</span><span style="color:rgba(255,255,255,.75)">${v}</span></div>`).join('')}
        </div>
        ${s.msg?`<div style="background:rgba(251,191,36,.07);border-radius:12px;padding:.85rem;font-style:italic;font-size:.82rem;color:rgba(255,255,255,.5);margin-bottom:1rem;line-height:1.5">"${s.msg}"</div>`:''}
        <div style="background:#FBBF24;color:#001a3a;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem">✅ Confirmar presença</div>
        ${s.gifts.length?`<div style="margin-top:.75rem;display:flex;flex-wrap:wrap;gap:.3rem;justify-content:center">${giftsChips}</div>`:''}
      </div>
    </div>`;

  // ── MENINO COM FOTOS ──
  if(tplId==='boy-fotos') return `
    <div style="background:linear-gradient(160deg,#001a3a,#003566);min-height:100%;font-family:'Nunito',sans-serif;color:#fff;overflow:hidden">
      <div style="height:200px;position:relative;overflow:hidden">
        <img src="${heroImg}" style="width:100%;height:100%;object-fit:cover"/>
        <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent,rgba(0,26,58,1))"></div>
      </div>
      <div style="padding:0 1.5rem 2rem;text-align:center;margin-top:-1.5rem;position:relative">
        <div style="font-size:.65rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:${ac};margin-bottom:.4rem">🎉 Você está convidado!</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.8rem,7vw,2.6rem);font-weight:900;font-style:italic;color:#fff;line-height:1.1;margin-bottom:.3rem">${s.titulo||'Festa!'}</div>
        <div style="color:rgba(255,255,255,.55);font-weight:700;margin-bottom:1.5rem">${s.nome||''}</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:1.25rem">
          ${[['🗓',dateShort,'Data'],['⏰',horaDisplay||'—','Hora'],['📍',s.local?s.local.split(',')[0]:'—','Local']].map(([i,v,l])=>`<div style="background:rgba(255,255,255,.07);border-radius:12px;padding:.65rem .35rem"><div style="font-size:1rem">${i}</div><div style="font-size:.7rem;font-weight:800;color:${ac}">${v}</div><div style="font-size:.55rem;color:rgba(255,255,255,.3);text-transform:uppercase">${l}</div></div>`).join('')}
        </div>
        ${s.msg?`<div style="background:rgba(255,255,255,.06);border-radius:12px;padding:.85rem;font-style:italic;font-size:.83rem;color:rgba(255,255,255,.45);margin-bottom:1rem;line-height:1.6">"${s.msg}"</div>`:''}
        <div style="background:${ac};color:#001a3a;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem">✅ Confirmar presença</div>
      </div>
    </div>`;

  // ── MENINA ──

  // ── PEQUENA SEREIA ──
  if(tplId==='girl-ariel') return `
    <div style="background:${getBg('linear-gradient(160deg,#0a2540,#0e4a7a)')};min-height:100%;font-family:'Nunito',sans-serif;color:#fff;overflow:hidden;position:relative">
      <div style="position:absolute;inset:0;background-image:url('${heroImg}');background-size:cover;opacity:.15"></div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:70px;opacity:.08;font-size:3rem;text-align:center;line-height:1.5">🐚🐠🐟🌊</div>
      <div style="position:relative;padding:2.5rem 1.5rem 2rem;text-align:center">
        <div style="font-size:3rem;margin-bottom:.5rem">🧜‍♀️🐚🌊</div>
        <div style="display:inline-block;background:${ac};color:#0a2540;padding:.25rem 1rem;border-radius:99px;font-size:.65rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;margin-bottom:.75rem">Você está convidada!</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.8rem,7vw,2.6rem);font-weight:900;font-style:italic;color:${ac};line-height:1.1;margin-bottom:.3rem">${s.titulo||'Festa da Sereia!'}</div>
        <div style="font-size:.95rem;color:rgba(255,255,255,.6);margin-bottom:1.5rem">${s.nome||''}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:1.5rem">
          ${[['📅',dateStr],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local],[s.dress?'👗':null,s.dress]].filter(x=>x[0]).map(([i,v])=>`<div style="background:rgba(96,165,250,.1);border:1px solid rgba(96,165,250,.25);border-radius:10px;padding:.55rem .65rem;font-size:.75rem;display:flex;gap:.35rem;align-items:center"><span>${i}</span><span style="color:rgba(255,255,255,.75)">${v}</span></div>`).join('')}
        </div>
        ${s.msg?`<div style="background:rgba(96,165,250,.08);border-radius:12px;padding:.85rem;font-style:italic;font-size:.82rem;color:rgba(255,255,255,.5);margin-bottom:1rem;line-height:1.5">"${s.msg}"</div>`:''}
        <div style="background:${ac};color:#0a2540;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem">✅ Confirmar presença</div>
        ${s.gifts.length?`<div style="margin-top:.75rem;display:flex;flex-wrap:wrap;gap:.3rem;justify-content:center">${giftsChips}</div>`:''}
      </div>
    </div>`;

  // ── CINDERELA ──
  if(tplId==='girl-cinderela') return `
    <div style="background:${getBg('linear-gradient(160deg,#0a0a2a,#1a1a5a)')};min-height:100%;font-family:'Nunito',sans-serif;color:#fff;overflow:hidden;position:relative">
      <div style="position:absolute;inset:0;background-image:url('${heroImg}');background-size:cover;opacity:.15"></div>
      <div style="position:absolute;top:1rem;right:1rem;font-size:2rem;opacity:.2">✨⭐✨</div>
      <div style="position:absolute;bottom:1rem;left:1rem;font-size:2rem;opacity:.15">🔮🪄</div>
      <div style="position:relative;padding:2.5rem 1.5rem 2rem;text-align:center">
        <div style="font-size:3rem;margin-bottom:.5rem">👸🏼🎀✨</div>
        <div style="font-size:.6rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:${ac};opacity:.8;margin-bottom:.75rem">— Um baile encantado —</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.8rem,7vw,2.6rem);font-weight:900;font-style:italic;color:${ac};line-height:1.1;margin-bottom:.3rem">${s.titulo||'Festa da Cinderela!'}</div>
        <div style="font-size:.95rem;color:rgba(255,255,255,.55);margin-bottom:1.75rem">${s.nome||''}</div>
        <div style="background:rgba(147,197,253,.06);border:1px solid rgba(147,197,253,.2);border-radius:16px;padding:1.1rem;margin-bottom:1.5rem">
          ${[['📅',dateStr],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local],[s.dress?'👗':null,s.dress]].filter(x=>x[0]).map(([i,v])=>`<div style="font-size:.82rem;color:rgba(255,255,255,.55);margin-bottom:.3rem">${i} ${v}</div>`).join('')}
        </div>
        ${s.msg?`<div style="border:1px solid rgba(147,197,253,.15);border-radius:12px;padding:.85rem;font-style:italic;font-size:.82rem;color:rgba(255,255,255,.45);margin-bottom:1rem;line-height:1.5">"${s.msg}"</div>`:''}
        <div style="background:${ac};color:#0a0a2a;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem">✅ Confirmar presença</div>
        ${s.gifts.length?`<div style="margin-top:.75rem;display:flex;flex-wrap:wrap;gap:.3rem;justify-content:center">${giftsChips}</div>`:''}
      </div>
    </div>`;

  // ── MINNIE ──
  if(tplId==='girl-minnie') return `
    <div style="background:${getBg('linear-gradient(160deg,#2d0020,#5a003d)')};min-height:100%;font-family:'Nunito',sans-serif;color:#fff;overflow:hidden;position:relative">
      <div style="position:absolute;inset:0;background-image:url('${heroImg}');background-size:cover;opacity:.12"></div>
      <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#F472B6,#EC4899,#F472B6)"></div>
      <div style="position:relative;padding:2.5rem 1.5rem 2rem;text-align:center">
        <div style="font-size:3rem;margin-bottom:.5rem">🎀🐭🎀</div>
        <div style="display:inline-block;border:2px solid #F472B6;color:#F472B6;padding:.2rem .9rem;border-radius:99px;font-size:.65rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;margin-bottom:.75rem">Você está convidada!</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.8rem,7vw,2.6rem);font-weight:900;font-style:italic;color:#F472B6;line-height:1.1;margin-bottom:.3rem">${s.titulo||'Festa da Minnie!'}</div>
        <div style="font-size:.95rem;color:rgba(255,255,255,.6);margin-bottom:1.5rem">${s.nome||''}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:1.5rem">
          ${[['📅',dateStr],[horaDisplay?'⏰':null,horaDisplay],[s.local?'📍':null,s.local],[s.dress?'👗':null,s.dress]].filter(x=>x[0]).map(([i,v])=>`<div style="background:rgba(244,114,182,.1);border:1px solid rgba(244,114,182,.25);border-radius:10px;padding:.55rem .65rem;font-size:.75rem;display:flex;gap:.35rem;align-items:center"><span>${i}</span><span style="color:rgba(255,255,255,.75)">${v}</span></div>`).join('')}
        </div>
        ${s.msg?`<div style="background:rgba(244,114,182,.07);border-left:3px solid #F472B6;padding:.75rem 1rem;font-style:italic;font-size:.82rem;color:rgba(255,255,255,.5);margin-bottom:1rem;line-height:1.5;text-align:left">"${s.msg}"</div>`:''}
        <div style="background:linear-gradient(135deg,#F472B6,#EC4899);color:#fff;font-weight:800;text-align:center;padding:.85rem;border-radius:99px;font-size:.9rem;box-shadow:0 6px 20px rgba(236,72,153,.35)">✅ Confirmar presença</div>
        ${s.gifts.length?`<div style="margin-top:.75rem;display:flex;flex-wrap:wrap;gap:.3rem;justify-content:center">${giftsChips}</div>`:''}
      </div>
    </div>`;

  // ── URSINHA FOFA ──
  if(tplId==='girl-ursinha') return `
    <div style="background:${getBg('linear-gradient(160deg,#fff0e8,#ffe4d4)')};min-height:100%;font-family:'Nunito',sans-serif;color:${themeBg?'#fff':'#1A0A00'};overflow:hidden;position:relative">
      <div style="position:absolute;top:0;left:0;right:0;height:170px;background:linear-gradient(135deg,#FCD34D,#FB923C);overflow:hidden">
        <img src="${heroImg}" style="width:100%;height:100%;object-fit:cover;opacity:.2;mix-blend-mode:overlay"/>
        <div style="position:absolute;top:.5rem;left:50%;transform:translateX(-50%);font-size:2rem;opacity:.35">🐻🍯🌸</div>
      </div>
      <div style="position:relative;padding-top:10px;text-align:center;padding:0 1.25rem 2rem">
        <div style="width:85px;height:85px;border-radius:50%;overflow:hidden;border:4px solid #fff;margin:115px auto 1rem;box-shadow:0 8px 24px rgba(251,146,60,.3);position:relative;z-index:1;margin-top:100px">
          <img src="${heroImg}" style="width:100%;height:100%;object-fit:cover"/>
        </div>
        <div style="font-size:.65rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#FB923C;margin-bottom:.3rem">🐻 Você está convidada!</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(1.8rem,7vw,2.6rem);font-weight:900;font-style:italic;color:#1A0A00;line-height:1.1;margin-bottom:.3rem">${s.titulo||'Festa da Ursinha!'}</div>
        <div style="color:rgba(26,10,0,.45);font-weight:700;margin-bottom:1.5rem">${s.nome||''}</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:1.25rem">
          ${[['🗓',dateShort,'Data'],['⏰',horaDisplay||'—','Hora'],['📍',s.local?s.local.split(',')[0]:'—','Local']].map(([i,v,l])=>`<div style="background:#fff;border-radius:12px;padding:.65rem .35rem;box-shadow:0 2px 8px rgba(251,146,60,.12)"><div style="font-size:1rem">${i}</div><div style="font-size:.7rem;font-weight:800">${v}</div><div style="font-size:.55rem;color:rgba(26,10,0,.3);text-transform:uppercase">${l}</div></div>`).join('')}
        </div>
        ${s.msg?`<div style="background:rgba(251,146,60,.08);border-radius:12px;padding:.85rem;font-style:italic;font-size:.83rem;color:rgba(26,10,0,.5);margin-bottom:1rem;line-height:1.6">"${s.msg}"</div>`:''}
        <div style="background:linear-gradient(135deg,#FCD34D,#FB923C);color:#1A0A00;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem;box-shadow:0 6px 20px rgba(251,146,60,.3)">✅ Confirmar presença</div>
        ${s.gifts.length?`<div style="margin-top:.75rem;display:flex;flex-wrap:wrap;gap:.3rem;justify-content:center">${giftsChips}</div>`:''}
      </div>
    </div>`;

  // ── MENINA COM FOTOS ──
  if(tplId==='girl-fotos') return `
    <div style="min-height:100%;font-family:'Nunito',sans-serif;overflow:hidden;position:relative;background:#1a0020">
      <img src="${heroImg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.5"/>
      <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(80,0,80,.15),rgba(40,0,40,.88))"></div>
      <div style="position:relative;padding:3rem 1.5rem 2rem;text-align:center;min-height:540px;display:flex;flex-direction:column;justify-content:flex-end;color:#fff">
        <div style="font-size:.6rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:${ac};margin-bottom:.6rem">💕 Você está convidada!</div>
        <div style="font-family:'Fraunces',serif;font-size:clamp(2rem,8vw,3rem);font-weight:900;font-style:italic;color:${ac};line-height:1;margin-bottom:.4rem">${s.titulo||'Festa!'}</div>
        <div style="font-size:1rem;color:rgba(255,255,255,.7);margin-bottom:1.25rem">${s.nome||''}</div>
        <div style="background:rgba(255,255,255,.1);backdrop-filter:blur(12px);border:1px solid rgba(244,114,182,.2);border-radius:16px;padding:1rem;margin-bottom:1rem">
          <div style="display:flex;flex-direction:column;gap:.4rem;font-size:.82rem;color:rgba(255,255,255,.75)">
            <div>📅 ${dateStr}</div>
            ${s.hora?`<div>⏰ ${s.hora}</div>`:''}
            ${s.local?`<div>📍 ${s.local}</div>`:''}
          </div>
        </div>
        <div style="background:${ac};color:#1a0020;font-weight:800;text-align:center;padding:.85rem;border-radius:12px;font-size:.9rem">✅ Confirmar presença</div>
      </div>
    </div>`;

  // ── CUSTOM TEMPLATE — handled by updateCustomPreview() via iframe ──
  if(tplId && tplId.startsWith('custom_')){
    // This path shouldn't be reached since updatePreview() routes custom templates
    // to updateCustomPreview() before calling renderTemplateHTML(). Fallback only:
    return `<div style="background:linear-gradient(135deg,#1a0a1e,#2d0a3a);min-height:600px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.4);font-family:'Nunito',sans-serif;font-size:.9rem;text-align:center;padding:2rem"><div><div style="font-size:1.8rem;margin-bottom:.75rem">✨</div>Carregando template...</div></div>`;
  }

  // fallback — layout padrão
  return `<div style="background:linear-gradient(135deg,#1a0a1e,#2d0a3a);min-height:100%;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Nunito',sans-serif;text-align:center;padding:2rem">
    <div><div style="font-family:'Fraunces',serif;font-size:2rem;font-weight:900;font-style:italic;color:${ac};margin-bottom:.5rem">${s.titulo||'Você está convidado!'}</div><div>${s.nome||''}</div></div>
  </div>`;
}

// Renderiza o convite real de um template built-in dentro de um frame 3:4 escalado
window.renderRealInvitePreview = function(tplId){
  const tpl = getTemplate(tplId);
  if(!tpl) return null;
  const s = __buildPreviewState(tpl);
  state = s;
  let html='';
  try{ html = renderTemplateHTML(tplId, s); }catch(e){ return null; }
  // largura nativa do convite (mobile) escalada para preencher o card
  return `<div class="real-preview-frame"><div class="real-preview-inner">${html}</div></div>`;
};
})();
