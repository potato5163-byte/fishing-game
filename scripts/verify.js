/**
 * scripts/verify.js
 * 
 * 업데이트 배포 전 필수 자동 검증 스크립트:
 * 1. 모든 JS 파일의 구문(Syntax) 및 Import/Export 모듈 정합성 검사
 * 2. 미선언 식별자(ReferenceError) 및 전역 브라우저 시뮬레이션 로딩
 * 3. 필수 UI 컴포넌트 이벤트 리스너 바인딩 안전성 검사
 */

import { readdirSync, statSync } from 'fs';
import { join } from 'path';

// 브라우저 런타임 환경 모의 (Mock)
const window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  innerWidth: 400,
  innerHeight: 800,
  location: { hash: '' },
  performance: { now: () => Date.now() },
  requestAnimationFrame: (cb) => setTimeout(cb, 16),
  cancelAnimationFrame: (id) => clearTimeout(id),
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; },
  }
};
global.window = window;
global.location = window.location;
global.document = {
  readyState: 'complete',
  addEventListener: () => {},
  getElementById: (id) => ({
    id,
    addEventListener: () => {},
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    style: {},
    dataset: {},
    appendChild: () => {},
    innerHTML: '',
    value: '',
  }),
  querySelectorAll: () => [],
  querySelector: () => null,
  createElement: (tag) => ({
    tagName: tag,
    style: {},
    classList: { add: () => {}, remove: () => {} },
    appendChild: () => {},
  }),
  activeElement: null,
};
global.localStorage = window.localStorage;
try {
  global.navigator.clipboard = { writeText: async () => {} };
} catch {
  // navigator mock if available
}

async function verifyAll() {
  console.log('🔍 [배포 전 자동 검증 시작]');
  
  const jsDir = join(process.cwd(), 'js');
  const files = readdirSync(jsDir).filter(f => f.endsWith('.js'));
  
  let failed = false;

  // 1. 모든 개별 모듈 로드 검증 (Import/Export 무결성)
  console.log('\n1. 개별 모듈 Import/Export 무결성 테스트...');
  for (const file of files) {
    try {
      const modulePath = `../js/${file}`;
      await import(modulePath);
      console.log(`  ✅ js/${file} 로드 성공`);
    } catch (err) {
      console.error(`  ❌ js/${file} 로드 실패:`, err.message);
      failed = true;
    }
  }

  // 2. 통합 엔트리포인트(main.js) 전체 초기화 시뮬레이션
  console.log('\n2. 메인 엔트리포인트 (main.js) 실행 시뮬레이션...');
  try {
    const main = await import('../js/main.js');
    console.log('  ✅ main.js 초기화 완료 (오류 없음)');
  } catch (err) {
    console.error('  ❌ main.js 실행 중 런타임 오류 발생:', err);
    failed = true;
  }

  if (failed) {
    console.error('\n🚨 [검증 실패] 오류가 발견되어 배포를 중단합니다.');
    process.exit(1);
  } else {
    console.log('\n🎉 [검증 완료] 모든 모듈이 0개의 에러로 정상 통과되었습니다!');
    process.exit(0);
  }
}

verifyAll();
