# Netlify 배포 가이드

이 프로젝트는 정적 웹사이트이지만, 보안상 중요한 API 키(`config.js`)를 GitHub에 올리지 않도록 설정되어 있습니다. 따라서 Netlify 배포 시 환경 변수를 통해 `config.js`를 생성해주어야 합니다.

## 1. GitHub 업로드 준비
1.  이 폴더의 파일들을 GitHub 저장소(Repository)에 업로드합니다.
2.  `config.js` 파일은 업로드되지 않습니다 (보안 설정).

## 2. Netlify 사이트 생성
1.  [Netlify](https://www.netlify.com/)에 로그인하고 **"Add new site"** -> **"Import an existing project"**를 선택합니다.
2.  GitHub를 선택하고 방금 업로드한 저장소를 연결합니다.

## 3. Build Settings (빌드 설정)
배포 설정 단계에서 아래와 같이 입력합니다:

*   **Build command**: `node generate-config.js`
*   **Publish directory**: `.` (점 하나, 또는 비워두기)

> **설명**: `node generate-config.js` 명령어는 배포 전에 환경 변수를 읽어 `config.js` 파일을 뚝딱 만들어주는 역할을 합니다.

## 4. Environment variables (환경 변수 설정)
**"Add environment variables"** 버튼을 누르고, 아래 값들을 추가해줍니다.

| Key | Value (값) | 용도 |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | (Gemini API 키 입력) | 서버(Functions)에서 API 호출 시 사용 |
| `GOOGLE_MAPS_API_KEY` | (Google Maps API 키 입력) | 지도 표시용 (config.js 생성용) |
| `MAP_ID` | `8fbca58624e4405a846adbea` | 지도 스타일 ID |
| `SHEET_ID` | (Google Sheet ID 입력) | 구글 시트 데이터 연동 |

*값은 `config.js` 파일에 있는 내용 그대로 복사해서 넣으시면 됩니다.*

## 5. 배포 시작 (Deploy)
모든 설정이 끝났으면 **Deploy** 버튼을 누르세요. 

> **보안 알림**: 이제 추천 기능은 `netlify/functions/recommend.js`를 통해 실행됩니다. 이 방식은 브라우저에 API 키가 절대 노출되지 않으므로 안심하고 사용하셔도 됩니다.

---

### ⚠️ 주의사항
*   **Gemini API 보안**: 이제 API 키가 서버 사이드에서만 관리되므로 훨씬 안전합니다. 
*   **Google Maps API 키 보안**: Google Cloud Console에서 **'HTTP 리퍼러 제한'**을 꼭 설정하세요. Netlify 주소(예: `*.netlify.app`)만 허용하도록 지정하면 키 도용을 막을 수 있습니다.
