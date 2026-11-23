# 01. 프로젝트 생성 지침

이 문서는 **폴더 구조, 각 파일의 역할, 로컬 실행 방법, Vercel 배포 방법**을 정합니다.

---

## 1. 폴더 구조 (이대로 만든다)

```
fishing-game/
├── AGENTS.md
├── PRD.md
├── docs/                    ← 설계 문서 (코드 아님)
│   └── 01~09 문서
├── index.html               ← 유일한 HTML 파일
├── css/
│   ├── fonts.css            ← Pretendard @font-face
│   ├── base.css             ← CSS 변수(색·간격·글꼴), 초기화, 공통 레이아웃
│   └── components.css       ← 버튼·카드·배지·모달·토스트·게이지 등
└── js/
    ├── main.js              ← 시작점. 초기화, 탭 이동, 키보드 입력 연결
    ├── data.js              ← 모든 게임 데이터와 수치 (docs/03, docs/04)
    ├── state.js             ← 게임 상태 객체, 상태 변경 함수, 저장/불러오기
    ├── utils.js             ← randomRange, weightedPick, formatGold 등
    ├── ui.js                ← 상단바 갱신, 토스트, 모달, 화면 전환 공통 함수
    ├── fishing.js           ← 낚시 상태 흐름 (캐스팅~결과)
    ├── reel.js              ← 릴 감기 미니게임
    ├── bag.js               ← 가방 화면, 판매
    ├── shop.js              ← 상점 화면, 구매·장착
    ├── collection.js        ← 도감 화면, 기록, 보상
    ├── regions.js           ← 지역 화면, 해금·이동
    └── debug.js             ← #debug 패널 (docs/09)
```

- 이 목록에 없는 파일을 만들지 않는다. 꼭 필요하면 먼저 질문한다.
- `package.json`, `node_modules`, 빌드 설정 파일은 **만들지 않는다.**

---

## 2. 파일 사이의 관계

```
main.js ─┬─ state.js ── data.js, utils.js
         ├─ ui.js
         ├─ fishing.js ── reel.js
         ├─ bag.js
         ├─ shop.js
         ├─ collection.js
         ├─ regions.js
         └─ debug.js
```

- `data.js`는 아무것도 import하지 않는다(값만 export).
- 화면 파일(bag, shop, collection, regions)은 서로를 import하지 않는다. 공통 기능은 `ui.js`나 `state.js`에 둔다.
- 각 화면 파일은 `render화면이름()` 함수(예: `renderBag()`)를 export하고, `main.js`가 탭을 바꿀 때 호출한다.

---

## 3. index.html 뼈대

아래 구조를 그대로 쓰고, 안쪽 내용은 각 단계에서 채운다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>물결 낚시터</title>
  <link rel="stylesheet" href="css/fonts.css" />
  <link rel="stylesheet" href="css/base.css" />
  <link rel="stylesheet" href="css/components.css" />
</head>
<body>
  <div id="app" class="app">
    <header id="topbar" class="topbar"><!-- 골드 · 지역 · 가방 · 설정 --></header>

    <main class="screens">
      <section id="screen-fishing" class="screen is-active"></section>
      <section id="screen-bag" class="screen" hidden></section>
      <section id="screen-collection" class="screen" hidden></section>
      <section id="screen-shop" class="screen" hidden></section>
      <section id="screen-regions" class="screen" hidden></section>
    </main>

    <nav id="tabbar" class="tabbar"><!-- 탭 5개 --></nav>
  </div>

  <div id="toast-root" aria-live="polite"></div>
  <div id="modal-root"></div>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

---

## 4. 로컬에서 실행하기

ES 모듈은 `file://`(파일 더블클릭)에서 막히므로 **로컬 서버**가 필요하다.

**방법 A (Node.js가 있을 때)**
```bash
cd fishing-game
npx serve .
```
터미널에 나온 주소(보통 `http://localhost:3000`)로 접속한다.

**방법 B (Python이 있을 때)**
```bash
cd fishing-game
python -m http.server 5500
```
`http://localhost:5500`으로 접속한다.

---

## 5. Vercel 배포 (8단계에서 진행)

빌드 과정이 없는 **정적 사이트**로 배포한다.

1. 프로젝트 폴더를 GitHub 저장소에 올린다.
2. vercel.com에 로그인 → **Add New → Project** → 방금 만든 저장소 선택.
3. 설정값:
   | 항목 | 값 |
   |---|---|
   | Framework Preset | **Other** |
   | Build Command | 비워 둔다 |
   | Output Directory | 비워 둔다 (루트 그대로) |
   | Install Command | 비워 둔다 |
4. **Deploy** 클릭 → 나온 주소(`https://프로젝트이름.vercel.app`)로 접속해 확인한다.
5. `vercel.json`은 만들지 않는다(필요 없음).

---

## 6. 이 문서의 완료 기준

- [ ] 위 폴더 구조와 파일이 모두 있다(내용이 비어 있어도 됨).
- [ ] 로컬 서버로 열었을 때 "물결 낚시터" 탭 제목이 보이고 콘솔 오류가 0개다.
- [ ] `package.json`, `node_modules`, 빌드 설정 파일이 없다.
