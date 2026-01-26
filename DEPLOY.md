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
**"Add environment variables"** 버튼을 누르고, `config.js`에 있던 값들을 하나씩 추가해줍니다.

| Key | Value (값) |
| :--- | :--- |
| `GOOGLE_MAPS_API_KEY` | (Google Maps API 키 입력) |
| `MAP_ID` | `8fbca58624e4405a846adbea` |
| `GEMINI_API_KEY` | (Gemini API 키 입력) |
| `SHEET_ID` | (Google Sheet ID 입력) |

*값은 `config.js` 파일에 있는 내용 그대로 복사해서 넣으시면 됩니다.*

## 5. 배포 시작 (Deploy)
모든 설정이 끝났으면 **Deploy** 버튼을 누르세요. 잠시 후 배포가 완료되면 사이트 주소가 생성됩니다.

---

### ⚠️ 주의사항
*   **Google Maps API 키 보안**: Google Cloud Console에서 API 키 설정을 통해 **'HTTP 리퍼러 제한'**을 걸어두는 것을 강력 추천합니다. Netlify에서 생성된 도메인(예: `your-site.netlify.app`)만 허용하도록 설정하세요.
*   **Gemini API 키 보안**: 이 방식은 API 키가 브라우저에 노출될 수밖에 없습니다. 서비스가 커지면 백엔드 서버를 통해 호출하도록 구조를 변경해야 합니다. 현재 단계에서는 API 사용량 제한(Quota)을 걸어두는 것이 좋습니다.
