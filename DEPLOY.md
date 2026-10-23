# Netlify 배포 가이드

관리자 메뉴판 사진 인식·시트 저장 기능 설정은 [ADMIN-MENU.md](ADMIN-MENU.md)를 참고하세요. 관리자 화면은 `/admin-menu.html`입니다.

이 프로젝트는 정적 웹사이트이지만, 보안상 중요한 API 키(`config.js`)를 GitHub에 올리지 않도록 설정되어 있습니다. 따라서 Netlify 배포 시 환경 변수를 통해 `config.js`를 생성해주어야 합니다.

## 1. GitHub 업로드 준비
1.  이 폴더의 파일들을 GitHub 저장소(Repository)에 업로드합니다.
2.  `config.js` 파일은 업로드되지 않습니다 (보안 설정).

## 2. Netlify 사이트 생성
1.  [Netlify](https://www.netlify.com/)에 로그인하고 **"Add new site"** -> **"Import an existing project"**를 선택합니다.
2.  GitHub를 선택하고 방금 업로드한 저장소를 연결합니다.

## 3. Build Settings (빌드 설정)
배포 설정 단계에서 아래와 같이 입력합니다:

*   **Build command**: `npm install && node generate-config.js`
*   **Publish directory**: `.` (점 하나, 또는 비워두기)

> **설명**: `npm install`은 필요한 라이브러리(`node-fetch` 등)를 설치하고, `node generate-config.js`는 환경 변수를 읽어 `config.js`를 생성합니다.

## 4. Environment variables (환경 변수 설정)
**"Add environment variables"** 버튼을 누르고, 아래 값들을 추가해줍니다.

| Key | Value (값) | 용도 |
| :--- | :--- | :--- |
| `GOOGLE_MAPS_API_KEY` | (Google Maps API 키 입력) | 지도 표시용 (config.js 생성용) |
| `MAP_ID` | `8fbca58624e4405a846adbea` | 지도 스타일 ID |
| `SHEET_ID` | (Google Sheet ID 입력) | 구글 시트 데이터 연동 |

*값은 `config.js` 파일에 있는 내용 그대로 복사해서 넣으시면 됩니다.*

## 5. 배포 시작 (Deploy)
모든 설정이 끝났으면 **Deploy** 버튼을 누르세요. 

> **보안 알림**: OpenAI 추천 함수(`recommend.js`)는 사이트에서 쓰지 않아 삭제했습니다. Netlify에 `OPENAI_API_KEY`가 남아 있다면 지워도 됩니다.

---

### ⚠️ 주의사항
*   **Google Maps API 키 보안**: Google Cloud Console에서 **'HTTP 리퍼러 제한'**을 꼭 설정하세요. Netlify 주소(예: `*.netlify.app`)만 허용하도록 지정하면 키 도용을 막을 수 있습니다.
