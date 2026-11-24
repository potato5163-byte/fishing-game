import { state, playSlotMachine } from './state.js';
import { formatGold } from './utils.js';
import { showToast } from './ui.js';

export function showSlotMachineModal() {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="modal-slot-scrim">
      <div class="modal-dialog" style="max-width: 400px;">
        <div class="modal-top-block block-pink" style="padding: var(--space-md); text-align: center; background: linear-gradient(135deg, #ec4899, #be185d); color: #fff;">
          <div style="font-size: 42px; line-height: 1; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));">🎰</div>
          <div class="t-eyebrow" style="color: #fce7f3; margin-top: 4px;">FISHING CASINO</div>
          <div class="t-headline" style="color: #fff; font-size: 22px;">황금 슬롯머신 (10,000G)</div>
        </div>

        <div class="modal-content" style="padding: var(--space-lg); text-align: center;">
          <div class="t-body-sm" style="color: var(--color-subtext); margin-bottom: 12px;">
            1회 플레이 비용: <strong style="color: #d97706;">10,000G</strong> · 보유: <span class="tabular-nums" id="slot-player-gold">${formatGold(state.gold)}G</span>
          </div>

          <!-- 슬롯 3릴 디스플레이 -->
          <div class="slot-machine-case">
            <div class="slot-reel" id="reel-1">🐟</div>
            <div class="slot-reel" id="reel-2">🌟</div>
            <div class="slot-reel" id="reel-3">7️⃣</div>
          </div>

          <div id="slot-result-msg" class="t-card-title" style="min-height: 24px; margin: 12px 0 6px 0; color: #0284c7;">
            레버를 당겨 잭팟을 노려보세요!
          </div>

          <!-- 배당표 요약 -->
          <div style="background: #f8fafc; border: 1px solid var(--color-hairline); border-radius: var(--radius-sm); padding: 8px; font-size: 11px; text-align: left; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span>🔥 7️⃣-7️⃣-7️⃣ (초대박 잭팟)</span>
              <strong style="color: #ef4444;">300,000G (30배)</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span>👑 👑-👑-👑 (황금 왕관)</span>
              <strong style="color: #f59e0b;">150,000G (15배)</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span>🌟 🌟-🌟-🌟 (별 트리플)</span>
              <strong style="color: #0284c7;">70,000G + 황금미끼 10</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>✨ 2개 심볼 일치 (투페어)</span>
              <strong style="color: #10b981;">12,000G (원금+20%)</strong>
            </div>
          </div>

          <div style="display: flex; gap: 8px;">
            <button id="btn-spin-slot" class="btn-primary" style="flex: 2; height: 44px; font-size: 15px; font-weight: 800; background: linear-gradient(135deg, #f59e0b, #ef4444); border: none;">
              🎰 슬롯 당기기 (1만G)
            </button>
            <button id="btn-close-slot" class="btn-secondary" style="flex: 1; height: 44px;">
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  const btnSpin = document.getElementById('btn-spin-slot');
  const btnClose = document.getElementById('btn-close-slot');
  const reel1 = document.getElementById('reel-1');
  const reel2 = document.getElementById('reel-2');
  const reel3 = document.getElementById('reel-3');
  const resultMsg = document.getElementById('slot-result-msg');
  const playerGold = document.getElementById('slot-player-gold');
  let isSpinning = false;

  if (btnSpin) {
    btnSpin.addEventListener('click', () => {
      if (isSpinning) return;
      if (state.gold < 10000) {
        showToast('골드가 부족합니다! (필요: 10,000G)');
        return;
      }

      isSpinning = true;
      btnSpin.disabled = true;
      btnSpin.textContent = '회전 중...';
      resultMsg.textContent = '두근두근... 릴이 회전합니다!';

      // 릴 회전 애니메이션 연출
      reel1.classList.add('is-spinning');
      reel2.classList.add('is-spinning');
      reel3.classList.add('is-spinning');

      const symbols = ['🐟', '🌟', '👑', '7️⃣', '💣'];
      let spinTimer = setInterval(() => {
        reel1.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        reel2.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        reel3.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      }, 70);

      setTimeout(() => {
        clearInterval(spinTimer);
        const res = playSlotMachine();

        reel1.classList.remove('is-spinning');
        reel2.classList.remove('is-spinning');
        reel3.classList.remove('is-spinning');

        if (res.ok) {
          reel1.textContent = res.reels[0];
          reel2.textContent = res.reels[1];
          reel3.textContent = res.reels[2];

          resultMsg.textContent = res.prizeName;
          resultMsg.style.color = res.rewardGold > 0 ? '#10b981' : '#64748b';

          if (res.rewardGold > 0) {
            showToast(`🎉 당첨! +${formatGold(res.rewardGold)}G를 획득했습니다!`);
          } else {
            showToast('아쉽게도 꽝입니다!');
          }
        }

        if (playerGold) {
          playerGold.textContent = `${formatGold(state.gold)}G`;
        }

        isSpinning = false;
        btnSpin.disabled = false;
        btnSpin.textContent = '🎰 슬롯 당기기 (1만G)';
      }, 1000);
    });
  }

  if (btnClose) {
    btnClose.addEventListener('click', () => {
      modalRoot.innerHTML = '';
    });
  }
}
