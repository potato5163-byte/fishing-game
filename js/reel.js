import { FISHING_CONFIG, RODS } from './data.js';
import { clamp } from './utils.js';
import { playSound } from './sound.js';
import { state, getRodEnhanceLevel } from './state.js';

let isReeling = false;
let currentFish = null;
let onFinishCallback = null;

// 플레이어 조준선 위치 (X: 0 ~ 100%)
let aimX = 50;
let aimTargetX = 50;
let aimMoveDir = 0; // -1: 좌, 0: 정지, 1: 우

// 물고기 위치 (X: 0 ~ 100%, Y: 깊이/점프 높이)
let fishX = 50;
let fishTargetX = 50;
let fishTurnTimer = 0;
let fishSpeed = 35; // 난이도에 따른 속도

// 물고기 점프(JUMP) 시스템 변수
let isFishJumping = false;
let jumpTimer = 0;
let jumpWindowTime = 1.3; // 스매시 칠 수 있는 시간 윈도우
let nextJumpCooldown = 4.0; // 다음 점프까지 쿨다운
let isStunned = false;
let stunTimer = 0;

// 파이팅 진행도 및 제한시간
let progress = 30; // 0 ~ 100 (100 도달 시 포획 성공)
let timeLeft = 25;
let lastFrameTime = 0;
let animFrameId = null;

let currentRodData = null;
let enhanceBonus = 0;

// QTE 특수 커맨드 상태 변수
let qteActive = false;
let qteSequence = [];
let qteIndex = 0;
let qteTimer = 0;
let qteMaxTime = 2.5;
let qteTriggeredCount = 0;

const QTE_POSSIBLE_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];
const QTE_KEY_LABELS = {
  ArrowUp: '⬆️',
  ArrowDown: '⬇️',
  ArrowLeft: '⬅️',
  ArrowRight: '➡️',
  Space: 'SPACE',
};

export function isQTEActive() {
  return qteActive;
}

export function handleQTEInput(key) {
  if (!qteActive) return false;

  const expectedKey = qteSequence[qteIndex];
  if (key === expectedKey) {
    playSound('qte_hit');
    qteIndex++;
    updateQTEDOM();

    if (qteIndex >= qteSequence.length) {
      resolveQTE(true);
    }
    return true;
  } else {
    qteTimer = Math.max(0, qteTimer - 0.4);
    playSound('qte_fail');
    return true;
  }
}

function triggerQTE() {
  qteActive = true;
  qteTriggeredCount++;

  let count = 3;
  let timeLimit = 2.8;
  if (currentFish.rarity === 'mythic') {
    count = 6;
    timeLimit = 1.8;
  } else if (currentFish.rarity === 'legendary') {
    count = 5;
    timeLimit = 2.2;
  }

  qteSequence = [];
  for (let i = 0; i < count; i++) {
    const randomKey = QTE_POSSIBLE_KEYS[Math.floor(Math.random() * QTE_POSSIBLE_KEYS.length)];
    qteSequence.push(randomKey);
  }

  qteIndex = 0;
  qteMaxTime = timeLimit;
  qteTimer = qteMaxTime;

  playSound('qte_prompt');

  const container = document.getElementById('reel-qte-container');
  if (container) {
    container.hidden = false;
  }
  updateQTEDOM();
}

function updateQTEDOM() {
  const promptEl = document.getElementById('reel-qte-prompt');
  const timerFill = document.getElementById('reel-qte-timer-fill');

  if (promptEl) {
    promptEl.innerHTML = qteSequence
      .map((k, idx) => {
        let cls = 'qte-key-badge';
        if (idx < qteIndex) cls += ' cleared';
        else if (idx === qteIndex) cls += ' current';
        return `<span class="${cls}">${QTE_KEY_LABELS[k] || k}</span>`;
      })
      .join('');
  }

  if (timerFill) {
    const pct = Math.max(0, Math.min(100, (qteTimer / qteMaxTime) * 100));
    timerFill.style.width = `${pct}%`;
  }
}

function resolveQTE(success) {
  qteActive = false;
  const container = document.getElementById('reel-qte-container');
  if (container) {
    container.hidden = true;
  }

  const oceanView = document.getElementById('reel-ocean-view');

  if (success) {
    playSound('qte_success');
    progress = clamp(progress + 22, 0, 100);
    isStunned = true;
    stunTimer = 3.0; // 3초 완전 무력화

    if (oceanView) {
      oceanView.classList.add('smash-flash');
      setTimeout(() => oceanView.classList.remove('smash-flash'), 350);
    }
  } else {
    playSound('qte_fail');
    progress = clamp(progress - 15, 0, 100);

    const app = document.getElementById('app');
    if (app) {
      app.classList.remove('screen-shake');
      void app.offsetWidth;
      app.classList.add('screen-shake');
    }
  }
}

// 플레이어 조준 이동 제어 (-1: 좌, 0: 정지, 1: 우)
export function setAimDirection(dir) {
  aimMoveDir = dir;
}

// 플레이어 Space 스매시 시도 (점프 중일 때 타격!)
export function trySmashAction() {
  if (!isReeling) return false;

  // 물고기가 점프 중일 때 스페이스바로 강타!
  if (isFishJumping) {
    isFishJumping = false;
    jumpTimer = 0;

    playSound('smash_hit');

    // 스턴 적용 (낚싯대 제압력 + 강화 레벨에 비례)
    const baseStun = currentRodData ? (currentRodData.stunDuration || 1.2) : 1.2;
    stunTimer = baseStun + (enhanceBonus * 0.25);
    isStunned = true;

    // 진행도 급상승 (+15% ~ +25%)
    const smashPower = 15 + (enhanceBonus * 1.5);
    progress = clamp(progress + smashPower, 0, 100);

    // 강타 플래시 & 화면 진동
    const oceanView = document.getElementById('reel-ocean-view');
    if (oceanView) {
      oceanView.classList.add('smash-flash');
      setTimeout(() => oceanView.classList.remove('smash-flash'), 350);
    }

    const jumpAlert = document.getElementById('fish-jump-alert');
    if (jumpAlert) jumpAlert.hidden = true;

    return true;
  }
  return false;
}

export function startReelGame(fish, equippedRodId, onFinish) {
  currentFish = fish;
  onFinishCallback = onFinish;
  isReeling = true;

  currentRodData = RODS[equippedRodId] || RODS.bamboo;
  enhanceBonus = getRodEnhanceLevel(equippedRodId);

  aimX = 50;
  aimTargetX = 50;
  aimMoveDir = 0;

  fishX = 50;
  fishTargetX = 50;
  fishTurnTimer = 1.0;

  // 물고기 속도 설정 (난이도에 따라 차등)
  const diff = fish.difficulty || 1;
  fishSpeed = 25 + diff * 10;

  isFishJumping = false;
  jumpTimer = 0;
  jumpWindowTime = Math.max(1.0, 1.6 - (diff * 0.1) + (enhanceBonus * 0.05));
  nextJumpCooldown = 2.5 + Math.random() * 2.5;

  isStunned = false;
  stunTimer = 0;

  progress = FISHING_CONFIG.PROGRESS_START;
  let timeLimit = FISHING_CONFIG.REEL_TIME_LIMIT_SEC;
  if (state.specialItems && state.specialItems.hourglass_time > 0) {
    timeLimit += 15;
  }
  timeLeft = timeLimit;

  qteActive = false;
  qteSequence = [];
  qteIndex = 0;
  qteTimer = 0;
  qteTriggeredCount = 0;

  const panel = document.getElementById('reel-panel');
  if (panel) {
    panel.hidden = false;
  }

  const nameEl = document.getElementById('reel-target-name');
  if (nameEl) {
    nameEl.textContent = `${fish.emoji} ${fish.name} (${fish.rarity.toUpperCase()})`;
  }

  const qteContainer = document.getElementById('reel-qte-container');
  if (qteContainer) qteContainer.hidden = true;

  const jumpAlert = document.getElementById('fish-jump-alert');
  if (jumpAlert) jumpAlert.hidden = true;

  updateReelDOM();
  lastFrameTime = performance.now();
  animFrameId = requestAnimationFrame(gameLoop);
}

export function setReelHolding(holding) {
  // 스페이스바가 눌렸을 때 점프 중이면 스매시 타격, 아니면 기본 당김
  if (holding) {
    trySmashAction();
  }
}

export function isReelingActive() {
  return isReeling;
}

function gameLoop(currentTime) {
  if (!isReeling) return;

  if (document.hidden) {
    lastFrameTime = currentTime;
    animFrameId = requestAnimationFrame(gameLoop);
    return;
  }

  let dt = (currentTime - lastFrameTime) / 1000;
  lastFrameTime = currentTime;
  if (dt > FISHING_CONFIG.MAX_DT) dt = FISHING_CONFIG.MAX_DT;

  updatePhysics(dt);
  updateReelDOM();

  // 승리 / 패배 검사
  if (progress >= 100) {
    finishGame('success');
    return;
  }
  if (progress <= 0) {
    finishGame('fail_escaped');
    return;
  }
  if (timeLeft <= 0) {
    finishGame('fail_timeout');
    return;
  }

  animFrameId = requestAnimationFrame(gameLoop);
}

function updatePhysics(dt) {
  // 1. 제한시간 감소
  if (!qteActive) {
    timeLeft -= dt;
    if (timeLeft < 0) timeLeft = 0;
  }

  // 2. QTE 처리
  if (qteActive) {
    qteTimer -= dt;
    updateQTEDOM();
    if (qteTimer <= 0) {
      resolveQTE(false);
    }
    return;
  }

  // 3. QTE 발동 체크 (영웅/전설/신화)
  const isHighRarity = ['epic', 'legendary', 'mythic'].includes(currentFish.rarity);
  const maxQteCount = currentFish.rarity === 'epic' ? 1 : 2;
  if (isHighRarity && qteTriggeredCount < maxQteCount) {
    let shouldTrigger = false;
    if (qteTriggeredCount === 0 && progress >= 40 && progress <= 65) shouldTrigger = true;
    else if (qteTriggeredCount === 1 && progress >= 70 && progress <= 88) shouldTrigger = true;

    if (shouldTrigger) {
      triggerQTE();
      return;
    }
  }

  // 4. 조준선(Aim) 이동 (좌우 입력)
  // 낚싯대 강화에 따라 회전 조준 속도 상승
  const aimSpeed = 80 + (enhanceBonus * 5);
  aimX += aimMoveDir * aimSpeed * dt;
  aimX = clamp(aimX, 10, 90);

  // 5. 스턴 처리
  if (isStunned) {
    stunTimer -= dt;
    if (stunTimer <= 0) {
      isStunned = false;
    }
  }

  // 6. 물고기 점프(JUMP) 주기 처리
  if (!isStunned) {
    if (!isFishJumping) {
      nextJumpCooldown -= dt;
      if (nextJumpCooldown <= 0) {
        // 물고기 점프 발동!
        isFishJumping = true;
        jumpTimer = jumpWindowTime;
        playSound('fish_jump');
      }
    } else {
      jumpTimer -= dt;
      if (jumpTimer <= 0) {
        // 점프 기회 놓침 (바늘털이 발생: 진행도 -12%)
        isFishJumping = false;
        nextJumpCooldown = 3.5 + Math.random() * 3.0;
        progress = clamp(progress - 12, 0, 100);
        playSound('qte_fail');
      }
    }
  }

  // 7. 물고기 좌우 이동 물리 (스턴 중이면 멈춤)
  if (!isStunned) {
    fishTurnTimer -= dt;
    if (fishTurnTimer <= 0) {
      fishTargetX = 15 + Math.random() * 70;
      fishTurnTimer = 1.0 + Math.random() * 1.5;
    }

    const dist = fishTargetX - fishX;
    const step = fishSpeed * dt;
    if (Math.abs(dist) <= step) {
      fishX = fishTargetX;
    } else {
      fishX += Math.sign(dist) * step;
    }
    fishX = clamp(fishX, 15, 85);
  }

  // 8. 록온 판정 및 진행도 증감
  // 낚싯대 조준 반경 너비 (기본 26 ~ 최대 75)
  const rodWidth = (currentRodData ? currentRodData.trackingWidth : 26) + (enhanceBonus * 2.5);
  const halfWidth = rodWidth / 2;
  const isLockedOn = Math.abs(fishX - aimX) <= halfWidth;

  const reelMult = (currentRodData ? currentRodData.reelMultiplier : 1.0) * (1 + enhanceBonus * 0.05);

  if (isLockedOn) {
    // 록온 상태: 물고기를 당겨옴!
    // 스턴 중이면 1.8배 초고속 감기!
    const stunBonus = isStunned ? 1.8 : 1.0;
    progress += FISHING_CONFIG.PROGRESS_GAIN * reelMult * stunBonus * dt;
  } else {
    // 조준을 벗어나면 물고기가 도망치며 진행도 감소
    const lossSpeed = isStunned ? 3.0 : 12.0;
    progress -= lossSpeed * dt;
  }
  progress = clamp(progress, 0, 100);
}

function updateReelDOM() {
  const crosshair = document.getElementById('reel-crosshair');
  const fish3D = document.getElementById('reel-fish-3d');
  const fishEmoji = document.getElementById('fish-avatar-emoji');
  const linePath = document.getElementById('reel-line-path');
  const jumpAlert = document.getElementById('fish-jump-alert');
  const progressFill = document.getElementById('reel-hud-progress-fill');
  const distText = document.getElementById('reel-target-dist');
  const timeText = document.getElementById('reel-hud-time');
  const firstPersonRod = document.getElementById('first-person-rod');

  // 1. 조준선 위치
  if (crosshair) {
    crosshair.style.left = `${aimX}%`;

    const rodWidth = (currentRodData ? currentRodData.trackingWidth : 26) + (enhanceBonus * 2.5);
    const isLockedOn = Math.abs(fishX - aimX) <= (rodWidth / 2);
    if (isLockedOn) {
      crosshair.classList.add('is-locked');
    } else {
      crosshair.classList.remove('is-locked');
    }
  }

  // 2. 3D 물고기 위치 & 점프 상태
  if (fish3D) {
    fish3D.style.left = `${fishX}%`;

    if (isFishJumping) {
      fish3D.classList.add('is-jumping');
    } else {
      fish3D.classList.remove('is-jumping');
    }
  }

  if (fishEmoji) {
    if (isStunned) {
      fishEmoji.textContent = '💫';
    } else {
      fishEmoji.textContent = currentFish ? currentFish.emoji : '🐟';
    }
    // 물고기 진행 방향에 따라 좌우 반전
    fishEmoji.style.transform = fishTargetX > fishX ? 'scaleX(1)' : 'scaleX(-1)';
  }

  if (jumpAlert) {
    jumpAlert.hidden = !isFishJumping;
  }

  // 3. 낚싯줄 SVG 실시간 연결선 (낚싯대 끝 -> 물고기)
  if (linePath) {
    const rodEndX = (aimX * 3.6); // 대략적인 좌표 매핑
    const fishCoordX = (fishX * 3.6);
    const fishCoordY = isFishJumping ? 80 : 160;
    linePath.setAttribute('d', `M 280 320 Q ${(rodEndX + fishCoordX) / 2} 240 ${fishCoordX} ${fishCoordY}`);
    linePath.setAttribute('stroke', isFishJumping ? '#ef4444' : 'rgba(255,255,255,0.7)');
    linePath.setAttribute('stroke-width', isFishJumping ? '3' : '2');
  }

  // 4. 1인칭 낚싯대 기울기 피드백
  if (firstPersonRod) {
    const rodAngle = -15 + (aimX - 50) * 0.4;
    firstPersonRod.style.transform = `rotate(${rodAngle}deg)`;
  }

  // 5. 진행도 및 HUD 정보
  if (progressFill) {
    progressFill.style.width = `${progress}%`;
  }
  if (distText) {
    const remainingMeters = Math.max(0, Math.round((100 - progress) * 0.8));
    distText.textContent = `거리 ${remainingMeters}m`;
  }
  if (timeText) {
    timeText.textContent = `${Math.ceil(timeLeft)}s`;
  }
}

function finishGame(result) {
  isReeling = false;
  qteActive = false;
  isFishJumping = false;
  isStunned = false;

  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }

  const panel = document.getElementById('reel-panel');
  if (panel) {
    panel.hidden = true;
  }

  if (onFinishCallback) {
    onFinishCallback(result, currentFish);
  }
}
