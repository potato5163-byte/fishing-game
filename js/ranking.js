import { state, setFisherName, exportRankingCardCode, importRankingCardCode, getRankingBoard } from './state.js';
import { formatGold } from './utils.js';
import { showToast } from './ui.js';
import { RODS } from './data.js';

let currentSort = 'score'; // 'score', 'collection', 'size', 'gold'

export function showRankingModal() {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const rankingList = getRankingBoard(currentSort);
  const myRankIdx = rankingList.findIndex((item) => item.isMe);
  const myRank = myRankIdx !== -1 ? myRankIdx + 1 : '-';

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="modal-ranking-scrim">
      <div class="modal-dialog" style="max-width: 440px;">
        <div class="modal-top-block block-navy" style="padding: var(--space-md); text-align: center; background: linear-gradient(135deg, #1e1b4b, #312e81);">
          <div style="font-size: 40px; line-height: 1; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));">🏆</div>
          <div class="t-eyebrow" style="color: #a5b4fc; margin-top: 4px;">FISHER LEADERBOARD</div>
          <div class="t-headline" style="color: #fff; font-size: 22px;">전국 어부 명예의 전당</div>
        </div>

        <div class="modal-content" style="padding: var(--space-md);">
          <!-- 닉네임 설정 및 내 랭킹 코드 공유 바 -->
          <div style="background: #f8fafc; border: 1px solid var(--color-hairline); border-radius: var(--radius-sm); padding: var(--space-xs) var(--space-sm); margin-bottom: var(--space-xs); display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="t-body-sm" style="font-weight: 700;">내 칭호:</span>
              <span id="label-fisher-name" class="t-body-sm" style="color: #0284c7; font-weight: 800; cursor: pointer;" title="클릭하여 닉네임 수정">
                ${state.fisherName || '도시 어부'} ✏️
              </span>
            </div>
            <span class="badge-rarity rarity-legendary" style="font-size: 11px;">현재 순위: ${myRank}위</span>
          </div>

          <!-- 복사 및 등록 버튼 듀오 -->
          <div style="display: flex; gap: 6px; margin-bottom: var(--space-sm);">
            <button id="btn-copy-rank-card" class="btn-primary" style="flex: 1; height: 36px; font-size: 12px; background: #0284c7;">
              📋 내 랭킹명함 복사
            </button>
            <button id="btn-import-rank-card" class="btn-secondary" style="flex: 1; height: 36px; font-size: 12px;">
              📥 친구 랭킹 등록
            </button>
          </div>

          <!-- 랭킹 정렬 탭 -->
          <div style="display: flex; gap: 4px; margin-bottom: var(--space-xs); background: #f1f5f9; padding: 2px; border-radius: var(--radius-sm);">
            <button class="btn-sort-rank ${currentSort === 'score' ? 'is-active' : ''}" data-sort="score" style="flex: 1; height: 28px; font-size: 11px; border: none; border-radius: 4px; cursor: pointer; ${currentSort === 'score' ? 'background: #fff; font-weight: 700; color: #0284c7;' : 'background: transparent; color: #64748b;'}">종합 점수</button>
            <button class="btn-sort-rank ${currentSort === 'collection' ? 'is-active' : ''}" data-sort="collection" style="flex: 1; height: 28px; font-size: 11px; border: none; border-radius: 4px; cursor: pointer; ${currentSort === 'collection' ? 'background: #fff; font-weight: 700; color: #0284c7;' : 'background: transparent; color: #64748b;'}">도감순</button>
            <button class="btn-sort-rank ${currentSort === 'size' ? 'is-active' : ''}" data-sort="size" style="flex: 1; height: 28px; font-size: 11px; border: none; border-radius: 4px; cursor: pointer; ${currentSort === 'size' ? 'background: #fff; font-weight: 700; color: #0284c7;' : 'background: transparent; color: #64748b;'}">최대어</button>
            <button class="btn-sort-rank ${currentSort === 'gold' ? 'is-active' : ''}" data-sort="gold" style="flex: 1; height: 28px; font-size: 11px; border: none; border-radius: 4px; cursor: pointer; ${currentSort === 'gold' ? 'background: #fff; font-weight: 700; color: #0284c7;' : 'background: transparent; color: #64748b;'}">누적 골드</button>
          </div>

          <!-- 랭킹 보드 리스트 -->
          <div class="ranking-board-list" style="max-height: 260px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; padding-right: 2px;">
            ${rankingList
              .map((item, idx) => {
                const rankNum = idx + 1;
                const medal =
                  rankNum === 1 ? '🥇' :
                  rankNum === 2 ? '🥈' :
                  rankNum === 3 ? '🥉' :
                  `<span style="font-size: 12px; font-weight: 700; color: #64748b;">${rankNum}</span>`;

                const rodMeta = RODS[item.equippedRod] || RODS.bamboo;

                return `
                  <div class="ranking-row ${item.isMe ? 'is-me' : ''}" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid ${item.isMe ? '#38bdf8' : '#e2e8f0'}; background: ${item.isMe ? '#f0f9ff' : '#ffffff'};">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div style="width: 24px; text-align: center; font-size: 16px;">${medal}</div>
                      <div>
                        <div style="display: flex; align-items: center; gap: 4px;">
                          <span style="font-weight: 800; font-size: 13px; color: ${item.isMe ? '#0284c7' : '#1e293b'};">${item.name}</span>
                          ${item.isMe ? '<span style="font-size: 10px; background: #0284c7; color: #fff; padding: 1px 4px; border-radius: 3px;">나</span>' : ''}
                          <span style="font-size: 11px;" title="${rodMeta.name}">${rodMeta.emoji}</span>
                        </div>
                        <div class="t-body-sm" style="font-size: 11px; color: #64748b;">
                          도감 ${item.collectionCount}/100 · 최대어 ${item.maxFishSize}cm
                        </div>
                      </div>
                    </div>

                    <div style="text-align: right;">
                      <div class="tabular-nums" style="font-weight: 800; font-size: 13px; color: #0f172a;">
                        ${formatGold(item.score)}P
                      </div>
                      <div class="t-body-sm tabular-nums" style="font-size: 10px; color: #10b981;">
                        💰 ${formatGold(item.totalEarned)}G
                      </div>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>

          <button id="btn-close-ranking" class="btn-secondary modal-action-btn" style="width: 100%; margin-top: var(--space-sm);">
            닫기
          </button>
        </div>
      </div>
    </div>
  `;

  // 닉네임 수정 클릭
  const labelName = document.getElementById('label-fisher-name');
  if (labelName) {
    labelName.addEventListener('click', () => {
      const current = state.fisherName || '도시 어부';
      const next = prompt('랭킹 명함에 표시될 칭호(닉네임)를 입력하세요 (최대 12글자):', current);
      if (next && next.trim()) {
        setFisherName(next);
        showRankingModal();
      }
    });
  }

  // 내 랭킹 명함 복사
  const btnCopy = document.getElementById('btn-copy-rank-card');
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const code = exportRankingCardCode();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
          showToast('📋 내 랭킹 명함 코드가 복사되었습니다! 친구나 채팅방에 공유해보세요.');
        }).catch(() => {
          prompt('아래 랭킹 코드를 복사하세요:', code);
        });
      } else {
        prompt('아래 랭킹 코드를 복사하세요:', code);
      }
    });
  }

  // 친구 랭킹 코드 등록
  const btnImport = document.getElementById('btn-import-rank-card');
  if (btnImport) {
    btnImport.addEventListener('click', () => {
      const code = prompt('친구가 공유한 랭킹 명함 코드를 붙여넣으세요:');
      if (code && code.trim()) {
        const res = importRankingCardCode(code);
        if (res.ok) {
          showToast(`🎉 [${res.name}] 어부님이 명예의 전당 랭킹에 등록되었습니다!`);
          showRankingModal();
        } else {
          showToast(res.error);
        }
      }
    });
  }

  // 정렬 탭 버튼
  const sortBtns = modalRoot.querySelectorAll('.btn-sort-rank');
  sortBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentSort = btn.dataset.sort;
      showRankingModal();
    });
  });

  // 닫기 버튼
  const btnClose = document.getElementById('btn-close-ranking');
  if (btnClose) {
    btnClose.addEventListener('click', () => {
      modalRoot.innerHTML = '';
    });
  }
}
