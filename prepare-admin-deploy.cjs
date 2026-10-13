// Export only the standalone administrator app, never local credentials or customer pages.
const fs = require('node:fs');
const path = require('node:path');
const output = path.resolve(__dirname, '..', 'admin-deploy');
fs.mkdirSync(path.join(output, 'public'), {recursive:true});
fs.mkdirSync(path.join(output, 'netlify', 'functions'), {recursive:true});
for (const file of ['admin-menu.html', 'admin-menu.css', 'admin-menu.js']) {
    fs.copyFileSync(path.join(__dirname, file), path.join(output, 'public', file));
}
fs.copyFileSync(path.join(__dirname, 'admin-menu.html'), path.join(output, 'public', 'index.html'));
fs.copyFileSync(path.join(__dirname, 'netlify/functions/admin-menu.js'), path.join(output, 'netlify/functions/admin-menu.js'));
fs.writeFileSync(path.join(output, 'package.json'), JSON.stringify({
    name:'manjang-menu-admin', version:'1.0.0', private:true,
    engines:{node: '>=22'}, dependencies:{'node-fetch':'2.7.0'}
}, null, 2) + '\n');
fs.writeFileSync(path.join(output, 'netlify.toml'), '[build]\n  publish = "public"\n\n[functions]\n  directory = "netlify/functions"\n  node_bundler = "esbuild"\n');
fs.writeFileSync(path.join(output, '.gitignore'), 'node_modules/\n.netlify/\n.env\n.env.*\n*.local\n*.log\n');
fs.writeFileSync(path.join(output, 'public/_headers'), `/*
  X-Robots-Tag: noindex, nofollow
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Content-Security-Policy: default-src 'self'; img-src 'self' data: blob:; style-src 'self'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
  Cache-Control: no-store
`);
fs.writeFileSync(path.join(output, 'README.md'), `# 만장일치 관리자 전용 배포

화면: 점포 선택 → 사진 인식 → 관리자 검토 → 구글 시트 저장.

Netlify에서 기존 고객 사이트와 별도의 새 사이트로 배포합니다.
공개 파일은 public 폴더만, 서버 함수는 netlify/functions 폴더만 배포합니다.
단순 파일 드래그 업로드만으로는 서버 함수가 배포되지 않으므로 Netlify CLI 또는 Git 연동을 사용합니다.

서버 환경 변수: GEMINI_API_KEY, GEMINI_OCR_MODEL(선택), GEMINI_OCR_FALLBACK_MODEL(선택), SHEET_ID, SHEET_TAB, GOOGLE_SERVICE_ACCOUNT_JSON, ADMIN_ACCESS_TOKEN.
비밀값은 Netlify 서버 환경 변수로 설정하고 저장소/공개 파일에 넣지 않습니다.
값을 설정한 다음 배포해야 서버 함수에서 반영됩니다.

공유할 때는 배포된 주소와 관리자 접속 키를 사용할 관리자에게만 전달합니다.
현재는 공용 접속 키 방식이며 개인별 계정/권한/감사 기록 기능은 포함되지 않습니다.

이 폴더에는 로컬 키나 Google 서비스 계정 파일이 포함되어 있지 않습니다.
`);
console.log('Standalone admin deployment prepared: ' + output);
