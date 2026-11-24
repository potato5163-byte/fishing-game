// 100종 물고기 전용 고화질 맞춤형 인라인 SVG 그래픽 생성기
// 각 물고기마다 어종 형태, 체색(그라디언트), 지느러미, 비늘 무늬, 눈동자, 특수 효과가 전부 다르게 디자인됨

// 100종 물고기별 그래픽 스펙 정의
// shape: 'streamline'(유선형), 'deep_body'(붕어/도미형), 'flat'(넙치/가자미형), 'eel'(장어/바다뱀형),
//        'shark'(상어/철갑상어형), 'whale'(고래/리바이어던), 'cephalopod'(오징어/문어),
//        'crustacean'(게/새우), 'jellyfish'(해파리), 'ray'(가오리), 'dragon'(용/신화)
const FISH_SPECS = {
  // 1. 잔잔한 호수 (lake)
  minnow: { shape: 'streamline', c1: '#94a3b8', c2: '#cbd5e1', fin: '#f1f5f9', eye: '#0f172a', pattern: 'dots', patColor: '#64748b' },
  crucian: { shape: 'deep_body', c1: '#854d0e', c2: '#ca8a04', fin: '#a16207', eye: '#422006', pattern: 'scales', patColor: '#713f12' },
  mudfish: { shape: 'eel', c1: '#57534e', c2: '#a8a29e', fin: '#78716c', eye: '#1c1917', pattern: 'mud', patColor: '#44403c' },
  bluegill: { shape: 'deep_body', c1: '#0284c7', c2: '#38bdf8', fin: '#f59e0b', eye: '#0369a1', pattern: 'stripes', patColor: '#075985' },
  carp: { shape: 'deep_body', c1: '#d97706', c2: '#fbbf24', fin: '#b45309', eye: '#78350f', pattern: 'scales', patColor: '#92400e' },
  bass: { shape: 'streamline', c1: '#15803d', c2: '#4ade80', fin: '#166534', eye: '#14532d', pattern: 'stripes', patColor: '#14532d' },
  eel: { shape: 'eel', c1: '#334155', c2: '#64748b', fin: '#475569', eye: '#0f172a', pattern: 'none' },
  catfish: { shape: 'deep_body', c1: '#1e293b', c2: '#475569', fin: '#334155', eye: '#0f172a', whiskers: true, pattern: 'spots', patColor: '#0f172a' },
  snakehead: { shape: 'streamline', c1: '#3f6212', c2: '#84cc16', fin: '#4d7c0f', eye: '#365314', pattern: 'leopard', patColor: '#1a2e05' },
  golden_carp: { shape: 'deep_body', c1: '#eab308', c2: '#fef08a', fin: '#f59e0b', eye: '#713f12', glow: '#fef08a', pattern: 'scales', patColor: '#ca8a04' },

  // 2. 맑은 강 (river)
  dace: { shape: 'streamline', c1: '#38bdf8', c2: '#f0f9ff', fin: '#f97316', eye: '#0369a1', pattern: 'line', patColor: '#f97316' },
  kkeokji: { shape: 'deep_body', c1: '#78716c', c2: '#d6d3d1', fin: '#57534e', eye: '#292524', pattern: 'spots', patColor: '#44403c' },
  pale_chub: { shape: 'streamline', c1: '#06b6d4', c2: '#ec4899', fin: '#f43f5e', eye: '#0891b2', pattern: 'rainbow', patColor: '#f43f5e' },
  shiner: { shape: 'streamline', c1: '#0284c7', c2: '#e0f2fe', fin: '#38bdf8', eye: '#0369a1', pattern: 'stripe', patColor: '#0ea5e9' },
  mandarin_fish: { shape: 'deep_body', c1: '#d97706', c2: '#fef3c7', fin: '#b45309', eye: '#78350f', pattern: 'leopard', patColor: '#451a03' },
  trout: { shape: 'streamline', c1: '#059669', c2: '#f472b6', fin: '#10b981', eye: '#065f46', pattern: 'dots', patColor: '#be185d' },
  char: { shape: 'streamline', c1: '#b91c1c', c2: '#fca5a5', fin: '#ef4444', eye: '#7f1d1d', pattern: 'spots', patColor: '#991b1b' },
  salmon: { shape: 'streamline', c1: '#ea580c', c2: '#fdba74', fin: '#c2410c', eye: '#9a3412', pattern: 'stripes', patColor: '#7c2d12' },
  sweetfish: { shape: 'streamline', c1: '#eab308', c2: '#fef9c3', fin: '#facc15', eye: '#854d0e', glow: '#fef08a', pattern: 'none' },
  sturgeon: { shape: 'shark', c1: '#475569', c2: '#94a3b8', fin: '#334155', eye: '#0f172a', pattern: 'armor', patColor: '#1e293b' },

  // 3. 푸른 바다 (sea)
  mackerel: { shape: 'streamline', c1: '#0369a1', c2: '#e0f2fe', fin: '#0284c7', eye: '#0c4a6e', pattern: 'wave_stripes', patColor: '#075985' },
  horse_mackerel: { shape: 'streamline', c1: '#64748b', c2: '#f1f5f9', fin: '#eab308', eye: '#1e293b', pattern: 'line', patColor: '#ca8a04' },
  sardine: { shape: 'streamline', c1: '#0284c7', c2: '#f8fafc', fin: '#38bdf8', eye: '#0f172a', pattern: 'dots', patColor: '#0369a1' },
  anchovy_king: { shape: 'streamline', c1: '#38bdf8', c2: '#e2e8f0', fin: '#f59e0b', eye: '#0f172a', pattern: 'line', patColor: '#64748b' },
  sea_bream: { shape: 'deep_body', c1: '#f43f5e', c2: '#ffe4e6', fin: '#fb7185', eye: '#881337', pattern: 'scales', patColor: '#e11d48' },
  flounder: { shape: 'flat', c1: '#78716c', c2: '#d6d3d1', fin: '#57534e', eye: '#292524', pattern: 'spots', patColor: '#44403c' },
  rockfish: { shape: 'deep_body', c1: '#374151', c2: '#6b7280', fin: '#1f2937', eye: '#111827', pattern: 'mud', patColor: '#1f2937' },
  tuna: { shape: 'streamline', c1: '#1e3a8a', c2: '#93c5fd', fin: '#eab308', eye: '#172554', pattern: 'shading', patColor: '#1d4ed8' },
  yellowtail: { shape: 'streamline', c1: '#047857', c2: '#f0fdf4', fin: '#eab308', eye: '#064e3b', pattern: 'yellow_stripe', patColor: '#eab308' },
  marlin: { shape: 'streamline', c1: '#1e40af', c2: '#60a5fa', fin: '#3b82f6', eye: '#1e1b4b', sword: true, pattern: 'stripes', patColor: '#93c5fd' },

  // 4. 심해 협곡 (abyss)
  monkfish: { shape: 'deep_body', c1: '#475569', c2: '#64748b', fin: '#334155', eye: '#0f172a', anglerLight: true, pattern: 'mud', patColor: '#1e293b' },
  squid: { shape: 'cephalopod', c1: '#cbd5e1', c2: '#f8fafc', fin: '#94a3b8', eye: '#0284c7', pattern: 'tentacles' },
  cutlass: { shape: 'eel', c1: '#94a3b8', c2: '#f8fafc', fin: '#e2e8f0', eye: '#0f172a', pattern: 'metallic' },
  blobfish: { shape: 'deep_body', c1: '#f472b6', c2: '#fbcfe8', fin: '#f9a8d4', eye: '#4a044e', pattern: 'blob' },
  giant_octopus: { shape: 'cephalopod', c1: '#991b1b', c2: '#f87171', fin: '#b91c1c', eye: '#450a0a', pattern: 'tentacles' },
  vampire_squid: { shape: 'cephalopod', c1: '#831843', c2: '#db2777', fin: '#9d174d', eye: '#38bdf8', glow: '#38bdf8', pattern: 'web' },
  gulper_eel: { shape: 'eel', c1: '#0f172a', c2: '#334155', fin: '#1e293b', eye: '#22d3ee', glow: '#06b6d4', hugeMouth: true },
  anglerfish: { shape: 'deep_body', c1: '#1e1b4b', c2: '#4338ca', fin: '#312e81', eye: '#facc15', anglerLight: true, glow: '#fde047' },
  coelacanth: { shape: 'deep_body', c1: '#1e293b', c2: '#475569', fin: '#0ea5e9', eye: '#38bdf8', pattern: 'ancient_spots', patColor: '#38bdf8' },
  whale_shark: { shape: 'whale', c1: '#0c4a6e', c2: '#0284c7', fin: '#075985', eye: '#e0f2fe', pattern: 'stars', patColor: '#f8fafc' },

  // 5. 극지 빙하 (glacier)
  icefish: { shape: 'streamline', c1: '#e0f2fe', c2: '#ffffff', fin: '#bae6fd', eye: '#0284c7', opacity: 0.85 },
  polar_cod: { shape: 'streamline', c1: '#64748b', c2: '#e2e8f0', fin: '#94a3b8', eye: '#0f172a', pattern: 'dots', patColor: '#475569' },
  arctic_smelt: { shape: 'streamline', c1: '#38bdf8', c2: '#ffffff', fin: '#7dd3fc', eye: '#0369a1', glow: '#bae6fd' },
  glacier_crab: { shape: 'crustacean', c1: '#38bdf8', c2: '#e0f2fe', fin: '#0284c7', eye: '#082f49' },
  king_icefish: { shape: 'deep_body', c1: '#0284c7', c2: '#7dd3fc', fin: '#38bdf8', eye: '#facc15', glow: '#38bdf8' },
  greenland_shark: { shape: 'shark', c1: '#475569', c2: '#64748b', fin: '#334155', eye: '#94a3b8', pattern: 'frost', patColor: '#cbd5e1' },
  narwhal: { shape: 'whale', c1: '#334155', c2: '#94a3b8', fin: '#1e293b', eye: '#0f172a', horn: true },
  leopard_seal: { shape: 'streamline', c1: '#475569', c2: '#cbd5e1', fin: '#334155', eye: '#0f172a', pattern: 'leopard', patColor: '#1e293b' },
  aurora_whale: { shape: 'whale', c1: '#06b6d4', c2: '#a855f7', fin: '#ec4899', eye: '#fef08a', glow: '#a855f7', pattern: 'aurora' },
  white_whale: { shape: 'whale', c1: '#f8fafc', c2: '#e2e8f0', fin: '#cbd5e1', eye: '#0284c7', glow: '#ffffff' },

  // 6. 신비한 용궁 (palace)
  seahorse: { shape: 'eel', c1: '#f59e0b', c2: '#fde68a', fin: '#fbbf24', eye: '#78350f', crown: true },
  pearl_clam: { shape: 'flat', c1: '#f43f5e', c2: '#fecdd3', fin: '#fb7185', eye: '#ffffff', pearl: true },
  coral_fish: { shape: 'deep_body', c1: '#f97316', c2: '#fef08a', fin: '#ec4899', eye: '#431407', pattern: 'stripes', patColor: '#ffffff' },
  lantern_crab: { shape: 'crustacean', c1: '#eab308', c2: '#fef08a', fin: '#ca8a04', eye: '#713f12', goldChest: true },
  palace_carp: { shape: 'deep_body', c1: '#ef4444', c2: '#ffffff', fin: '#f59e0b', eye: '#1e1b4b', pattern: 'koi', patColor: '#1e293b' },
  mantis_shrimp: { shape: 'crustacean', c1: '#10b981', c2: '#38bdf8', fin: '#f43f5e', eye: '#facc15' },
  goldfish_princess: { shape: 'deep_body', c1: '#f97316', c2: '#fda4af', fin: '#fb7185', eye: '#1e1b4b', crown: true, glow: '#fed7aa' },
  palace_turtle: { shape: 'flat', c1: '#059669', c2: '#34d399', fin: '#047857', eye: '#fef08a' },
  king_crab_general: { shape: 'dragon', c1: '#dc2626', c2: '#f59e0b', fin: '#b91c1c', eye: '#facc15', horns: true },
  blue_dragon: { shape: 'dragon', c1: '#0284c7', c2: '#38bdf8', fin: '#e0f2fe', eye: '#fde047', glow: '#38bdf8', dragonBeard: true },

  // 7. 우주 성운 해구 (nebula)
  star_fish: { shape: 'deep_body', c1: '#eab308', c2: '#fef08a', fin: '#facc15', eye: '#451a03', glow: '#facc15' },
  plasma_jelly: { shape: 'jellyfish', c1: '#8b5cf6', c2: '#c084fc', fin: '#a855f7', eye: '#22d3ee', glow: '#c084fc' },
  cosmic_shrimp: { shape: 'crustacean', c1: '#ec4899', c2: '#f472b6', fin: '#db2777', eye: '#22d3ee', glow: '#f472b6' },
  starlight_squid: { shape: 'cephalopod', c1: '#6366f1', c2: '#a5b4fc', fin: '#818cf8', eye: '#facc15', glow: '#818cf8' },
  meteor_ray: { shape: 'ray', c1: '#f97316', c2: '#fde047', fin: '#ea580c', eye: '#ffffff', glow: '#f97316' },
  supernova_fish: { shape: 'deep_body', c1: '#ec4899', c2: '#fde047', fin: '#38bdf8', eye: '#ffffff', glow: '#ffffff' },
  blackhole_eel: { shape: 'eel', c1: '#09090b', c2: '#3f3f46', fin: '#8b5cf6', eye: '#ec4899', glow: '#a855f7' },
  galaxy_whale: { shape: 'whale', c1: '#1e1b4b', c2: '#4338ca', fin: '#818cf8', eye: '#fde047', glow: '#818cf8', pattern: 'stars', patColor: '#ffffff' },
  pulsar_beast: { shape: 'dragon', c1: '#7c3aed', c2: '#c084fc', fin: '#22d3ee', eye: '#f43f5e', glow: '#c084fc' },
  cosmic_leviathan: { shape: 'dragon', c1: '#4c1d95', c2: '#06b6d4', fin: '#ec4899', eye: '#facc15', glow: '#06b6d4', cosmicAura: true },

  // 8. 용암 분화호 (volcano)
  magma_guppy: { shape: 'streamline', c1: '#ea580c', c2: '#facc15', fin: '#dc2626', eye: '#ffffff', glow: '#f97316' },
  ember_crab: { shape: 'crustacean', c1: '#b91c1c', c2: '#f97316', fin: '#991b1b', eye: '#fef08a', glow: '#f97316' },
  lava_eel: { shape: 'eel', c1: '#dc2626', c2: '#f97316', fin: '#facc15', eye: '#ffffff', glow: '#ef4444' },
  ash_puffer: { shape: 'deep_body', c1: '#44403c', c2: '#78716c', fin: '#ea580c', eye: '#f97316', pattern: 'fire_spots', patColor: '#f97316' },
  obsidian_carp: { shape: 'deep_body', c1: '#18181b', c2: '#27272a', fin: '#dc2626', eye: '#f43f5e', pattern: 'cracks', patColor: '#ef4444' },
  flame_tuna: { shape: 'streamline', c1: '#dc2626', c2: '#fb923c', fin: '#facc15', eye: '#ffffff', glow: '#f97316' },
  inferno_octopus: { shape: 'cephalopod', c1: '#7f1d1d', c2: '#dc2626', fin: '#ea580c', eye: '#fef08a', glow: '#f97316' },
  magma_shark: { shape: 'shark', c1: '#450a0a', c2: '#dc2626', fin: '#f97316', eye: '#fde047', glow: '#ea580c' },
  salamander_king: { shape: 'streamline', c1: '#ea580c', c2: '#facc15', fin: '#991b1b', eye: '#ffffff', horns: true, glow: '#f97316' },
  phoenix_leviathan: { shape: 'dragon', c1: '#b91c1c', c2: '#facc15', fin: '#ea580c', eye: '#ffffff', glow: '#fbbf24', phoenixWings: true },

  // 9. 시간의 틈새 해저 (timewarp)
  clockwork_fish: { shape: 'deep_body', c1: '#b45309', c2: '#fde68a', fin: '#78350f', eye: '#38bdf8', gears: true },
  past_dunkle: { shape: 'shark', c1: '#52525b', c2: '#a1a1aa', fin: '#3f3f46', eye: '#18181b', armorHead: true },
  future_drone_fish: { shape: 'streamline', c1: '#0284c7', c2: '#e0f2fe', fin: '#06b6d4', eye: '#ef4444', cyberVisor: true },
  chrono_squid: { shape: 'cephalopod', c1: '#7c3aed', c2: '#c4b5fd', fin: '#6d28d9', eye: '#22d3ee', glow: '#8b5cf6' },
  hourglass_ray: { shape: 'ray', c1: '#d97706', c2: '#fef3c7', fin: '#b45309', eye: '#38bdf8', hourglassMark: true },
  paradox_jelly: { shape: 'jellyfish', c1: '#ec4899', c2: '#38bdf8', fin: '#a855f7', eye: '#ffffff', glow: '#ec4899' },
  dimension_eel: { shape: 'eel', c1: '#3b0764', c2: '#9333ea', fin: '#c084fc', eye: '#4ade80', glow: '#a855f7' },
  ancient_mosasaur: { shape: 'shark', c1: '#1e3a8a', c2: '#3b82f6', fin: '#172554', eye: '#facc15', hugeTeeth: true },
  future_mecha_whale: { shape: 'whale', c1: '#334155', c2: '#94a3b8', fin: '#06b6d4', eye: '#22d3ee', cyberVisor: true, glow: '#06b6d4' },
  chronos_dragon: { shape: 'dragon', c1: '#4c1d95', c2: '#fbbf24', fin: '#ec4899', eye: '#38bdf8', glow: '#fbbf24', timeHalo: true },

  // 10. 천상 유원지 (sky_ocean)
  cloud_guppy: { shape: 'streamline', c1: '#e0f2fe', c2: '#ffffff', fin: '#bae6fd', eye: '#0284c7', cloudWings: true },
  rainbow_tetra: { shape: 'streamline', c1: '#ef4444', c2: '#facc15', fin: '#3b82f6', eye: '#10b981', pattern: 'rainbow' },
  feather_fish: { shape: 'deep_body', c1: '#f8fafc', c2: '#fef08a', fin: '#ffffff', eye: '#0284c7', angelWings: true },
  sunlight_ray: { shape: 'ray', c1: '#eab308', c2: '#ffffff', fin: '#fde047', eye: '#ea580c', glow: '#fef08a' },
  valkyrie_salmon: { shape: 'streamline', c1: '#38bdf8', c2: '#ffffff', fin: '#fbbf24', eye: '#1e3a8a', wings: true },
  pegasus_seahorse: { shape: 'eel', c1: '#e0e7ff', c2: '#ffffff', fin: '#818cf8', eye: '#38bdf8', angelWings: true, crown: true },
  seraphim_jelly: { shape: 'jellyfish', c1: '#fde047', c2: '#ffffff', fin: '#fbbf24', eye: '#38bdf8', angelWings: true, glow: '#fef08a' },
  eden_serpent: { shape: 'eel', c1: '#10b981', c2: '#fde047', fin: '#059669', eye: '#dc2626', glow: '#34d399', crown: true },
  heavenly_phoenix: { shape: 'dragon', c1: '#f59e0b', c2: '#ef4444', fin: '#fbbf24', eye: '#ffffff', glow: '#fde047', phoenixWings: true },
  celestial_yggdrasil: { shape: 'dragon', c1: '#6366f1', c2: '#f43f5e', fin: '#facc15', eye: '#22d3ee', glow: '#ffffff', godCrown: true },

  // 🤫 비밀 히든 물고기 20종 전용 맞춤형 고화질 비주얼
  hf_thunder_catfish: { shape: 'deep_body', c1: '#eab308', c2: '#fde047', fin: '#ca8a04', eye: '#ffffff', glow: '#fde047', whiskers: true },
  hf_phantom_ray: { shape: 'ray', c1: '#94a3b8', c2: '#e2e8f0', fin: '#cbd5e1', eye: '#38bdf8', glow: '#38bdf8', opacity: 0.8 },
  hf_lunar_jellyfish: { shape: 'jellyfish', c1: '#06b6d4', c2: '#38bdf8', fin: '#a5f3fc', eye: '#ffffff', glow: '#06b6d4' },
  hf_sun_dragon: { shape: 'dragon', c1: '#ea580c', c2: '#facc15', fin: '#dc2626', eye: '#ffffff', glow: '#f97316' },
  hf_ancient_turtle: { shape: 'flat', c1: '#78716c', c2: '#a8a29e', fin: '#57534e', eye: '#1c1917' },
  hf_speed_sailfish: { shape: 'streamline', c1: '#0284c7', c2: '#38bdf8', fin: '#f97316', eye: '#0369a1', sword: true },
  hf_cruise_leviathan: { shape: 'whale', c1: '#eab308', c2: '#fef08a', fin: '#ca8a04', eye: '#78350f', glow: '#fde047' },
  hf_bamboo_spirit: { shape: 'streamline', c1: '#16a34a', c2: '#86efac', fin: '#15803d', eye: '#14532d', glow: '#4ade80' },
  hf_fever_phoenix: { shape: 'dragon', c1: '#dc2626', c2: '#f97316', fin: '#facc15', eye: '#ffffff', glow: '#ef4444', phoenixWings: true },
  hf_sniper_barracuda: { shape: 'streamline', c1: '#dc2626', c2: '#ffffff', fin: '#991b1b', eye: '#000000', sword: true },
  hf_golden_koi_king: { shape: 'deep_body', c1: '#f59e0b', c2: '#fde047', fin: '#d97706', eye: '#78350f', crown: true, glow: '#fde047' },
  hf_rainbow_hydra: { shape: 'dragon', c1: '#ec4899', c2: '#38bdf8', fin: '#facc15', eye: '#ffffff', glow: '#a855f7' },
  hf_cosmic_stardust: { shape: 'deep_body', c1: '#a855f7', c2: '#f472b6', fin: '#facc15', eye: '#ffffff', glow: '#c084fc' },
  hf_quantum_ghost: { shape: 'streamline', c1: '#06b6d4', c2: '#8b5cf6', fin: '#ec4899', eye: '#ffffff', glow: '#06b6d4' },
  hf_magma_behemoth: { shape: 'shark', c1: '#450a0a', c2: '#ef4444', fin: '#f97316', eye: '#fde047', glow: '#dc2626' },
  hf_ice_crystal_queen: { shape: 'deep_body', c1: '#cffafe', c2: '#ffffff', fin: '#38bdf8', eye: '#0284c7', crown: true, glow: '#a5f3fc' },
  hf_abyss_kraken: { shape: 'cephalopod', c1: '#4c1d95', c2: '#db2777', fin: '#701a75', eye: '#facc15', glow: '#a21caf' },
  hf_dragon_palace_emperor: { shape: 'dragon', c1: '#eab308', c2: '#f59e0b', fin: '#dc2626', eye: '#fde047', crown: true, glow: '#fef08a' },
  hf_seraph_archangel: { shape: 'deep_body', c1: '#ffffff', c2: '#fef08a', fin: '#fde047', eye: '#0284c7', glow: '#ffffff' },
  hf_genesis_ouroboros: { shape: 'dragon', c1: '#312e81', c2: '#ec4899', fin: '#06b6d4', eye: '#fde047', glow: '#c084fc', godCrown: true },
};

// SVG 그래픽 렌더러
export function getFishSvg(fishId, size = 64) {
  const spec = FISH_SPECS[fishId] || {
    shape: 'streamline',
    c1: '#38bdf8',
    c2: '#e0f2fe',
    fin: '#0284c7',
    eye: '#0c4a6e',
  };

  const gId = `grad_${fishId}_${Math.floor(Math.random() * 10000)}`;
  const filterId = `glow_${fishId}_${Math.floor(Math.random() * 10000)}`;

  let defs = `
    <defs>
      <linearGradient id="${gId}" x1="0%" y1="0%" x2="100%" y2="50%">
        <stop offset="0%" stop-color="${spec.c1}" />
        <stop offset="100%" stop-color="${spec.c2}" />
      </linearGradient>
      ${
        spec.glow
          ? `
        <filter id="${filterId}" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      `
          : ''
      }
    </defs>
  `;

  let filterAttr = spec.glow ? `filter="url(#${filterId})"` : '';
  let bodyContent = '';

  switch (spec.shape) {
    case 'deep_body':
      bodyContent = `
        <!-- 꼬리지느러미 -->
        <polygon points="12,32 2,18 6,32 2,46" fill="${spec.fin}" />
        <!-- 등/배지느러미 -->
        <path d="M22,18 Q32,6 42,14" fill="${spec.fin}" />
        <path d="M24,46 Q34,58 40,50" fill="${spec.fin}" />
        <!-- 통통한 몸통 -->
        <path d="M12,32 Q20,12 44,14 Q60,20 62,32 Q60,44 44,50 Q20,52 12,32 Z" fill="url(#${gId})" />
        <!-- 아가미 및 눈 -->
        <path d="M46,24 Q42,32 46,40" stroke="${spec.fin}" stroke-width="2" fill="none" opacity="0.6" />
        <circle cx="53" cy="27" r="3.5" fill="#ffffff" />
        <circle cx="54" cy="27" r="2" fill="${spec.eye}" />
        <!-- 가슴지느러미 -->
        <ellipse cx="36" cy="35" rx="7" ry="4" fill="${spec.fin}" transform="rotate(-15 36 35)" opacity="0.85" />
      `;
      break;

    case 'flat':
      bodyContent = `
        <!-- 넙적한 몸체 (넙치/조개) -->
        <polygon points="10,32 2,22 5,32 2,42" fill="${spec.fin}" />
        <ellipse cx="34" cy="32" rx="26" ry="18" fill="url(#${gId})" />
        <path d="M12,32 Q34,10 56,32" stroke="${spec.fin}" stroke-width="2.5" fill="none" opacity="0.7" />
        <circle cx="48" cy="25" r="3" fill="#ffffff" />
        <circle cx="49" cy="25" r="1.8" fill="${spec.eye}" />
        <circle cx="44" cy="23" r="2.8" fill="#ffffff" />
        <circle cx="45" cy="23" r="1.6" fill="${spec.eye}" />
      `;
      break;

    case 'eel':
      bodyContent = `
        <!-- 물결치는 장어형 몸체 -->
        <path d="M4,32 Q14,20 28,34 Q42,48 58,32" stroke="url(#${gId})" stroke-width="9" stroke-linecap="round" fill="none" />
        <path d="M4,32 Q14,20 28,34 Q42,48 58,32" stroke="${spec.fin}" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.4" />
        <!-- 머리와 눈 -->
        <ellipse cx="58" cy="32" rx="5" ry="4.5" fill="${spec.c1}" />
        <circle cx="59" cy="30" r="1.5" fill="${spec.eye}" />
      `;
      break;

    case 'shark':
      bodyContent = `
        <!-- 상어/철갑상어 날렵한 실루엣 -->
        <polygon points="10,32 2,12 7,30 3,48" fill="${spec.fin}" />
        <polygon points="34,16 38,2 45,18" fill="${spec.fin}" />
        <polygon points="40,46 44,56 47,44" fill="${spec.fin}" />
        <!-- 몸체 -->
        <path d="M8,32 Q20,16 48,18 L62,32 Q48,46 16,42 Z" fill="url(#${gId})" />
        <!-- 아가미 슬릿 3줄 -->
        <line x1="42" y1="26" x2="42" y2="36" stroke="${spec.eye}" stroke-width="1.2" opacity="0.4" />
        <line x1="45" y1="27" x2="45" y2="35" stroke="${spec.eye}" stroke-width="1.2" opacity="0.4" />
        <circle cx="54" cy="27" r="2" fill="${spec.eye}" />
      `;
      break;

    case 'whale':
      bodyContent = `
        <!-- 거대 고래 실루엣 -->
        <path d="M12,32 Q6,14 2,10 Q6,30 12,32 Q6,34 2,54 Q6,50 12,32 Z" fill="${spec.fin}" />
        <path d="M12,32 Q24,12 48,14 Q62,18 62,34 Q62,48 44,50 Q24,48 12,32 Z" fill="url(#${gId})" />
        <!-- 턱 주름선 -->
        <path d="M40,46 Q54,44 60,36" stroke="${spec.fin}" stroke-width="2" fill="none" opacity="0.6" />
        <circle cx="52" cy="26" r="2.5" fill="${spec.eye}" />
        <!-- 거대 지느러미 -->
        <ellipse cx="34" cy="38" rx="10" ry="5" fill="${spec.fin}" transform="rotate(25 34 38)" />
      `;
      break;

    case 'cephalopod':
      bodyContent = `
        <!-- 오징어/문어 두족류 -->
        <ellipse cx="44" cy="32" rx="16" ry="12" fill="url(#${gId})" />
        <polygon points="56,32 62,20 62,44" fill="${spec.fin}" />
        <!-- 눈 -->
        <circle cx="36" cy="28" r="3.5" fill="#ffffff" />
        <circle cx="35" cy="28" r="2" fill="${spec.eye}" />
        <!-- 촉수 4가닥 -->
        <path d="M28,26 Q16,22 6,24" stroke="${spec.fin}" stroke-width="3" stroke-linecap="round" fill="none" />
        <path d="M28,30 Q14,30 4,32" stroke="${spec.fin}" stroke-width="3.5" stroke-linecap="round" fill="none" />
        <path d="M28,34 Q16,38 6,40" stroke="${spec.fin}" stroke-width="3" stroke-linecap="round" fill="none" />
      `;
      break;

    case 'crustacean':
      bodyContent = `
        <!-- 게/새우 갑각류 -->
        <ellipse cx="32" cy="32" rx="16" ry="12" fill="url(#${gId})" />
        <!-- 집게발 좌우 -->
        <path d="M42,24 Q54,14 58,22" stroke="${spec.fin}" stroke-width="4" stroke-linecap="round" fill="none" />
        <path d="M42,40 Q54,50 58,42" stroke="${spec.fin}" stroke-width="4" stroke-linecap="round" fill="none" />
        <!-- 다리 6개 -->
        <line x1="24" y1="20" x2="16" y2="12" stroke="${spec.c1}" stroke-width="2.5" stroke-linecap="round" />
        <line x1="28" y1="20" x2="24" y2="10" stroke="${spec.c1}" stroke-width="2.5" stroke-linecap="round" />
        <line x1="24" y1="44" x2="16" y2="52" stroke="${spec.c1}" stroke-width="2.5" stroke-linecap="round" />
        <line x1="28" y1="44" x2="24" y2="54" stroke="${spec.c1}" stroke-width="2.5" stroke-linecap="round" />
        <circle cx="44" cy="29" r="2" fill="${spec.eye}" />
        <circle cx="44" cy="35" r="2" fill="${spec.eye}" />
      `;
      break;

    case 'jellyfish':
      bodyContent = `
        <!-- 해파리 돔과 촉수 -->
        <path d="M24,32 C24,14 56,14 56,32 C56,38 24,38 24,32 Z" fill="url(#${gId})" />
        <!-- 물결치는 투명 촉수 -->
        <path d="M30,36 Q26,48 28,60" stroke="${spec.fin}" stroke-width="2" fill="none" opacity="0.8" />
        <path d="M38,36 Q36,52 38,62" stroke="${spec.fin}" stroke-width="2.5" fill="none" />
        <path d="M46,36 Q48,50 46,60" stroke="${spec.fin}" stroke-width="2" fill="none" opacity="0.8" />
        <circle cx="36" cy="26" r="2.5" fill="${spec.eye}" />
        <circle cx="44" cy="26" r="2.5" fill="${spec.eye}" />
      `;
      break;

    case 'ray':
      bodyContent = `
        <!-- 가오리 다이아몬드형 날개와 꼬리 -->
        <polygon points="18,32 36,12 56,32 36,52" fill="url(#${gId})" />
        <line x1="18" y1="32" x2="2" y2="32" stroke="${spec.fin}" stroke-width="3" stroke-linecap="round" />
        <circle cx="48" cy="27" r="2" fill="${spec.eye}" />
        <circle cx="48" cy="37" r="2" fill="${spec.eye}" />
      `;
      break;

    case 'dragon':
      bodyContent = `
        <!-- 신화 용 / 레비아탄 위엄 있는 형상 -->
        <path d="M4,32 Q16,14 32,32 Q48,50 58,26" stroke="url(#${gId})" stroke-width="11" stroke-linecap="round" fill="none" />
        <!-- 등뼈 돌기 가시들 -->
        <polygon points="20,18 24,8 28,18" fill="${spec.fin}" />
        <polygon points="34,26 38,16 42,26" fill="${spec.fin}" />
        <polygon points="46,34 50,24 54,34" fill="${spec.fin}" />
        <!-- 뿔과 눈 -->
        <path d="M56,22 Q62,10 60,4" stroke="${spec.fin}" stroke-width="3" stroke-linecap="round" fill="none" />
        <circle cx="56" cy="24" r="3" fill="#ffffff" />
        <circle cx="57" cy="24" r="2" fill="${spec.eye}" />
      `;
      break;

    case 'streamline':
    default:
      bodyContent = `
        <!-- 유선형 물고기 기본기 (디테일 비늘, 아가미, 지느러미) -->
        <polygon points="10,32 2,16 6,32 2,48" fill="${spec.fin}" />
        <path d="M26,18 Q36,8 44,16" fill="${spec.fin}" />
        <path d="M26,46 Q36,56 42,48" fill="${spec.fin}" />
        <!-- 몸통 -->
        <path d="M10,32 Q22,14 46,16 Q62,24 62,32 Q62,40 46,48 Q22,50 10,32 Z" fill="url(#${gId})" />
        <!-- 아가미 선 -->
        <path d="M46,22 Q40,32 46,42" stroke="${spec.fin}" stroke-width="2" fill="none" opacity="0.6" />
        <!-- 눈 -->
        <circle cx="53" cy="27" r="3.5" fill="#ffffff" />
        <circle cx="54" cy="27" r="2" fill="${spec.eye}" />
        <!-- 가슴지느러미 -->
        <ellipse cx="36" cy="35" rx="8" ry="4" fill="${spec.fin}" transform="rotate(-10 36 35)" opacity="0.85" />
      `;
      break;
  }

  // 특수 장식(뿔, 왕관, 날개 등)
  let extraDecoration = '';
  if (spec.crown || spec.godCrown) {
    extraDecoration += `<polygon points="50,14 53,8 56,12 59,8 62,14" fill="#facc15" stroke="#b45309" stroke-width="0.8" />`;
  }
  if (spec.sword) {
    extraDecoration += `<line x1="62" y1="32" x2="72" y2="30" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" />`;
  }
  if (spec.anglerLight) {
    extraDecoration += `
      <path d="M48,14 Q52,2 58,8" stroke="#38bdf8" stroke-width="1.5" fill="none" />
      <circle cx="58" cy="8" r="2.5" fill="#fef08a" filter="drop-shadow(0 0 3px #fef08a)" />
    `;
  }

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 74 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="fish-vector-svg">
      ${defs}
      <g ${filterAttr}>
        ${bodyContent}
        ${extraDecoration}
      </g>
    </svg>
  `;
}
