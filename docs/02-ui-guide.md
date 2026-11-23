# 02. UI 구현 지침 (Figma 스타일 기반)

화면 배치, 색, 글꼴, 컴포넌트 모양을 정합니다. **여기 없는 스타일을 새로 만들지 마세요.**

> 이 문서는 사용자가 준 **Figma DESIGN.md**의 디자인 언어를 낚시 게임에 맞게 옮긴 것입니다.
> 원본 DESIGN.md는 마케팅 웹사이트용이므로 그대로 쓰지 않고, 아래 규칙만 따릅니다.
> 원본과 이 문서가 다르면 **이 문서가 우선**입니다.

---

## 1. 디자인 콘셉트

- **흑백 바탕 + 파스텔 색 블록.** 상단바·하단 탭·버튼·글자는 검정과 흰색만 쓴다. 각 화면 맨 위에는 파스텔 색 블록 하나를 큼직하게 깔아 "깨끗한 책상 위 포스트잇"처럼 보이게 한다.
- **버튼은 전부 알약 모양(pill).** 네모 버튼은 만들지 않는다. 아이콘만 있는 버튼은 동그라미.
- **그림자 대신 색과 얇은 선.** 카드는 그림자 없이 1px 선(hairline)으로 구분한다. 그림자는 모달에만 쓴다.
- **굵기로 위계를 만든다.** 회색 글자를 쓰지 않는다. 덜 중요한 글자는 작게 또는 얇게 쓴다.
- 그림은 **이모지 + CSS 도형 + 인라인 SVG**로만 표현한다.

### 게임 예외 (원본 DESIGN.md에는 없지만 게임에 꼭 필요해서 쓰는 색)
| 예외 | 쓰는 곳 | 이유 |
|---|---|---|
| 지역 배경 그라데이션 | 낚시 장면, 지역 카드 | 지역마다 다른 분위기 (docs/07) |
| 등급 색 | 등급 배지, 결과 모달 테두리 | 일반·희귀·영웅·전설 구분 |
| 위험 색(`--color-danger`) | 오류 숫자, 초기화 버튼 | 원본에 오류 색이 없음 |
| 성공 색(`--color-success`) | 퍼펙트 구간, 잡기 영역, 진행도 | 게임 판정 표시 |

**위 4가지 외에는 새 색을 추가하지 않는다.**

---

## 2. 글꼴

원본의 figmaSans·figmaMono 대신 **Pretendard**를 쓴다(한글 표시 때문). `css/fonts.css`에 아래 코드를 **그대로** 넣는다.

```css
@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Thin.woff2') format('woff2');
    font-weight: 100;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-ExtraLight.woff2') format('woff2');
    font-weight: 200;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Light.woff2') format('woff2');
    font-weight: 300;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Regular.woff2') format('woff2');
    font-weight: 400;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Medium.woff2') format('woff2');
    font-weight: 500;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-SemiBold.woff2') format('woff2');
    font-weight: 600;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Bold.woff2') format('woff2');
    font-weight: 700;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-ExtraBold.woff2') format('woff2');
    font-weight: 800;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Black.woff2') format('woff2');
    font-weight: 900;
    font-display: swap;
}

@font-face {
    font-family: 'PretendardVariable';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/2611030106@font-variable-694/variable-694/PretendardVariable.woff2') format('woff2');
    font-weight: 45 930;
    font-display: swap;
}

/* 가변: font-family: 'PretendardVariable'; font-variation-settings: "wght" 400; */
```

- 기본 글꼴은 **고정 굵기 `Pretendard`**. `PretendardVariable`은 선언만 해 두고 쓰지 않는다.
- 숫자(골드, 크기, 진행도, 남은 시간)에는 `font-variant-numeric: tabular-nums;`를 줘서 숫자가 바뀌어도 폭이 흔들리지 않게 한다.
- **아이브로(eyebrow)** 라벨만 고정폭 글꼴 묶음을 쓴다: `ui-monospace, 'SF Mono', Menlo, Consolas, monospace` (외부 글꼴 아님, 기기 기본 글꼴).

### 글자 크기 단계 (원본 위계를 모바일 게임 크기로 줄임)
| 토큰 | 크기 | 굵기 | 줄 간격 | 자간 | 쓰는 곳 |
|---|---|---|---|---|---|
| `display` | 32px | 300 | 1.10 | -0.64px | 결과 모달 물고기 이름, 낚시왕 모달 |
| `headline` | 24px | 600 | 1.35 | -0.24px | 화면 제목 (색 블록 안) |
| `subhead` | 17px | 300 | 1.40 | -0.17px | 색 블록 안 요약 문장 (예: `도감 달성률 7/20`) |
| `card-title` | 17px | 700 | 1.45 | 0 | 카드·목록의 물고기·상품 이름 |
| `body` | 15px | 400 | 1.45 | -0.15px | 본문, 설명, 상태 문구 |
| `body-sm` | 13px | 400 | 1.45 | -0.1px | 보조 설명, 크기 범위 |
| `button` | 16px | 600 | 1.40 | -0.1px | 일반 버튼 |
| `button-main` | 18px | 700 | 1.40 | -0.18px | 낚시 화면 메인 버튼 |
| `eyebrow` | 12px | 500 | 1.30 | 0.6px | 화면 위 영문 대문자 라벨 (고정폭 글꼴) |
| `caption` | 11px | 500 | 1.00 | 0.4px | 탭 이름, 배지 글자 |

- **아이브로 라벨 문구 (영문, 대문자 고정):** 낚시 `FISHING` · 가방 `BAG` · 도감 `COLLECTION` · 상점 `SHOP` · 지역 `MAP` · 설정 `SETTINGS`. 화면에 보이는 영어는 이 6개와 골드 단위 `G`, 배지 `NEW!`뿐이다.

---

## 3. 디자인 토큰 (css/base.css)

`:root`에 아래 변수를 정의하고, **모든 CSS는 이 변수만 사용**한다.

```css
:root {
  /* 흑백 기본 (Figma 원본) */
  --color-ink: #000000;          /* 모든 글자, 메인 버튼, 선택 상태 */
  --color-canvas: #FFFFFF;       /* 앱 배경, 카드, 모달 */
  --color-inverse-ink: #FFFFFF;  /* 검정 바탕 위 글자 */
  --color-surface-soft: #F7F7F5; /* 연한 바탕: 보조 버튼, 도감 카드, 게이지 바탕 */
  --color-hairline: #E6E6E6;     /* 1px 테두리 */
  --color-hairline-soft: #F1F1F1;/* 더 옅은 구분선 */
  --color-page: #F7F7F5;         /* 480px 바깥 페이지 배경 */
  --color-scrim: rgba(0, 0, 0, 0.6); /* 모달 뒤 배경 */

  /* 파스텔 색 블록 (Figma 원본) */
  --block-lime: #DCEEB1;
  --block-lilac: #C5B0F4;
  --block-cream: #F4ECD6;
  --block-pink: #EFD4D4;
  --block-mint: #C8E6CD;
  --block-coral: #F3C9B6;
  --block-navy: #1F1D3D;

  /* 한 번만 쓰는 강조색 (Figma 원본) */
  --color-accent-magenta: #FF3D8B; /* NEW! 배지 전용 */

  /* 게임 예외 색 */
  --color-success: #1EA64A;
  --color-danger: #E5484D;

  /* 등급 색 (게임 예외) — 배지 글자는 검정 */
  --rarity-common: #C9CED6;
  --rarity-rare: #8FB8FF;
  --rarity-epic: #C5B0F4;
  --rarity-legendary: #FFD166;

  /* 지역 배경 (게임 예외, 위 → 아래 그라데이션) */
  --region-lake-top: #A8DADC;   --region-lake-bottom: #457B9D;
  --region-river-top: #B7E4C7;  --region-river-bottom: #2D6A4F;
  --region-sea-top: #90E0EF;    --region-sea-bottom: #0077B6;
  --region-abyss-top: #3A0CA3;  --region-abyss-bottom: #0B0F2E;

  /* 간격 (8px 기준) */
  --space-hair: 1px;
  --space-xxs: 4px;  --space-xs: 8px;  --space-sm: 12px;
  --space-md: 16px;  --space-lg: 24px; --space-xl: 32px; --space-xxl: 48px;

  /* 둥글기 */
  --radius-xs: 2px;  --radius-sm: 6px;  --radius-md: 8px;
  --radius-lg: 24px; --radius-xl: 32px;
  --radius-pill: 50px; --radius-full: 9999px;

  /* 깊이: 그림자는 2단계(떠 있는 것)와 3단계(모달)만 */
  --shadow-float: 0 4px 16px rgba(0, 0, 0, 0.06);
  --shadow-modal: 0 16px 48px rgba(0, 0, 0, 0.24);

  /* 크기 */
  --app-max-width: 480px;
  --topbar-height: 56px;
  --tabbar-height: 64px;
  --touch-min: 44px;

  --font-base: 'Pretendard', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  --font-mono: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
}
```

### 화면별 색 블록 (한 화면에 색 블록은 하나만)
| 화면 | 색 블록 |
|---|---|
| 낚시 | (색 블록 대신 지역 배경 낚시 장면) |
| 가방 | `--block-mint` |
| 도감 | `--block-lime` |
| 상점 | `--block-lilac` |
| 지역 | `--block-cream` |
| 설정 모달 | `--block-cream` (모달 윗부분) |

---

## 4. 전체 레이아웃

- 앱 전체(`.app`)는 **가로 최대 480px**, 화면 가운데 정렬, 배경 `--color-canvas`. 바깥은 `--color-page`.
- 480px보다 넓은 화면에서는 앱 양옆에 1px `--color-hairline` 선을 그어 경계를 보여준다.
- 높이는 `100dvh`(지원 안 하면 `100vh`).
- 세로 구성: **상단바(56px, 고정) / 화면 영역(남은 높이, 스크롤) / 하단 탭(64px, 고정)**

```
┌──────────────────────────────────┐
│ 🪙 1,250G  📍 잔잔한 호수  🎒 7/20  ⚙️ │ ← 상단바 (흰 바탕, 아래 1px 선)
├──────────────────────────────────┤
│ ┌──────────────────────────────┐ │
│ │ BAG                          │ │ ← 색 블록 (화면마다 다른 파스텔)
│ │ 가방                          │ │
│ │ 7마리 · 총 1,230G            │ │
│ └──────────────────────────────┘ │
│   (목록·카드 — 흰 바탕)            │ ← 화면 영역 (스크롤)
├──────────────────────────────────┤
│ 🎣낚시  🎒가방  📖도감  🏪상점  🗺️지역 │ ← 하단 탭 (흰 바탕, 위 1px 선)
└──────────────────────────────────┘
```

**상단바** (원본 `top-nav`)
- 배경 `--color-canvas`, 아래 1px `--color-hairline`, 좌우 여백 `--space-md`.
- 왼쪽: `🪙 {골드}G` (천 단위 쉼표, `card-title`, tabular-nums)
- 가운데: `📍 {현재 지역 이름}` (`body-sm`, 굵기 600)
- 오른쪽: `🎒 {가방 수}/{용량}` + 설정 동그라미 버튼 `⚙️` (원본 `button-icon-circular`, 40px)
- 가방이 가득 차면 `🎒` 숫자를 `--color-danger`로 표시
- 도감 20종을 모두 채우면 골드 옆에 `👑 낚시왕` 검정 알약 배지

**하단 탭** (원본 `pricing-tab` 방식)
- 배경 `--color-canvas`, 위 1px `--color-hairline`. 탭 5개를 같은 너비로.
- 각 탭: 이모지(22px) 위, 글자(`caption`) 아래.
- **선택된 탭**: 이모지+글자 묶음 뒤에 검정 알약(`--color-ink`, `--radius-pill`)이 깔리고 글자가 흰색. 원본 규칙 "선택 = 메인 색"을 따른다.
- **낚시가 진행 중이면(대기·입질·릴 감기 상태) 다른 탭은 비활성**(투명도 0.35, 누르면 아무 일 없음).

**색 블록 (화면 머리)** (원본 `color-block-section`)
- 화면 영역 맨 위, 좌우·위 여백 `--space-md`, 둥글기 `--radius-lg`, 안쪽 여백 `--space-lg`(원본 48px을 모바일에 맞게 줄임).
- 내용: 아이브로(영문 라벨) → `headline` 제목 → `subhead` 요약 → (있으면) 오른쪽 아래 버튼.
- 그림자 없음.

---

## 5. 화면별 구성

### 5-1. 낚시 화면 (기본 화면)

```
┌──────────────────────────────────┐
│ ┌──────────────────────────────┐ │
│ │ FISHING · 잔잔한 호수           │ │ ← 아이브로 (장면 위 왼쪽, 흰 글자)
│ │ ░░░░░ 하늘(지역 top 색) ░░░░░ │ │
│ │                 🎣            │ │ ← 낚싯대
│ │ ～～～～～～～～～～～～～～ │ │ ← 물 표면 (SVG 물결)
│ │            🔴 (찌)            │ │
│ │ ▓▓▓▓ 물속(지역 bottom 색) ▓▓▓ │ │
│ └──────────────────────────────┘ │ ← 둥글기 --radius-lg
│                                  │
│      낚싯대를 던져보세요            │ ← 상태 문구 (body, 굵기 600)
│                                  │
│  (🍞 기본 미끼 ∞ ▾)  (🎋 대나무 낚싯대) │ ← 알약 2개
│ ╭──────────────────────────────╮ │
│ │     낚싯대 던지기  (Space)       │ │ ← 메인 버튼 (검정 알약)
│ ╰──────────────────────────────╯ │
└──────────────────────────────────┘
```

- **낚시 장면**: 화면 영역 위쪽, 좌우·위 여백 `--space-md`, `--radius-lg`, 높이는 화면 영역의 약 55%(최소 260px). 배경은 현재 지역 그라데이션. 그림자 없음. 장면 위 글자는 흰색 + `text-shadow: 0 1px 3px rgba(0,0,0,0.4)`.
- **찌**는 대기(IDLE)일 때 안 보이고, 던진 뒤 물 위에 나타난다.
- **입질 상태**: 찌 위에 큰 `❗`(48px), 찌가 빠르게 떨린다.
- **상태 문구**: `body` 굵기 600, 가운데 정렬, `aria-live="polite"`. 상태별 문구는 docs/03.
- **미끼 선택**: `<select>`를 알약 모양으로(`--color-surface-soft` 바탕, `--radius-pill`, 1px `--color-hairline`). 항목 = 기본 미끼(∞) + 보유 1개 이상인 미끼. 형식 `반짝이 미끼 (12개)`. 낚시 중에는 비활성.
- **낚싯대 표시**: 같은 알약 모양의 표시(버튼 아님).
- **메인 버튼**: 원본 `button-primary`. 가로 꽉 차게, 높이 60px, `--color-ink` 바탕, 흰 글자 `button-main`, `--radius-pill`. 상태에 따라 글자가 바뀐다(docs/03 표).

**캐스팅 힘 게이지 (CHARGING 상태에만)**
- 메인 버튼 바로 위 가로 막대: 높이 12px, `--radius-pill`, 바탕 `--color-surface-soft` + 1px `--color-hairline`.
- 채움 막대 `--color-ink`, 0→100→0 왕복.
- 90~100 구간은 바탕에 `--color-success`로 미리 칠해 "퍼펙트 구간"으로 보여준다.

**릴 감기 미니게임 (REELING 상태에만)**
```
┌─────────┬────────────────────┐
│ ┌─────┐ │ 진행도              │
│ │     │ │ ███████░░░  64%    │
│ │ 🐟  │ │                    │
│ │▓▓▓▓▓│ │ 남은 시간  18초      │
│ │▓잡기▓│ │                    │
│ │▓영역▓│ │                    │
│ └─────┘ │                    │
└─────────┴────────────────────┘
```
- 낚시 장면 위를 흰 패널(`--color-canvas` 92% 투명도)로 덮는다. 둥글기는 장면과 같은 `--radius-lg`.
- **왼쪽 세로 게이지**: 너비 64px, 높이 280px(모바일 240px), `--radius-pill`, 바탕 `--color-surface-soft` + 1px `--color-hairline`. 바닥이 0, 꼭대기가 100.
  - 잡기 영역: `--color-success` 35% 투명도, `--radius-pill`.
  - 물고기: `🐟`(28px). 등급과 상관없이 같은 이모지.
  - 물고기가 잡기 영역 안에 있으면 잡기 영역에 2px `--color-success` 테두리.
- **오른쪽**: 진행도 가로 막대(높이 12px, 채움 `--color-ink`), 숫자 `card-title` tabular-nums, 남은 시간(초, 정수).
- 메인 버튼 글자: `꾹 눌러서 감기 (Space)`.

### 5-2. 낚시 결과 모달

```
╭──────────────────────────╮
│ ┌──────────────────────┐ │
│ │  [NEW!] [최대 기록!]   │ │ ← 해당될 때만
│ │         🐠           │ │ ← 72px
│ └──────────────────────┘ │ ← 위쪽 색 블록 (등급별 색, 아래 표)
│        황금 잉어           │ ← display
│        ( 전설 )            │ ← 등급 배지
│   크기          87.3cm    │
│   판매가        1,104G    │ ← 줄마다 아래 1px hairline-soft
│ ╭──────────────────────╮ │
│ │     확인  (Space)      │ │ ← 검정 알약
│ ╰──────────────────────╯ │
╰──────────────────────────╯
```

| 결과 | 위쪽 색 블록 | 글자 색 |
|---|---|---|
| 일반 | `--block-cream` | 검정 |
| 희귀 | `--block-mint` | 검정 |
| 영웅 | `--block-lilac` | 검정 |
| 전설 | `--block-navy` | 흰색 |
| 실패 | `--block-pink` | 검정 (이모지 `💨`, 제목 = 실패 메시지 docs/08) |

- `NEW!` 배지: `--color-accent-magenta` 바탕, 흰 글자. **게임 전체에서 마젠타는 여기에만** 쓴다.
- `최대 기록!` 배지: `--color-ink` 바탕, 흰 글자.
- 전설 성공 시: 모달 테두리 3px `--rarity-legendary` + 이모지가 한 번 반짝이는 애니메이션.

### 5-3. 가방 화면
- 색 블록(`--block-mint`): `BAG` / `가방` / `7마리 · 총 1,230G` / 오른쪽 아래 `모두 팔기` 검정 알약 버튼.
- 목록(흰 바탕): 최근에 낚은 순서(최신이 위). 한 줄 = `이모지 | 이름(card-title) + 등급 배지 | 크기 | 가격 | (팔기)`.
  - 줄 사이 1px `--color-hairline-soft`. 그림자·카드 테두리 없음.
  - `팔기`: 보조 버튼(흰 바탕 알약 + 1px hairline).
- 비어 있으면 색 블록 아래에: `🎣` / `아직 낚은 물고기가 없어요. 낚시하러 가볼까요?` / `낚시하러 가기` 검정 알약.

### 5-4. 도감 화면
- 색 블록(`--block-lime`): `COLLECTION` / `도감` / `달성률 7/20 (35%)` + 진행 막대(채움 `--color-ink`, 바탕 흰색 50%).
- 지역별 묶음(호수 → 강 → 바다 → 심해), 묶음 제목 `card-title` + 오른쪽에 `3/5`, 완성 시 `✅ 보상 받음`, 아직이면 `완성 보상 300G`(body-sm).
- 카드 그리드: 앱 너비 400px 미만이면 3열, 400px 이상이면 4열. 간격 `--space-xs`.
- 카드 (원본 `template-card`): `--color-surface-soft`, `--radius-md`, 안쪽 여백 `--space-sm`, 그림자 없음.
  - 발견: 이모지 36px, 이름(`body-sm` 굵기 600), 등급 배지.
  - 미발견: `❔`, `???`, 카드 테두리 1px 점선 `--color-hairline`, 투명도 0.6. 누르면 `아직 발견하지 못한 물고기예요.` 토스트.

### 5-5. 상점 화면
- 색 블록(`--block-lilac`): `SHOP` / `상점` / `🪙 보유 1,250G`.
- 색 블록 아래 **알약 토글 3개**(원본 `pricing-tab`): `낚싯대` / `미끼` / `가방`. 기본 = 흰 바탕 + 1px hairline, 선택 = 검정 바탕 흰 글자.
- 상품 줄: `이모지(32px) | 이름(card-title) + 설명(body-sm) | 버튼`. 줄 사이 1px `--color-hairline-soft`.
- 버튼:
  | 상태 | 모양 |
  |---|---|
  | `구매 300G` | 검정 알약 (골드 부족해도 누를 수 있고 누르면 E02) |
  | `장착` | 보조 알약 (흰 바탕 + hairline) |
  | `장착 중` | 비활성 알약 |
- 미끼는 `1개 10G`, `10개 100G` 버튼 두 개(둘 다 보조 알약), 이름 옆에 `보유 12개`.

### 5-6. 지역 화면
- 색 블록(`--block-cream`): `MAP` / `지역` / `해금 2/4`.
- 지역 카드 4개를 세로로(게임 예외): 배경 = 해당 지역 그라데이션, `--radius-lg`, 안쪽 여백 `--space-lg`, 흰 글자 + text-shadow.
- 카드 내용: 이름(`headline`), 한 줄 설명(`body`), `도감 3/5`(`body-sm`), 오른쪽 아래 버튼.
- 버튼 (모두 알약):
  | 상태 | 모양 |
  |---|---|
  | `현재 지역` | 검정 알약, 비활성(투명도 그대로 1, 눌리지만 않음) |
  | `이동하기` | 흰 알약, 검정 글자 |
  | `해금 500G` | 흰 알약, 검정 글자 |
  | `🔒 도감 10종 필요` | 흰 알약 투명도 0.7 (누를 수 있고 누르면 E04) |
  | `🔒 맑은 강 먼저` | 비활성 알약 |

### 5-7. 설정 모달 (⚙️)
- 위쪽 색 블록(`--block-cream`): `SETTINGS` / `설정`.
- 통계 3줄(총 낚은 수, 총 던진 수, 총 번 골드), 줄 사이 1px hairline-soft.
- `데이터 초기화` 버튼: 흰 알약 + 1px `--color-danger` 테두리 + `--color-danger` 글자.
- 초기화 확인 모달: `정말 처음부터 시작할까요? 모든 기록이 사라져요.` / [취소 = 보조 알약] [초기화 = `--color-danger` 바탕 흰 글자 알약].

---

## 6. 공통 컴포넌트

| 컴포넌트 | 원본 이름 | 규칙 |
|---|---|---|
| 메인 버튼 | `button-primary` | `--color-ink` 바탕, 흰 글자, `--radius-pill`, 낚시 화면 60px / 그 외 48px 높이. 누르면 `transform: scale(0.98)` (색은 그대로) |
| 보조 버튼 | `button-secondary` | `--color-canvas` 바탕, 검정 글자, 1px `--color-hairline`, `--radius-pill`, 높이 최소 44px |
| 동그라미 아이콘 버튼 | `button-icon-circular` | 40px(터치 화면 44px), `--color-surface-soft`, `--radius-full` |
| 위험 버튼 | (게임 예외) | `--color-danger` 바탕 흰 글자 알약, 또는 흰 바탕 + danger 테두리·글자 |
| 비활성 버튼 | — | `--color-surface-soft` 바탕, 검정 글자 투명도 0.35, `cursor: not-allowed`, `disabled` 속성 |
| 한 화면 메인 버튼 수 | — | **검정 알약은 한 화면에 하나가 원칙.** 목록마다 반복되는 `구매` 버튼은 예외로 허용 |
| 카드·목록 | `template-card` / 목록 줄 | 그림자 없음. 카드는 `--color-surface-soft` + `--radius-md`, 목록은 hairline-soft 구분선 |
| 등급 배지 | — | 등급 색 바탕, **검정 글자** `caption` 굵기 700, `--radius-pill`, 좌우 여백 8px. 글자: 일반·희귀·영웅·전설 |
| 토스트 | `marquee-strip` 느낌 | 탭바 위 16px, `--color-ink` 바탕 흰 글자 `body` 굵기 600, `--radius-pill`, 좌우 여백 `--space-lg`, 2.5초 후 사라짐, 동시에 1개(새 것이 오면 바로 교체) |
| 모달 | 3단계 깊이 | 뒤 `--color-scrim`, 가운데 카드(최대 너비 360px) `--color-canvas`, `--radius-xl`, `--shadow-modal`, 안쪽 여백 `--space-lg`. 위쪽 색 블록은 카드 안쪽 상단에 `--radius-lg`로. 열리면 첫 버튼에 포커스, `Esc`로 닫기(결과 모달은 `확인`과 같음) |
| 배너 (E09) | `promo-banner` | 상단바 바로 아래 고정 띠, `--block-pink` 바탕, 검정 글자 `body-sm`, 닫기 버튼 없음 |
| 디버그 패널 | — | 오른쪽 아래, `--color-canvas` + 1px hairline + `--shadow-float`, `--radius-md` |

---

## 7. 애니메이션

원본 Figma 스타일은 움직임이 적으므로, **게임에 필요한 움직임만** 넣는다.

| 대상 | 동작 |
|---|---|
| 찌 (기다리는 중) | 위아래 4px, 2초 주기, 계속 반복 |
| 찌 (입질) | 좌우 3px, 0.1초 주기로 떨림 |
| 물결 | SVG 물결이 가로로 천천히 흐름(8초 주기) |
| `❗` | 나타날 때 0.15초 동안 0.5배 → 1.2배 → 1배 |
| 결과 모달 | 0.2초 동안 아래에서 위로 + 투명→불투명 |
| 토스트 | 0.2초 페이드 인/아웃 |
| 버튼 누름 | `scale(0.98)`, 0.08초 |

- `@media (prefers-reduced-motion: reduce)`이면 반복 애니메이션(찌, 물결)을 멈추고, 등장 애니메이션은 즉시 표시한다. **게임 동작(게이지·미니게임)은 그대로 움직인다.**

---

## 8. 반응형

| 화면 너비 | 규칙 |
|---|---|
| 360px 미만 | 지원 최소 360px. 그보다 작으면 가로 스크롤 없이 글자만 줄바꿈 |
| 360~480px | 앱이 화면을 꽉 채움 |
| 480px 초과 | 앱은 480px로 가운데, 양옆은 `--color-page` + 1px hairline 경계선 |

- 세로 높이가 640px 미만이면 낚시 장면 높이를 최소 220px로 줄인다.
- 모바일에서 버튼을 길게 눌러도 글자 선택·확대·메뉴가 뜨지 않게 한다: 메인 버튼과 미니게임 영역에 `user-select: none; -webkit-touch-callout: none; touch-action: manipulation;`

---

## 9. 접근성

- 모든 버튼은 `<button>` 태그를 쓴다(`<div>` 클릭 금지).
- 키보드만으로 플레이 가능: **Space** = 메인 버튼(누르고 있기 포함), **Enter** = 포커스된 버튼, **Esc** = 모달 닫기.
- 포커스 표시: `:focus-visible`에 `--color-ink` 2px 외곽선 + 2px 간격(`outline-offset: 2px`). 검정 버튼 위에서는 흰 2px 안쪽 링을 더한다(`box-shadow: inset 0 0 0 2px var(--color-canvas)`).
- 이모지만 있는 버튼(⚙️ 등)에는 `aria-label`을 단다(예: `aria-label="설정"`).
- 상태 문구와 토스트는 `aria-live="polite"`.
- 글자와 배경 명도 대비 4.5:1 이상. 파스텔 블록과 등급 배지 위 글자는 반드시 검정, `--block-navy`와 지역 카드 위 글자는 흰색.

---

## 10. UI 완료 기준·검증 기준

- [ ] 375px, 1280px 두 너비에서 글자 잘림, 버튼 겹침, 가로 스크롤이 없다.
- [ ] 색 코드(`#…`, `rgb(…)`)가 `base.css`의 `:root` 밖 CSS·JS에 직접 쓰여 있지 않다. (예외: `text-shadow`, `--color-scrim`처럼 이 문서에 적힌 rgba 값)
- [ ] 네모 버튼이 하나도 없다(모든 텍스트 버튼은 알약, 아이콘 버튼은 동그라미).
- [ ] 카드와 목록에 그림자가 없다(그림자는 모달과 디버그 패널에만).
- [ ] 각 화면에 파스텔 색 블록이 하나씩만 있고, 표(3장 "화면별 색 블록")의 색과 같다.
- [ ] 마젠타는 `NEW!` 배지에만 쓰였다.
- [ ] 글꼴이 Pretendard다(개발자 도구 → Computed → font-family 확인).
- [ ] 키보드만으로 낚시 1회, 판매 1회, 구매 1회를 할 수 있다.
- [ ] 외부 이미지 요청이 0개다(개발자 도구 → Network → Img 필터).
