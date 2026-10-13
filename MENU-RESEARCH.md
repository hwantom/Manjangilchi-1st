# 메뉴 조사 기록

조사일: 2026-09-09. 웹사이트 로컬 코드 반영 기록이며 연결된 Google Sheet 수정 또는 배포 완료를 의미하지 않습니다.

## 적용 기준

- 자료 확인일과 가격표 작성일은 별개입니다. 검색 수집일을 가격 갱신일로 사용하지 않습니다.
- 지점의 상호와 주소를 대조합니다. 중량·개수·세트 구성을 유지합니다.
- 플랫폼에 등록된 금액은 현장 최신 확정가가 아닙니다. 갱신일 미표기 및 현재 가격 확인 필요 안내를 함께 표시합니다.
- 이미지 필드는 비워둡니다. 각 메뉴에 원문 출처 링크를 제공합니다.

## 직접 조사하여 반영한 점포

|점포|항목 수|출처|근거의 한계|
|---|---:|---|---|
|통인다방|10|각 항목의 sourceUrl 참조|9개는 2021-04-21 게시 가격, 유자차는 2026-02-09 판매만 확인|
|코코로레시피|17|https://www.diningcode.com/profile.php?rid=J4QQ5NLUSXja|플랫폼 가격 갱신일 미표기|
|참괜찮소 (앱의 참괜찬소)|6|https://www.diningcode.com/profile.php?rid=ECSdBFPwvcXC|특수부위 변동가, 나머지 갱신일 미표기|
|원조정할머니 기름떡볶이|6|https://www.diningcode.com/profile.php?rid=7qhD3b1eCEqj|자하문로15길 18. 갱신일 미표기|
|원조할머니 기름떡볶이|5|https://www.diningcode.com/profile.php?rid=PytgRTe3Bf90|자하문로15길 13. 겨울 한정 오뎅 포함. 갱신일 미표기|

## 추가 확인 필요 — 아직 직접 조사 데이터로 대체하지 않은 항목

- 자미당: 꽈배기/찹쌀도너츠 3개 2,500원과 3,000원 자료가 공존. 최신 메뉴판 또는 사업자 안내 확인 필요. https://www.diningcode.com/profile.php?rid=5Nw5b2VIcHq5 / https://story.pay.naver.com/content/2529_24_C12
- 삼화식당: 백반집 설명과 플랫폼의 고기 메뉴 목록이 달라 사진 대조 필요. https://www.diningcode.com/profile.php?rid=5TwA1ifFYP1U
- 불란집: 떡볶이/순대의 목록 가격과 크기별 설명 가격 불일치. https://www.diningcode.com/profile.php?rid=VvkFXWMu9bPh
- 통인정: 같은 플랫폼 검색 결과와 열린 문서의 메뉴 목록이 다름. 최신 자료 재확인 필요. https://www.diningcode.com/profile.php?rid=s0WIcLnXq6Ba
- 그 외 점포도 조사 진행 대상입니다. menu-data.js에서 sourceType이 independent-research가 아닌 항목은 기존 시트 분리 데이터이며, 직접 검증 완료한 메뉴가 아닙니다.

## 검증

메뉴 1개당 항목 분리, 가격 대응, 이미지 빈 값, 조사 데이터 우선 적용, 두 떡볶이집의 서로 다른 세트 가격, 출처 메타데이터, 지도 스크립트 문법을 test-menu.cjs로 검사합니다. 지도 홈의 임의 추천 메뉴/사진을 제거하고 메뉴 탭과 같은 데이터로 통일했습니다.
