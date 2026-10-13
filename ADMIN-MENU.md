# 관리자 메뉴판 인식

별도 운영 사이트: https://manjang-menu-admin.netlify.app/

Netlify 프로젝트: `manjang-menu-admin` (hwantom 팀). 고객용 사이트와 별도로 배포됩니다.
현재 팀 요금제에서는 기본 프로젝트 환경 변수를 사용합니다. 이 값들은 서버에서 읽으며 공개 HTML/JS에 삽입하지 않습니다.
관리자 접속 키는 로컬 `.admin-access.local` 파일에서 확인할 수 있습니다. 이 파일과 `.env`는 공유용 배포 파일에 포함하지 않습니다.

`/admin-menu.html`에서 점포 선택 → 사진 업로드 → 인식 → 수정·검토 → 저장합니다.
접속 전 **샘플로 화면 둘러보기**로 실제 API 호출이나 시트 변경 없이 검토 화면을 체험할 수 있습니다.

## 최초 연결

기존 Netlify 프로젝트의 서버 환경 변수에 아래 값을 설정하고 재배포합니다. 비밀값은 config.js, 코드 저장소, 브라우저 코드에 넣지 않습니다.

| 환경 변수 | 내용 |
|---|---|
| `ADMIN_ACCESS_TOKEN` | 4자리 숫자 접속 코드 또는 32자 이상 접속 키. 앞자리 0도 포함해 문자열 그대로 설정. 접근할 관리자에게만 전달 |
| `GEMINI_API_KEY` | 사진 인식용 Google Gemini API 키. 로컬에서는 기존 .env의 값을 사용 |
| `GEMINI_OCR_MODEL` | 선택. 기본값 `gemini-3.1-flash-lite`. 이미지 입력과 JSON 구조화 출력을 지원하는 Gemini 모델 ID |
| `GEMINI_OCR_FALLBACK_MODEL` | 선택. 기본값 `gemini-3.5-flash-lite`. 모델 사용 불가·서버 오류·연결 실패 시 한 번 전환합니다. 인증·사용량 한도 오류나 검토가 필요한 인식 결과에는 재요청하지 않습니다. 두 요청은 총 55초 이내로 제한합니다. |
| `SHEET_ID` | `(Google Sheet ID)` |
| `SHEET_TAB` | `시트1` (기본값) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Google 서비스 계정 JSON 키의 전체 내용. 서버 환경 변수에만 저장 |

Google Cloud 프로젝트에서 Google Sheets API를 활성화하고 서비스 계정을 생성합니다.
해당 서비스 계정의 이메일을 **대상 스프레드시트 한 개에만 편집자**로 공유합니다. 전체 Drive 접근이나 도메인 전체 위임은 필요하지 않습니다.
이 Codex 세션의 Google Drive 연결은 별도 배포 프로그램의 인증으로 자동 이전되지 않습니다.

접속 키 생성 예: `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`
키는 URL에 넣지 않고 접속 화면에 입력합니다. 브라우저 저장소에 보관하지 않으며 새로고침 시 다시 접속합니다.
인터넷 배포는 HTTPS를 사용합니다. 공유 키 방식이므로 개인별 권한·사용자 감사 기록이 필요한 경우 별도 로그인 서비스로 확장해야 합니다.

## 로컬 실행

Node 22 이상에서 `.env`에 같은 서버 환경 변수를 설정한 뒤 `node local-server.js` 실행.
`http://127.0.0.1:8000/admin-menu.html`을 엽니다. 기존 환경 변수는 .env보다 우선합니다.
실제 키 없이도 샘플 체험은 가능합니다. 단순 정적 서버는 인식·저장 기능을 실행하지 못합니다.

## 저장 규칙

- 첫 행의 제목으로 `name`(또는 `점포명`/`점포`), `slug`(있는 경우), `메뉴`, `가격`을 찾습니다. P/U열 삭제로 열 위치가 바뀌어도 동작합니다.
- 이름과 slug 조합이 한 행에만 해당해야 합니다. 저장 직전에 원본 값·행 위치·열 구성을 다시 읽고 변경됐으면 409 오류로 중단합니다.
- 검토 목록 전체가 해당 점포 메뉴를 **교체**합니다. 기존 메뉴가 사진에 없는 경우 저장 전에 직접 추가하거나 다른 사진을 이어서 인식합니다.
- C/D에 해당하는 `메뉴`와 `가격` 셀만 수정합니다. 각 셀 안에서 메뉴와 가격을 같은 순서의 줄바꿈으로 저장합니다. 수식으로 실행하지 않도록 `RAW`로 씁니다.
- 비어 있는 메뉴/가격, 중복 메뉴명, 잘못된 구분자를 거부합니다. 크기·수량이 다르면 메뉴명에 구분합니다. 가격 미상은 확인한 뒤 `점포 문의` 등으로 직접 입력할 수 있습니다.
- 저장 응답에 반환된 셀 값을 대조합니다. 통신 오류가 발생하면 재저장 전 **현재 시트 다시 읽기**로 반영 여부부터 확인합니다.
- Google Sheets의 읽기와 쓰기는 트랜잭션이 아니므로, 최종 확인과 저장 사이의 동시 수정까지 완전히 잠그지는 못합니다. 같은 점포는 한 관리자가 수정하는 운영을 권장합니다.
- 새롭게 작성되어 메뉴·가격 개수가 일치하는 시트 값은 고객 화면에서 이전 조사 자료보다 우선합니다. 기존과 동일한 원본은 종전 분리 메뉴/조사 자료를 유지합니다.
- 고객 화면은 다음 데이터 조회/새로고침에서 변경을 읽습니다. 기존 CSV 대체 표시 중이면 시트 변경이 나타나지 않을 수 있습니다.
- 엽전도시락 별도 자료는 변경하지 않습니다.

## 사진 처리

JPG/PNG/WebP 한 장을 브라우저에서 최대 변 2,200px로 줄이고 JPEG로 전송합니다. 원본은 25MB 이하, 전송 이미지는 약 3MB 이하입니다. HEIC는 JPG로 변환해야 합니다.
사진은 인식 버튼을 누를 때 Google Gemini API로 전송합니다. API 키는 서버에서만 사용하며 브라우저나 URL에 넣지 않습니다. 앱 자체에는 사진 보관함을 만들지 않습니다. Google API 데이터 처리 정책은 별도로 적용됩니다.
흐릿한 글자나 불확실한 가격은 경고하고 사람이 확인합니다. 상호 인식은 보조 경고로만 사용하며 점포를 자동 변경하지 않습니다.

## 검증

`node --test test-admin-menu.cjs`

`node test-menu.cjs`

관리자 인증, 잘못된 요청, 사진 인식 실패, 헤더 이동, 수정 충돌, 제한된 셀 저장, 저장 응답 검증을 외부 호출 없이 확인합니다. 실제 인식 정확도와 Google 쓰기 권한은 설정 후 실제 메뉴판으로 별도 확인해야 합니다.

API 참고: [Gemini GenerateContent](https://ai.google.dev/api/generate-content), [Gemini 구조화 출력](https://ai.google.dev/gemini-api/docs/generate-content/structured-output), [Google Sheets 값 갱신](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/batchUpdate), [서비스 계정 인증](https://developers.google.com/identity/protocols/oauth2/service-account).
