export const START = {
  gold: 100,
  region: 'lake',
  rod: 'bamboo',
  bait: 'basic',
  bagCapacity: 20,
};

// 5개 등급: 일반, 희귀, 영웅, 전설, 그리고 전설 윗등급 [신화 (Mythic)]
export const RARITIES = {
  common:    { id: 'common',    name: '일반', cssVar: '--rarity-common' },
  rare:      { id: 'rare',      name: '희귀', cssVar: '--rarity-rare' },
  epic:      { id: 'epic',      name: '영웅', cssVar: '--rarity-epic' },
  legendary: { id: 'legendary', name: '전설', cssVar: '--rarity-legendary' },
  mythic:    { id: 'mythic',    name: '신화', cssVar: '--rarity-mythic' },
};

// 10개 지역
export const REGIONS = [
  { id: 'lake', name: '잔잔한 호수', desc: '바람 한 점 없는 조용한 호수', unlockPrice: 0, requiredCollection: 0, completeReward: 500 },
  { id: 'river', name: '맑은 강', desc: '물살이 빠른 시원한 강', unlockPrice: 500, requiredCollection: 0, completeReward: 1500 },
  { id: 'sea', name: '푸른 바다', desc: '큰 물고기가 사는 넓은 바다', unlockPrice: 2000, requiredCollection: 0, completeReward: 4000 },
  { id: 'abyss', name: '심해 협곡', desc: '빛이 닿지 않는 깊은 바닷속', unlockPrice: 8000, requiredCollection: 10, completeReward: 10000 },
  { id: 'glacier', name: '극지 빙하', desc: '얼음 아래 차가운 생명이 숨쉬는 극지방', unlockPrice: 25000, requiredCollection: 20, completeReward: 20000 },
  { id: 'palace', name: '신비한 용궁', desc: '바다 깊은 곳 영롱하게 빛나는 전설의 궁전', unlockPrice: 80000, requiredCollection: 35, completeReward: 50000 },
  { id: 'nebula', name: '우주 성운 해구', desc: '별빛과 에너지가 흐르는 우주 속 은하 낚시터', unlockPrice: 250000, requiredCollection: 50, completeReward: 150000 },
  { id: 'volcano', name: '용암 분화호', desc: '끓어오르는 마그마 속에서 헤엄치는 불꽃의 생명체들', unlockPrice: 800000, requiredCollection: 65, completeReward: 400000 },
  { id: 'timewarp', name: '시간의 틈새 해저', desc: '과거와 미래의 시공간이 뒤엉킨 신비의 차원 바다', unlockPrice: 2500000, requiredCollection: 80, completeReward: 1000000 },
  { id: 'sky_ocean', name: '천상 유원지', desc: '무지개 구름 위 신들이 노니는 궁극의 천상 바다', unlockPrice: 8000000, requiredCollection: 90, completeReward: 5000000 },
];

// 미끼 8종 (신화 확률 포함)
export const BAITS = {
  basic: {
    id: 'basic', name: '기본 미끼', emoji: '🍞', price: 0, infinite: true,
    weights: { common: 60, rare: 28, epic: 10, legendary: 2, mythic: 0 },
    desc: '언제나 쓸 수 있는 빵 미끼',
  },
  worm: {
    id: 'worm', name: '지렁이 미끼', emoji: '🪱', price: 10, infinite: false,
    weights: { common: 52, rare: 33, epic: 12, legendary: 3, mythic: 0 },
    desc: '희귀 물고기가 조금 더 잘 물어요',
  },
  shiny: {
    id: 'shiny', name: '반짝이 미끼', emoji: '✨', price: 50, infinite: false,
    weights: { common: 43, rare: 36, epic: 16, legendary: 5, mythic: 0 },
    desc: '희귀·영웅 물고기가 잘 물어요',
  },
  golden: {
    id: 'golden', name: '황금 미끼', emoji: '🌟', price: 200, infinite: false,
    weights: { common: 35, rare: 30, epic: 24, legendary: 10, mythic: 1 },
    desc: '전설과 신화 물고기를 노려보세요',
  },
  rainbow: {
    id: 'rainbow', name: '무지개 미끼', emoji: '🌈', price: 500, infinite: false,
    weights: { common: 25, rare: 32, epic: 27, legendary: 13, mythic: 3 },
    desc: '오색빛깔로 영웅·전설·신화를 유혹해요',
  },
  cosmic_bait: {
    id: 'cosmic_bait', name: '코스믹 미끼', emoji: '🪐', price: 1500, infinite: false,
    weights: { common: 15, rare: 30, epic: 32, legendary: 17, mythic: 6 },
    desc: '은하수의 기운을 품은 강력한 미끼',
  },
  phoenix: {
    id: 'phoenix', name: '불사조 깃털 미끼', emoji: '🔥', price: 5000, infinite: false,
    weights: { common: 10, rare: 25, epic: 35, legendary: 20, mythic: 10 },
    desc: '영원히 타오르는 불꽃으로 대물을 불러모아요',
  },
  celestial_star: {
    id: 'celestial_star', name: '천상의 별조각 미끼', emoji: '💫', price: 15000, infinite: false,
    weights: { common: 5, rare: 20, epic: 35, legendary: 25, mythic: 15 },
    desc: '신화 등급 물고기가 반응하는 궁극의 미끼',
  },
};

export const BAIT_MAX = 999;
export const BAIT_ORDER = ['basic', 'worm', 'shiny', 'golden', 'rainbow', 'cosmic_bait', 'phoenix', 'celestial_star'];

// 낚싯대 10종 (신규 능력치: 조준 너비, 제압력/스턴초, 릴링 파워)
export const RODS = {
  bamboo: {
    id: 'bamboo', name: '대나무 낚싯대', emoji: '🎋', price: 0,
    trackingWidth: 26, stunDuration: 1.2, reelMultiplier: 1.0,
    desc: '기본적인 대나무 낚싯대. 조준과 스매시 기초용',
  },
  carbon: {
    id: 'carbon', name: '카본 낚싯대', emoji: '🎣', price: 300,
    trackingWidth: 30, stunDuration: 1.5, reelMultiplier: 1.15,
    desc: '가볍고 탄성이 좋아 좌우 반응 속도가 빨라요',
  },
  pro: {
    id: 'pro', name: '프로 낚싯대', emoji: '🪝', price: 1500,
    trackingWidth: 35, stunDuration: 1.8, reelMultiplier: 1.30,
    desc: '넓은 조준 반경과 강한 스매시 제압력을 자랑합니다',
  },
  legend: {
    id: 'legend', name: '전설의 낚싯대', emoji: '🔱', price: 6000,
    trackingWidth: 40, stunDuration: 2.2, reelMultiplier: 1.50,
    desc: '바다의 신이 남긴 삼지창의 힘. 점프한 물고기를 강력히 제압',
  },
  titanium: {
    id: 'titanium', name: '티타늄 낚싯대', emoji: '⚡', price: 20000,
    trackingWidth: 45, stunDuration: 2.6, reelMultiplier: 1.70,
    desc: '전기 충격파를 발생시켜 점프 스매시 시 물고기 2.6초 기절',
  },
  dragon: {
    id: 'dragon', name: '용비늘 낚싯대', emoji: '🐉', price: 80000,
    trackingWidth: 50, stunDuration: 3.0, reelMultiplier: 1.95,
    desc: '용궁의 여의주 기운으로 화면 절반을 커버하는 넓은 조준각',
  },
  cosmic: {
    id: 'cosmic', name: '은하의 성채 낚싯대', emoji: '🌌', price: 300000,
    trackingWidth: 55, stunDuration: 3.5, reelMultiplier: 2.25,
    desc: '중력장을 펼쳐 물고기의 좌우 이동을 봉쇄합니다',
  },
  magma: {
    id: 'magma', name: '용암의 창 낚싯대', emoji: '🌋', price: 1000000,
    trackingWidth: 60, stunDuration: 4.0, reelMultiplier: 2.60,
    desc: '불꽃 스매시로 단 한 번의 강타에 물고기를 완벽 무력화',
  },
  timewarp_rod: {
    id: 'timewarp_rod', name: '시간 역행 낚싯대', emoji: '⏳', price: 3500000,
    trackingWidth: 65, stunDuration: 4.5, reelMultiplier: 3.00,
    desc: '시공간을 왜곡하여 물고기의 점프 타이밍을 매우 느리게 만듦',
  },
  celestial_god: {
    id: 'celestial_god', name: '천상신의 황금 낚싯대', emoji: '👑', price: 10000000,
    trackingWidth: 75, stunDuration: 5.5, reelMultiplier: 3.60,
    desc: '우주 전체를 가두는 신의 결계. 스매시 성공 시 즉시 35% 끌어당김!',
  },
};

export const ROD_ORDER = ['bamboo', 'carbon', 'pro', 'legend', 'titanium', 'dragon', 'cosmic', 'magma', 'timewarp_rod', 'celestial_god'];

// 특수 부적/아이템 (신규 상점 품목)
export const SPECIAL_ITEMS = {
  charm_luck: { id: 'charm_luck', name: '행운의 부적', emoji: '🍀', price: 3000, desc: '다음 낚시 5회 동안 전설·신화 출현 확률 2배 증가!', maxCount: 99 },
  hourglass_time: { id: 'hourglass_time', name: '시간 정지 모래시계', emoji: '⏱️', price: 5000, desc: '릴 미니게임 제한 시간이 15초 늘어나 여유롭게 낚아요 (5회 적용)', maxCount: 99 },
  magnet_gold: { id: 'magnet_gold', name: '황금 자석', emoji: '🧲', price: 50000, desc: '보유 중 영구 효과: 모든 물고기 판매 금액 +30% 보너스!', isPermanent: true },
  potion_zone: { id: 'potion_zone', name: '거인의 비약', emoji: '🧪', price: 8000, desc: '다음 낚시 5회 동안 잡기 영역 크기가 1.5배로 커집니다', maxCount: 99 },
};

// 가방 업그레이드 (20 -> 200마리)
export const BAG_UPGRADES = [
  { from: 20, to: 30, price: 400 },
  { from: 30, to: 40, price: 1000 },
  { from: 40, to: 50, price: 2500 },
  { from: 50, to: 70, price: 6000 },
  { from: 70, to: 100, price: 15000 },
  { from: 100, to: 150, price: 50000 },
  { from: 150, to: 200, price: 150000 },
];

// 총 100종 물고기 (10개 지역 × 10마리씩)
// 각 지역: 일반 4마리, 희귀 3마리, 영웅 2마리, 전설/신화 1마리
export const FISH = [
  // 1. 잔잔한 호수 (lake) - 10마리
  { id: 'minnow', region: 'lake', name: '피라미', emoji: '🐟', rarity: 'common', minSize: 5, maxSize: 15, basePrice: 15, difficulty: 1, desc: '떼 지어 다니는 작은 물고기' },
  { id: 'crucian', region: 'lake', name: '붕어', emoji: '🐟', rarity: 'common', minSize: 10, maxSize: 30, basePrice: 20, difficulty: 1, desc: '호수에서 가장 흔한 물고기' },
  { id: 'mudfish', region: 'lake', name: '미꾸라지', emoji: '🪱', rarity: 'common', minSize: 8, maxSize: 22, basePrice: 25, difficulty: 1, desc: '진흙 속에 숨어 사는 미끄러운 친구' },
  { id: 'bluegill', region: 'lake', name: '블루길', emoji: '🐠', rarity: 'common', minSize: 12, maxSize: 28, basePrice: 30, difficulty: 1, desc: '호수 풀숲 주변을 맴돌아요' },
  { id: 'carp', region: 'lake', name: '잉어', emoji: '🐠', rarity: 'rare', minSize: 30, maxSize: 80, basePrice: 80, difficulty: 2, desc: '힘이 세고 오래 사는 물고기' },
  { id: 'bass', region: 'lake', name: '배스', emoji: '🐟', rarity: 'rare', minSize: 25, maxSize: 60, basePrice: 110, difficulty: 2, desc: '먹이를 낚아채는 민물의 강자' },
  { id: 'eel', region: 'lake', name: '민물장어', emoji: '🐍', rarity: 'rare', minSize: 40, maxSize: 90, basePrice: 160, difficulty: 2, desc: '원기 회복에 으뜸인 미끌미끌한 장어' },
  { id: 'catfish', region: 'lake', name: '메기', emoji: '🐟', rarity: 'epic', minSize: 40, maxSize: 120, basePrice: 250, difficulty: 3, desc: '수염으로 먹이를 찾는 밤의 사냥꾼' },
  { id: 'snakehead', region: 'lake', name: '가물치', emoji: '🐊', rarity: 'epic', minSize: 50, maxSize: 130, basePrice: 380, difficulty: 3, desc: '호수의 최상위 포식자 물고기' },
  { id: 'golden_carp', region: 'lake', name: '황금 잉어', emoji: '✨', rarity: 'legendary', minSize: 50, maxSize: 100, basePrice: 1200, difficulty: 4, desc: '보면 행운이 온다는 전설의 잉어' },

  // 2. 맑은 강 (river) - 10마리
  { id: 'dace', region: 'river', name: '갈겨니', emoji: '🐟', rarity: 'common', minSize: 10, maxSize: 20, basePrice: 35, difficulty: 1, desc: '맑은 물을 좋아하는 은빛 물고기' },
  { id: 'kkeokji', region: 'river', name: '꺽지', emoji: '🐟', rarity: 'common', minSize: 10, maxSize: 25, basePrice: 45, difficulty: 2, desc: '바위 틈에 숨어 사는 토종 물고기' },
  { id: 'pale_chub', region: 'river', name: '피라미 강돌이', emoji: '🐟', rarity: 'common', minSize: 8, maxSize: 18, basePrice: 40, difficulty: 1, desc: '여울을 거슬러 오르는 날쌘돌이' },
  { id: 'shiner', region: 'river', name: '쉬리', emoji: '🐠', rarity: 'common', minSize: 7, maxSize: 16, basePrice: 50, difficulty: 2, desc: '1급수 맑은 계곡에만 서식하는 귀한 물고기' },
  { id: 'mandarin_fish', region: 'river', name: '쏘가리', emoji: '🐠', rarity: 'rare', minSize: 20, maxSize: 50, basePrice: 180, difficulty: 2, desc: '표범 무늬를 가진 강의 왕' },
  { id: 'trout', region: 'river', name: '무지개송어', emoji: '🐟', rarity: 'rare', minSize: 25, maxSize: 65, basePrice: 240, difficulty: 3, desc: '영롱한 무지갯빛 줄무늬를 가졌어요' },
  { id: 'char', region: 'river', name: '열목어', emoji: '🐟', rarity: 'rare', minSize: 20, maxSize: 55, basePrice: 300, difficulty: 3, desc: '눈에 열이 많아 찬물만 찾는 신비한 어종' },
  { id: 'salmon', region: 'river', name: '연어', emoji: '🐟', rarity: 'epic', minSize: 50, maxSize: 100, basePrice: 500, difficulty: 3, desc: '태어난 강으로 거슬러 돌아오는 의지의 물고기' },
  { id: 'sweetfish', region: 'river', name: '황금 은어', emoji: '✨', rarity: 'epic', minSize: 18, maxSize: 35, basePrice: 650, difficulty: 4, desc: '수박 향이 솔솔 나는 맑은 물의 귀족' },
  { id: 'sturgeon', region: 'river', name: '철갑상어', emoji: '🦈', rarity: 'legendary', minSize: 100, maxSize: 250, basePrice: 2500, difficulty: 5, desc: '공룡 시대부터 살아온 살아있는 화석' },

  // 3. 푸른 바다 (sea) - 10마리
  { id: 'mackerel', region: 'sea', name: '고등어', emoji: '🐟', rarity: 'common', minSize: 20, maxSize: 40, basePrice: 60, difficulty: 2, desc: '등이 푸른 바다의 국민 생선' },
  { id: 'horse_mackerel', region: 'sea', name: '전갱이', emoji: '🐟', rarity: 'common', minSize: 15, maxSize: 35, basePrice: 55, difficulty: 2, desc: '무리 지어 빠르게 헤엄쳐요' },
  { id: 'sardine', region: 'sea', name: '정어리', emoji: '🐟', rarity: 'common', minSize: 12, maxSize: 28, basePrice: 50, difficulty: 1, desc: '바다 생태계의 풍요로운 영양원' },
  { id: 'anchovy_king', region: 'sea', name: '대왕멸치', emoji: '🐟', rarity: 'common', minSize: 10, maxSize: 22, basePrice: 70, difficulty: 2, desc: '놀라울 정도로 큼직한 멸치 우두머리' },
  { id: 'sea_bream', region: 'sea', name: '참돔', emoji: '🐠', rarity: 'rare', minSize: 25, maxSize: 60, basePrice: 300, difficulty: 3, desc: '분홍빛이 아름다운 바다의 여왕' },
  { id: 'flounder', region: 'sea', name: '넙치', emoji: '🐡', rarity: 'rare', minSize: 30, maxSize: 70, basePrice: 350, difficulty: 3, desc: '모래 바닥에 완벽히 위장하고 누워있어요' },
  { id: 'rockfish', region: 'sea', name: '우럭', emoji: '🐟', rarity: 'rare', minSize: 20, maxSize: 50, basePrice: 400, difficulty: 3, desc: '암초 지대를 지키는 묵직한 바다 친구' },
  { id: 'tuna', region: 'sea', name: '참치', emoji: '🐟', rarity: 'epic', minSize: 100, maxSize: 250, basePrice: 1100, difficulty: 4, desc: '쉬지 않고 헤엄치는 바다의 탄환' },
  { id: 'yellowtail', region: 'sea', name: '대방어', emoji: '🐟', rarity: 'epic', minSize: 60, maxSize: 140, basePrice: 1300, difficulty: 4, desc: '겨울철 기름이 좔좔 흐르는 힘센 방어' },
  { id: 'marlin', region: 'sea', name: '돛새치', emoji: '🗡️', rarity: 'legendary', minSize: 150, maxSize: 350, basePrice: 4800, difficulty: 5, desc: '바다에서 가장 빠른 뾰족부리의 사냥꾼' },

  // 4. 심해 협곡 (abyss) - 10마리
  { id: 'monkfish', region: 'abyss', name: '아귀', emoji: '🐡', rarity: 'common', minSize: 30, maxSize: 80, basePrice: 180, difficulty: 3, desc: '입이 엄청 큰 바닥의 대식가 물고기' },
  { id: 'squid', region: 'abyss', name: '오징어', emoji: '🦑', rarity: 'common', minSize: 20, maxSize: 60, basePrice: 150, difficulty: 3, desc: '먹물을 뿜고 빠르게 도망쳐요' },
  { id: 'cutlass', region: 'abyss', name: '심해 갈치', emoji: '🗡️', rarity: 'common', minSize: 50, maxSize: 130, basePrice: 200, difficulty: 3, desc: '은빛 칼날처럼 서서 헤엄치는 물고기' },
  { id: 'blobfish', region: 'abyss', name: '블롭피쉬', emoji: '🫠', rarity: 'common', minSize: 15, maxSize: 35, basePrice: 220, difficulty: 2, desc: '깊은 수압을 견디는 젤리 같은 친구' },
  { id: 'giant_octopus', region: 'abyss', name: '대왕문어', emoji: '🐙', rarity: 'rare', minSize: 100, maxSize: 300, basePrice: 750, difficulty: 4, desc: '여덟 다리로 바위를 꽉 붙잡아요' },
  { id: 'vampire_squid', region: 'abyss', name: '흡혈오징어', emoji: '🦑', rarity: 'rare', minSize: 15, maxSize: 40, basePrice: 900, difficulty: 4, desc: '망토 같은 다리를 펼치며 발광해요' },
  { id: 'gulper_eel', region: 'abyss', name: '풍선장어', emoji: '🐍', rarity: 'rare', minSize: 60, maxSize: 180, basePrice: 1100, difficulty: 4, desc: '자기 몸보다 큰 먹이도 삼키는 거대한 입' },
  { id: 'anglerfish', region: 'abyss', name: '초롱아귀', emoji: '🏮', rarity: 'epic', minSize: 20, maxSize: 50, basePrice: 1800, difficulty: 4, desc: '머리 위 등불로 캄캄한 심해를 밝혀요' },
  { id: 'coelacanth', region: 'abyss', name: '실러캔스', emoji: '🐟', rarity: 'epic', minSize: 80, maxSize: 200, basePrice: 2600, difficulty: 5, desc: '수억 년 전 모습을 그대로 간직한 전설의 고대어' },
  { id: 'whale_shark', region: 'abyss', name: '심해 고래상어', emoji: '🐋', rarity: 'legendary', minSize: 400, maxSize: 1200, basePrice: 12000, difficulty: 5, desc: '심해 협곡의 심연을 지배하는 거대한 군주' },

  // 5. 극지 빙하 (glacier) - 10마리
  { id: 'icefish', region: 'glacier', name: '빙어', emoji: '🐟', rarity: 'common', minSize: 8, maxSize: 18, basePrice: 250, difficulty: 3, desc: '투명하고 차가운 얼음물에 사는 물고기' },
  { id: 'polar_cod', region: 'glacier', name: '북극대구', emoji: '🐟', rarity: 'common', minSize: 25, maxSize: 50, basePrice: 320, difficulty: 3, desc: '영하의 수온에서도 헤엄치는 대구' },
  { id: 'arctic_smelt', region: 'glacier', name: '설원 은어', emoji: '🐟', rarity: 'common', minSize: 10, maxSize: 22, basePrice: 290, difficulty: 3, desc: '눈 덮인 빙판 밑에서 반짝여요' },
  { id: 'glacier_crab', region: 'glacier', name: '스노우 킹크랩', emoji: '🦀', rarity: 'common', minSize: 30, maxSize: 70, basePrice: 380, difficulty: 3, desc: '단단한 얼음 껍질을 지닌 극한의 게' },
  { id: 'king_icefish', region: 'glacier', name: '빙어왕', emoji: '🐠', rarity: 'rare', minSize: 30, maxSize: 70, basePrice: 1200, difficulty: 4, desc: '빙하 동굴 깊은 곳의 푸른빛 제왕' },
  { id: 'greenland_shark', region: 'glacier', name: '그린란드 상어', emoji: '🦈', rarity: 'rare', minSize: 200, maxSize: 500, basePrice: 1600, difficulty: 4, desc: '수백 년을 천천히 유영하는 장수의 상징' },
  { id: 'narwhal', region: 'glacier', name: '일각고래', emoji: '🦄', rarity: 'rare', minSize: 250, maxSize: 500, basePrice: 2200, difficulty: 4, desc: '이마에 긴 나선형 뿔을 가진 바다의 유니콘' },
  { id: 'leopard_seal', region: 'glacier', name: '얼음표범물범', emoji: '🦭', rarity: 'epic', minSize: 120, maxSize: 280, basePrice: 3800, difficulty: 5, desc: '얼음 위를 미끄러지는 날렵한 사냥꾼' },
  { id: 'aurora_whale', region: 'glacier', name: '오로라 돌고래', emoji: '🐬', rarity: 'epic', minSize: 150, maxSize: 320, basePrice: 5000, difficulty: 5, desc: '극지의 오로라 빛을 몸에 머금고 헤엄쳐요' },
  { id: 'white_whale', region: 'glacier', name: '북극 백사자고래', emoji: '🐳', rarity: 'legendary', minSize: 350, maxSize: 900, basePrice: 25000, difficulty: 5, desc: '빙하 세계의 노래하는 하얀 거인' },

  // 6. 신비한 용궁 (palace) - 10마리
  { id: 'seahorse', region: 'palace', name: '용궁 해마', emoji: '🐡', rarity: 'common', minSize: 10, maxSize: 25, basePrice: 600, difficulty: 3, desc: '용궁의 문지기 역할을 하는 해마' },
  { id: 'pearl_clam', region: 'palace', name: '여의주 조개', emoji: '🦪', rarity: 'common', minSize: 20, maxSize: 45, basePrice: 750, difficulty: 4, desc: '영롱한 여의주 빛 진주를 품은 조개' },
  { id: 'coral_fish', region: 'palace', name: '산호 나비고기', emoji: '🐠', rarity: 'common', minSize: 12, maxSize: 28, basePrice: 700, difficulty: 3, desc: '용궁 정원의 아름다운 산호초를 가꿔요' },
  { id: 'lantern_crab', region: 'palace', name: '궁궐 보물게', emoji: '🦀', rarity: 'common', minSize: 20, maxSize: 40, basePrice: 850, difficulty: 3, desc: '반짝이는 금은보화를 등에 짊어진 게' },
  { id: 'palace_carp', region: 'palace', name: '비단잉어', emoji: '🐠', rarity: 'rare', minSize: 40, maxSize: 95, basePrice: 2800, difficulty: 4, desc: '오색 비단옷을 입은 듯 화려한 궁중 잉어' },
  { id: 'mantis_shrimp', region: 'palace', name: '용궁 수호새우', emoji: '🦐', rarity: 'rare', minSize: 15, maxSize: 35, basePrice: 3400, difficulty: 4, desc: '번개 같은 펀치로 바위도 부수는 호위무사' },
  { id: 'goldfish_princess', region: 'palace', name: '금붕어 공주', emoji: '👑', rarity: 'rare', minSize: 20, maxSize: 50, basePrice: 4200, difficulty: 4, desc: '우아한 비늘 지느러미를 흩날려요' },
  { id: 'palace_turtle', region: 'palace', name: '용궁 거북이', emoji: '🐢', rarity: 'epic', minSize: 80, maxSize: 200, basePrice: 8500, difficulty: 5, desc: '천 년의 지혜를 품고 용궁을 수호해요' },
  { id: 'king_crab_general', region: 'palace', name: '해룡 장군', emoji: '🐉', rarity: 'epic', minSize: 150, maxSize: 350, basePrice: 12000, difficulty: 5, desc: '용궁 군대를 지휘하는 위엄 넘치는 장군' },
  { id: 'blue_dragon', region: 'palace', name: '동해 청룡', emoji: '🐲', rarity: 'legendary', minSize: 500, maxSize: 1500, basePrice: 65000, difficulty: 5, desc: '여의주를 물고 승천하는 전설의 수룡' },

  // 7. 우주 성운 해구 (nebula) - 10마리
  { id: 'star_fish', region: 'nebula', name: '별조각 물고기', emoji: '⭐', rarity: 'common', minSize: 15, maxSize: 35, basePrice: 1400, difficulty: 4, desc: '부서진 소행성의 별빛을 먹고 자라요' },
  { id: 'plasma_jelly', region: 'nebula', name: '플라즈마 해파리', emoji: '🪼', rarity: 'common', minSize: 30, maxSize: 80, basePrice: 1700, difficulty: 4, desc: '전기 에너지를 뿜으며 성운을 유영해요' },
  { id: 'cosmic_shrimp', region: 'nebula', name: '성운 크릴', emoji: '🦐', rarity: 'common', minSize: 10, maxSize: 25, basePrice: 1500, difficulty: 3, desc: '은하수 구름 사이를 떼 지어 비행해요' },
  { id: 'starlight_squid', region: 'nebula', name: '성광 오징어', emoji: '🦑', rarity: 'common', minSize: 25, maxSize: 60, basePrice: 1900, difficulty: 4, desc: '빛의 광선으로 먹이를 감싸 포획해요' },
  { id: 'meteor_ray', region: 'nebula', name: '유성 가오리', emoji: '🛸', rarity: 'rare', minSize: 80, maxSize: 220, basePrice: 6500, difficulty: 5, desc: '혜성의 꼬리를 따라 비행하는 가오리' },
  { id: 'supernova_fish', region: 'nebula', name: '초신성 엔젤피쉬', emoji: '✨', rarity: 'rare', minSize: 35, maxSize: 85, basePrice: 8000, difficulty: 5, desc: '별이 폭발할 때 태어난 영롱한 빛의 물고기' },
  { id: 'blackhole_eel', region: 'nebula', name: '암흑 성운 곰치', emoji: '🌌', rarity: 'rare', minSize: 100, maxSize: 260, basePrice: 10000, difficulty: 5, desc: '빛조차 빨아들이는 중력을 뿜어내요' },
  { id: 'galaxy_whale', region: 'nebula', name: '은하 고래', emoji: '🐋', rarity: 'epic', minSize: 600, maxSize: 1800, basePrice: 24000, difficulty: 5, desc: '은하수를 품고 우주의 심연을 헤엄쳐요' },
  { id: 'pulsar_beast', region: 'nebula', name: '펄서 드래곤', emoji: '🐲', rarity: 'epic', minSize: 400, maxSize: 1100, basePrice: 35000, difficulty: 5, desc: '주기적으로 거대한 전자기파를 내뿜어요' },
  { id: 'cosmic_leviathan', region: 'nebula', name: '코스믹 리바이어던', emoji: '👾', rarity: 'legendary', minSize: 1000, maxSize: 3000, basePrice: 180000, difficulty: 5, desc: '시공간의 균열을 다스리는 우주 최강의 존재' },

  // 8. 용암 분화호 (volcano) - 10마리 (신화 등급 등장!)
  { id: 'magma_guppy', region: 'volcano', name: '마그마 송사리', emoji: '🔥', rarity: 'common', minSize: 10, maxSize: 25, basePrice: 3000, difficulty: 4, desc: '1000도 이상의 쇳물에서도 헤엄쳐요' },
  { id: 'ember_crab', region: 'volcano', name: '화염 바위게', emoji: '🦀', rarity: 'common', minSize: 20, maxSize: 50, basePrice: 3800, difficulty: 4, desc: '등껍질에 숯불을 피우고 다니는 단단한 게' },
  { id: 'lava_eel', region: 'volcano', name: '용암 장어', emoji: '🐍', rarity: 'common', minSize: 50, maxSize: 140, basePrice: 4500, difficulty: 4, desc: '펄펄 끓는 용암류를 거슬러 올라가요' },
  { id: 'ash_puffer', region: 'volcano', name: '화산재 복어', emoji: '🐡', rarity: 'common', minSize: 25, maxSize: 60, basePrice: 4200, difficulty: 4, desc: '놀라면 뜨거운 유황 가스를 뿜어 부풀어요' },
  { id: 'obsidian_carp', region: 'volcano', name: '흑요석 잉어', emoji: '🖤', rarity: 'rare', minSize: 40, maxSize: 100, basePrice: 15000, difficulty: 5, desc: '검게 굳은 흑요석처럼 매끄럽고 단단한 비늘' },
  { id: 'flame_tuna', region: 'volcano', name: '불꽃 다랑어', emoji: '🐟', rarity: 'rare', minSize: 80, maxSize: 200, basePrice: 19000, difficulty: 5, desc: '수면에 불길을 일으키며 쾌속 질주해요' },
  { id: 'inferno_octopus', region: 'volcano', name: '지옥불 문어', emoji: '🐙', rarity: 'rare', minSize: 100, maxSize: 300, basePrice: 24000, difficulty: 5, desc: '다리마다 화염 채찍을 휘두르는 문어' },
  { id: 'magma_shark', region: 'volcano', name: '마그마 메갈로돈', emoji: '🦈', rarity: 'epic', minSize: 300, maxSize: 800, basePrice: 60000, difficulty: 5, desc: '화산 분화구를 삼킬 듯한 거대한 불의 상어' },
  { id: 'salamander_king', region: 'volcano', name: '불도롱뇽 대공', emoji: '🦎', rarity: 'epic', minSize: 150, maxSize: 400, basePrice: 85000, difficulty: 5, desc: '불길 속에서만 부활하는 정령 군주' },
  { id: 'phoenix_leviathan', region: 'volcano', name: '불사조 레비아탄', emoji: '🔥', rarity: 'mythic', minSize: 800, maxSize: 2500, basePrice: 500000, difficulty: 5, desc: '🔥[신화] 타오르는 화염 속에서 영원히 불멸하는 대지의 화신' },

  // 9. 시간의 틈새 해저 (timewarp) - 10마리
  { id: 'clockwork_fish', region: 'timewarp', name: '태엽 물고기', emoji: '⚙️', rarity: 'common', minSize: 15, maxSize: 40, basePrice: 8000, difficulty: 4, desc: '째깍째깍 소리를 내며 시간을 되감아요' },
  { id: 'past_dunkle', region: 'timewarp', name: '고대 둔클레오', emoji: '🐟', rarity: 'common', minSize: 50, maxSize: 120, basePrice: 10000, difficulty: 5, desc: '선사 시대 갑주 어류가 시간의 틈새로 넘어왔어요' },
  { id: 'future_drone_fish', region: 'timewarp', name: '사이버 드론어', emoji: '🤖', rarity: 'common', minSize: 20, maxSize: 50, basePrice: 9500, difficulty: 4, desc: '먼 미래에서 시간 여행을 온 기계 생명체' },
  { id: 'chrono_squid', region: 'timewarp', name: '타임 오징어', emoji: '🦑', rarity: 'common', minSize: 30, maxSize: 70, basePrice: 11000, difficulty: 4, desc: '먹물 대신 과거의 잔상을 뿜어내요' },
  { id: 'hourglass_ray', region: 'timewarp', name: '모래시계 가오리', emoji: '⏳', rarity: 'rare', minSize: 70, maxSize: 180, basePrice: 38000, difficulty: 5, desc: '날갯짓 한 번에 1초씩 시간이 정지해요' },
  { id: 'paradox_jelly', region: 'timewarp', name: '패러독스 해파리', emoji: '🪼', rarity: 'rare', minSize: 40, maxSize: 100, basePrice: 48000, difficulty: 5, desc: '원인과 결과가 뒤섞인 다차원 해파리' },
  { id: 'dimension_eel', region: 'timewarp', name: '차원 도약 장어', emoji: '🐍', rarity: 'rare', minSize: 80, maxSize: 220, basePrice: 60000, difficulty: 5, desc: '공간을 순간이동하며 낚시 바늘을 따돌려요' },
  { id: 'ancient_mosasaur', region: 'timewarp', name: '시공의 모사사우루스', emoji: '🐊', rarity: 'epic', minSize: 500, maxSize: 1500, basePrice: 160000, difficulty: 5, desc: '백악기 바다를 호령하던 절대 포식자의 귀환' },
  { id: 'future_mecha_whale', region: 'timewarp', name: '메카 타이탄 고래', emoji: '🚀', rarity: 'epic', minSize: 800, maxSize: 2400, basePrice: 240000, difficulty: 5, desc: '미래 문명의 양자 엔진을 탑재한 강철 고래' },
  { id: 'chronos_dragon', region: 'timewarp', name: '시간의 지배자 크로노스', emoji: '⌛', rarity: 'mythic', minSize: 1200, maxSize: 3500, basePrice: 1500000, difficulty: 5, desc: '⌛[신화] 모든 흐르는 시간을 멈추고 되돌릴 수 있는 차원의 신' },

  // 10. 천상 유원지 (sky_ocean) - 10마리 (최종 종결 지역)
  { id: 'cloud_guppy', region: 'sky_ocean', name: '뭉게구름 송사리', emoji: '☁️', rarity: 'common', minSize: 15, maxSize: 35, basePrice: 20000, difficulty: 4, desc: '폭신폭신한 솜사탕 구름 속을 날아다녀요' },
  { id: 'rainbow_tetra', region: 'sky_ocean', name: '무지개빛 테트라', emoji: '🌈', rarity: 'common', minSize: 20, maxSize: 45, basePrice: 26000, difficulty: 4, desc: '하늘에 뜬 무지개를 조각조각 먹고 자라요' },
  { id: 'feather_fish', region: 'sky_ocean', name: '천사의 날개치', emoji: '🪽', rarity: 'common', minSize: 30, maxSize: 70, basePrice: 32000, difficulty: 5, desc: '새하얀 날개 지느러미로 바람을 타요' },
  { id: 'sunlight_ray', region: 'sky_ocean', name: '햇살 가오리', emoji: '☀️', rarity: 'common', minSize: 60, maxSize: 150, basePrice: 38000, difficulty: 5, desc: '따스한 태양빛을 모아 하늘 바다를 비춰요' },
  { id: 'valkyrie_salmon', region: 'sky_ocean', name: '발키리 연어', emoji: '⚔️', rarity: 'rare', minSize: 70, maxSize: 180, basePrice: 110000, difficulty: 5, desc: '빛의 폭포수를 거슬러 천상으로 올라온 연어' },
  { id: 'pegasus_seahorse', region: 'sky_ocean', name: '페가수스 해마', emoji: '🦄', rarity: 'rare', minSize: 40, maxSize: 110, basePrice: 140000, difficulty: 5, desc: '천상의 날개를 달고 은하수를 질주해요' },
  { id: 'seraphim_jelly', region: 'sky_ocean', name: '세라핌 치천사 해파리', emoji: '🪼', rarity: 'rare', minSize: 60, maxSize: 160, basePrice: 180000, difficulty: 5, desc: '여섯 개의 빛의 날개를 펼쳐 축복을 내려요' },
  { id: 'eden_serpent', region: 'sky_ocean', name: '낙원의 비단구렁이', emoji: '🐍', rarity: 'epic', minSize: 400, maxSize: 1200, basePrice: 450000, difficulty: 5, desc: '천상 정원의 생명나무 아래를 지키는 영물' },
  { id: 'heavenly_phoenix', region: 'sky_ocean', name: '천상 봉황어', emoji: '🦚', rarity: 'epic', minSize: 300, maxSize: 900, basePrice: 650000, difficulty: 5, desc: '오색 깃털을 휘날리며 은빛 비를 내려줘요' },
  { id: 'celestial_yggdrasil', region: 'sky_ocean', name: '신화의 창조주 오메가', emoji: '🌌', rarity: 'mythic', minSize: 2000, maxSize: 5000, basePrice: 5000000, difficulty: 5, desc: '🌌[초월 신화] 우주와 천상 모든 낚시터의 시작과 끝을 관장하는 신' },
];

export const FISHING_CONFIG = {
  POWER_CYCLE_SEC: 1.6,
  WAIT_TIME: {
    weak:    { maxPower: 39,  min: 4.0, max: 8.0 },
    normal:  { maxPower: 89,  min: 3.0, max: 6.0 },
    perfect: { maxPower: 100, min: 1.5, max: 3.0 },
  },
  BITE_WINDOW_SEC: 1.0,
  ZONE_BASE_HEIGHT: 25,
  ZONE_UP_ACCEL: 200,
  ZONE_GRAVITY: 160,
  ZONE_MAX_SPEED: 90,
  PROGRESS_START: 30,
  PROGRESS_GAIN: 22,
  REEL_TIME_LIMIT_SEC: 25,
  MAX_DT: 0.1,
  DIFFICULTY: {
    1: { targetIntervalSec: 1.6, fishSpeed: 25, progressLoss: 12 },
    2: { targetIntervalSec: 1.3, fishSpeed: 35, progressLoss: 14 },
    3: { targetIntervalSec: 1.0, fishSpeed: 45, progressLoss: 16 },
    4: { targetIntervalSec: 0.8, fishSpeed: 60, progressLoss: 18 },
    5: { targetIntervalSec: 0.6, fishSpeed: 75, progressLoss: 20 },
  },
};

export const MESSAGES = {
  E01: '가방이 가득 찼어요. 가방에서 물고기를 팔아 자리를 만들어 주세요.',
  E02: '골드가 부족해요. (필요 {price}G / 보유 {gold}G)',
  E03: '{baitName}가 다 떨어져서 기본 미끼로 바꿨어요.',
  E04: '도감을 {required}종 이상 채워야 {regionName}에 갈 수 있어요. (현재 {count}종)',
  E05: '너무 일찍 당겼어요! 물고기가 놀라서 도망갔어요.',
  E06: '아쉬워요, 입질을 놓쳤어요.',
  E07: '물고기가 도망갔어요…',
  E08: '줄이 끊어졌어요! 너무 오래 버텼어요.',
  E09: '이 브라우저에서는 저장이 안 돼요. 창을 닫으면 기록이 사라져요.',
  E10: '저장된 기록을 읽을 수 없어서 새로 시작해요.',
  E11: '저장하지 못했어요. 잠시 후 다시 시도할게요.',
  PERFECT_CAST: '✨ 퍼펙트 캐스팅!',
  SELL_ONE: '🪙 {fishName}을(를) {price}G에 팔았어요',
  SELL_ALL: '🪙 {count}마리를 {total}G에 팔았어요',
  BUY_ITEM: '✅ {itemName} 구매 완료!',
  BUY_ROD: '✅ {rodName} 구매 완료! 바로 장착했어요.',
  EQUIP_ROD: '🎣 {rodName}을(를) 장착했어요.',
  BAG_EXPAND: '✅ 가방이 {capacity}마리로 커졌어요!',
  BAIT_MAX_LIMIT: '미끼는 최대 999개까지 가질 수 있어요.',
  REGION_UNLOCK: '🔓 {regionName}이(가) 열렸어요!',
  REGION_MOVE: '🗺️ {regionName}(으)로 이동했어요',
  COLLECTION_COMPLETE: '🎉 {regionName} 도감 완성! 보상 {reward}G를 받았어요',
  FISH_UNKNOWN: '아직 발견하지 못한 물고기예요.',
  RESET_GAME: '🔄 처음부터 다시 시작해요',
};

// 해양 쓰레기 및 정화 센터 보상 정의
export const TRASH_ITEMS = [
  { id: 'old_boot', name: '오래된 장화', emoji: '🥾', point: 10, desc: '누군가 버린 낡은 고무장화' },
  { id: 'rusty_can', name: '찌그러진 깡통', emoji: '🥫', point: 8, desc: '바다에 떠돌던 통조림 캔' },
  { id: 'torn_net', name: '찢어진 폐그물', emoji: '🕸️', point: 15, desc: '산호초를 위협하던 플라스틱 그물' },
  { id: 'plastic_bottle', name: '페트병', emoji: '🍾', point: 12, desc: '바다거북이를 괴롭히던 플라스틱 병' },
];

export const ECO_SHOP = {
  eco_rod: { id: 'eco_rod', name: '자연의 수호자 에코 낚싯대', emoji: '🌿', reqPoint: 50, desc: '해양 쓰레기 50개를 정화하여 얻은 청정 대나무 낚싯대. 조준각 +10° 보너스!' },
  eco_bait: { id: 'eco_bait', name: '생분해 친환경 미끼 (20개)', emoji: '🌱', reqPoint: 20, desc: '바다를 오염시키지 않는 천연 효모 미끼' },
};

// 행운의 황금 복권 티어 및 당첨 테이블
export const LOTTERY_TIERS = [
  { rank: 1, name: '🥇 1등 대박 잭팟', gold: 1000000, baitType: 'rainbow', baitCount: 50, baitName: '무지개 미끼', weight: 1, color: '#f59e0b' },
  { rank: 2, name: '🥈 2등 황금 당첨', gold: 100000, baitType: 'golden', baitCount: 30, baitName: '황금 미끼', weight: 9, color: '#eab308' },
  { rank: 3, name: '🥉 3등 행운 당첨', gold: 30000, baitType: 'shiny', baitCount: 20, baitName: '반짝이 미끼', weight: 30, color: '#38bdf8' },
  { rank: 4, name: '🎖️ 4등 실속 당첨', gold: 10000, baitType: 'worm', baitCount: 10, baitName: '지렁이 미끼', weight: 60, color: '#10b981' },
];


// 미끼 확률 합 검증 및 물고기 100종 전수 검사
function validateData() {
  if (FISH.length !== 100) {
    console.error(`[데이터 오류] FISH 개수는 100개여야 하지만 현재 ${FISH.length}개입니다.`);
  }

  for (const [id, bait] of Object.entries(BAITS)) {
    const sum = Object.values(bait.weights).reduce((acc, cur) => acc + cur, 0);
    if (sum !== 100) {
      console.error(`[데이터 오류] 미끼(${id})의 확률 합이 100이 아닙니다: ${sum}`);
    }
  }
}

validateData();
