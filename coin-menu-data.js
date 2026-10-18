// Coin prices are explicitly reported payments, NEVER cash prices divided by 500.
(function (root) {
    const datedVisit = 'https://row-sangsangin.tistory.com/6';
    const candidates = ['자미당','뜻밖의 조작가','부여떡방앗간','불란집','코코로레시피','중앙전주반찬','설야만두','인타코 타코야끼','효자동닭꼬치','원조정할머니 기름떡볶이','경복궁 떡 방앗간','반찬하우스','우리동네','원조할머니 기름떡볶이','개성상회','서촌호떡','정금이네 모두의 분식','체크인첸킨','통인초록','티각태각','서촌의 진심','이레해물칼국수','손맛김밥','서촌등대','신일참기름','소문난김구이','효자365김밥','효자청과마트'];
    const stores = Object.fromEntries(candidates.map(name => [name, {
        name, membershipStatus: 'unverified', items: [],
        note: '기존 데이터의 가맹 표시만 있는 조사 후보입니다. 현재 가맹 여부와 메뉴별 엽전 가격은 확인 중입니다.'
    }]));
    const evidence = {sourceUrl: datedVisit, sourceDate: '2026-02-26', visitDate: '2026-02-21', accessedAt: '2026-09-09', evidenceType: 'first-person-payment-report'};
    Object.assign(stores['원조정할머니 기름떡볶이'], {
        membershipStatus: 'payment-observed', membershipEvidence: evidence,
        note: '2026.02 방문자의 엽전 결제 기록. 현재 가맹 유지 여부는 현장 재확인 필요.',
        items: [{id: 'wonjojung-gochujang-coin', name: '고추장맛 기름떡볶이', coins: 5,
            portion: '도시락용 1회 구매분 · 중량 미기재', ...evidence,
            planningEligible: true, note: '방문기에서 엽전 5개 결제를 직접 명시. 현금 1인분과 같은 양으로 간주하지 않습니다.'}]
    });
    Object.assign(stores['효자동닭꼬치'], {
        membershipStatus: 'payment-observed', membershipEvidence: evidence,
        note: '2026.02 방문자의 엽전 결제 기록. 현재 가맹 유지 여부는 현장 재확인 필요.',
        items: [{id: 'hyoja-wine-cheese-coin', name: '와인치즈닭꼬치', coins: 8,
            portion: '도시락용 1회 구매분 · 꼬치를 빼서 별도 접시에 제공', ...evidence,
            planningEligible: true, note: '방문기에서 엽전 8개 결제를 직접 명시. 일반 현금 판매분과 양이 같다고 단정하지 않습니다.'}]
    });
    Object.assign(stores['손맛김밥'], {
        membershipStatus: 'payment-reported-date-unverified',
        note: '외부 방문기 인용에 엽전 결제 및 꼬마김밥 2줄 3개가 언급되지만 원문 날짜 확인 전입니다.',
        items: [{id:'sonmat-mini-coin-pending', name:'기본 꼬마김밥', coins:3, portion:'2줄',
            sourceUrl:'https://www.diningcode.com/profile.php?rid=9aC9T1pcBKQh', sourceDate:null, accessedAt:'2026-09-09',
            evidenceType:'quoted-visitor-report', planningEligible:false, note:'원문 게시일·현재 판매 조건 확인 필요'}]
    });
    Object.assign(stores['원조할머니 기름떡볶이'], {
        membershipStatus: 'payment-reported-date-unverified',
        note: '전화 02-725-4870의 점포. 원조정할머니와 별개 점포입니다. 방문기 인용은 확인했으나 원문 날짜 미확인.',
        items: ['기름떡볶이','간장떡볶이'].map((name,i) => ({id:'originalgrandma-coin-pending-'+i, name, coins:5,
            portion:'도시락카페 이용분 · 중량 미기재',sourceUrl:'https://www.diningcode.com/profile.php?rid=PytgRTe3Bf90',
            sourceDate:null,accessedAt:'2026-09-09',evidenceType:'quoted-visitor-report',planningEligible:false,
            note:'방문기 인용에 각각 엽전 5개. 원문 날짜 확인 전에는 담기 불가'}))
    });
    stores['정금이네 모두의 분식'].note = '정금이네김밥의 2025.06.22 방문기에 엽전도시락 이용 언급. 상호 연결 및 개별 메뉴 엽전 수량은 추가 확인 필요.';
    stores['정금이네 모두의 분식'].researchSource = 'https://www.diningcode.com/profile.php?rid=zNzTUmFZVHe1';
    stores['이레해물칼국수'].note = '2022.09.01 취재에 엽전도시락 관련 언급이 있으나 구체적 메뉴·수량을 특정할 수 없어 미반영.';
    stores['이레해물칼국수'].researchSource = 'https://www.viva100.com/20220901010000388';
    // Full 80-store public-source audit. Unknown does not mean non-member.
    const researchUpdates = {
    "자미당": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "2026-09-01 시장 방문글은 그날 엽전을 이용하지 않았다고 밝힘. 꽈배기 현금가를 엽전 가격으로 사용하지 않음.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "고기백화점": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "서촌로또방": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "용인야채가게": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "삼화식당": {
        "researchStatus": "historical-nonparticipation-report",
        "researchCheckedAt": "2026-09-09",
        "note": "2015-03-11 현장 취재에 엽전을 받지 않는 집으로 명시. 11년 전 기록이므로 현재 비가맹으로 확정하지 않음.",
        "researchSource": "https://www.khan.co.kr/article/201503112143435/amp",
        "membershipStatus": "unverified",
        "items": []
    },
    "개화플로이죵": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "우리상회": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "참괜찬소": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "곰손카페": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "뜻밖의 조작가": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "부여떡방앗간": {
        "researchStatus": "historical-alias-unverified",
        "researchCheckedAt": "2026-09-09",
        "note": "2014년 가맹 명단에 부여방앗간. 현재 상호와 동일 점포인지 및 현재 가맹 여부 미확인. 당근 점포소개에는 상품권만 확인.",
        "researchSource": "https://bomfamily.tistory.com/32",
        "membershipStatus": "unverified",
        "items": []
    },
    "서촌와인상점": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "싱싱과일나라": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "불란집": {
        "researchStatus": "quoted-payment-report",
        "researchCheckedAt": "2026-09-09",
        "note": "방문기 인용에서 떡볶이 4냥과 가맹 표지 언급. 인용 페이지에 2025-02-06 표시가 있으나 원문 날짜 및 주소(18/23) 차이 확인 필요.",
        "researchSource": "https://www.diningcode.com/profile.php?rid=VvkFXWMu9bPh",
        "membershipStatus": "unverified",
        "items": [
            {
                "id": "research-pending-13-0",
                "name": "떡볶이",
                "coins": 4,
                "portion": "맛보기 도시락 분량 · 중량 미기재",
                "sourceUrl": "https://www.diningcode.com/profile.php?rid=VvkFXWMu9bPh",
                "sourceDate": null,
                "accessedAt": "2026-09-09",
                "evidenceType": "research-pending",
                "planningEligible": false,
                "note": "원문 날짜·주소 대조 필요"
            }
        ]
    },
    "코코로레시피": {
        "researchStatus": "acceptance-reported-price-unverified",
        "researchCheckedAt": "2026-09-09",
        "note": "상손의법칙 방문기 인용에 엽전·현금·카드 모두 가능 언급. 메뉴별 엽전 개수 미확인. 옛 주소와 새 주소 연결도 점검 필요.",
        "researchSource": "https://www.diningcode.com/profile.php?rid=J4QQ5NLUSXja",
        "membershipStatus": "unverified",
        "items": []
    },
    "중앙전주반찬": {
        "researchStatus": "historical-payment-report",
        "researchCheckedAt": "2026-09-09",
        "note": "2024-08-17 직접 방문기: 잡채 4냥. 맛탕은 통상 4냥이라고 설명하나 잔여 1냥에 제공받은 특별 사례. 1냥을 정상 가격으로 쓰지 않음.",
        "researchSource": "https://bubumoney.com/서울-데이트-코스-통인시장-엽전-도시락으로-먹거리/",
        "membershipStatus": "unverified",
        "items": [
            {
                "id": "research-pending-15-0",
                "name": "잡채",
                "coins": 4,
                "portion": "도시락용 · 중량 미기재",
                "sourceUrl": "https://bubumoney.com/서울-데이트-코스-통인시장-엽전-도시락으로-먹거리/",
                "sourceDate": "2024-08-18",
                "accessedAt": "2026-09-09",
                "evidenceType": "research-pending",
                "planningEligible": false,
                "note": "2024년 기록"
            },
            {
                "id": "research-pending-15-1",
                "name": "맛탕",
                "coins": 4,
                "portion": "중량 미기재",
                "sourceUrl": "https://bubumoney.com/서울-데이트-코스-통인시장-엽전-도시락으로-먹거리/",
                "sourceDate": "2024-08-18",
                "accessedAt": "2026-09-09",
                "evidenceType": "research-pending",
                "planningEligible": false,
                "note": "통상가 전언; 실제 1냥 거래는 특별 제공"
            }
        ]
    },
    "루루마켓": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "설야만두": {
        "researchStatus": "historical-alias-unverified",
        "researchCheckedAt": "2026-09-09",
        "note": "2014년 가맹 명단의 설야 소문난 효자김밥과 현재 설야만두의 동일성 미확인. 2023년 서울시 소개 현금 가격을 엽전으로 환산하지 않음.",
        "researchSource": "https://bomfamily.tistory.com/32",
        "membershipStatus": "unverified",
        "items": []
    },
    "신앙촌상회": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "인왕산건강원": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "인타코 타코야끼": {
        "researchStatus": "identity-unverified-report",
        "researchCheckedAt": "2026-09-09",
        "note": "타지역 카페인타코 페이지에 통인시장 방문기가 잘못 연결되어 있음. 인용에 오리지널 2알+매콤 2알 6냥 언급. 원문 점포·날짜 검증 전에는 채택하지 않음.",
        "researchSource": "https://fms.purpleo.co.kr/view/42043",
        "membershipStatus": "unverified",
        "items": [
            {
                "id": "research-pending-20-0",
                "name": "타코야끼 (오리지널 2알+매콤 2알)",
                "coins": 6,
                "portion": "총 4알",
                "sourceUrl": "https://fms.purpleo.co.kr/view/42043",
                "sourceDate": null,
                "accessedAt": "2026-09-09",
                "evidenceType": "research-pending",
                "planningEligible": false,
                "note": "타지역 점포 페이지에 수집된 인용; 원문 검증 필요"
            }
        ]
    },
    "CHU CHU": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "효자동닭꼬치": {
        "researchStatus": "dated-payment-report",
        "researchCheckedAt": "2026-09-09",
        "note": "2026-02-21 방문자의 와인치즈닭꼬치 결제 기록. 현금 판매분과 엽전 판매분의 양을 동일시하지 않음. 현재 공식 가격 보장 아님.",
        "researchSource": "https://row-sangsangin.tistory.com/6"
    },
    "원조정할머니 기름떡볶이": {
        "researchStatus": "dated-payment-report",
        "researchCheckedAt": "2026-09-09",
        "note": "전화 02-735-7289 점포. 2026-02-21 고추장맛 5개 직접 결제. 2024년 세트 16개 기록은 별도 과거 자료로 보관.",
        "researchSource": "https://row-sangsangin.tistory.com/6"
    },
    "옛날통인감자탕": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "경복궁 떡 방앗간": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "반찬하우스": {
        "researchStatus": "historical-membership-report",
        "researchCheckedAt": "2026-09-09",
        "note": "2014년 이용기의 가맹점 명단에 상호 기재. 현재 가맹/메뉴별 수량 확인 근거로 사용할 수 없음.",
        "researchSource": "https://bomfamily.tistory.com/32",
        "membershipStatus": "unverified",
        "items": []
    },
    "우리동네": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "동명이 많고 구절판 판매점과의 연결을 확인하지 못함. 상호를 추정하여 메뉴를 넣지 않음.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "원조할머니 기름떡볶이": {
        "researchStatus": "conflicting-price-reports",
        "researchCheckedAt": "2026-09-09",
        "note": "정할머니와 별도 점포. 날짜 미확인 방문기 인용은 기름/간장 각각 5개, 2025-03-08 글은 각각 4개. 사진으로 동일 매장 여부까지 재확인 전이므로 어느 쪽도 최신가로 확정하지 않음.",
        "researchSource": "https://www.diningcode.com/profile.php?rid=PytgRTe3Bf90",
        "membershipStatus": "unverified",
        "items": [
            {
                "id": "research-pending-28-0",
                "name": "기름떡볶이",
                "coins": 5,
                "portion": "도시락용 · 중량 미기재",
                "sourceUrl": "https://www.diningcode.com/profile.php?rid=PytgRTe3Bf90",
                "sourceDate": null,
                "accessedAt": "2026-09-09",
                "evidenceType": "research-pending",
                "planningEligible": false,
                "note": "원문 날짜 미확인; 다른 글의 4개 기록과 상충"
            },
            {
                "id": "research-pending-28-1",
                "name": "간장떡볶이",
                "coins": 5,
                "portion": "도시락용 · 중량 미기재",
                "sourceUrl": "https://www.diningcode.com/profile.php?rid=PytgRTe3Bf90",
                "sourceDate": null,
                "accessedAt": "2026-09-09",
                "evidenceType": "research-pending",
                "planningEligible": false,
                "note": "원문 날짜 미확인; 다른 글의 4개 기록과 상충"
            }
        ]
    },
    "체부동잔치집": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "점순이네반찬": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "띵굴마켓 김치 상품은 택배 판매가. 엽전도시락 가맹/소분 가격 근거 아님.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "효자떡집": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "반디수블": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "하림생닭토종닭": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "육곳간축산물": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "여주상회": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "호남상회": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "개성상회": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "상인 인터뷰의 시장 엽전 제도 소개는 해당 점포 엽전 결제 증거가 아님.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "푸른할인마트": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "송림정육점": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "푸른마트 청과코너": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "푸른마트 야채코너": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "송림사우나": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "피노키오 옷수선": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "서촌호떡": {
        "researchStatus": "quoted-payment-report",
        "researchCheckedAt": "2026-09-09",
        "note": "방문기 인용에 씨앗호떡 4코인 표시. 인용 페이지에 2024-09-25 날짜가 있으나 원문 날짜 대조 전. 다른 호떡은 현금 가격만 확인되어 환산 금지.",
        "researchSource": "https://www.diningcode.com/profile.php?rid=mNZfBwQKUUfq",
        "membershipStatus": "unverified",
        "items": [
            {
                "id": "research-pending-44-0",
                "name": "씨앗호떡",
                "coins": 4,
                "portion": "1개",
                "sourceUrl": "https://www.diningcode.com/profile.php?rid=mNZfBwQKUUfq",
                "sourceDate": null,
                "accessedAt": "2026-09-09",
                "evidenceType": "research-pending",
                "planningEligible": false,
                "note": "원문 날짜 미확인, 오래된 기록 가능"
            }
        ]
    },
    "엄마손반찬": {
        "researchStatus": "historical-membership-report",
        "researchCheckedAt": "2026-09-09",
        "note": "2014년 이용기 가맹 명단에 상호 기재. 현재 공식 카카오채널은 점포 존재를 뒷받침하나 현재 엽전 가격까지 확인되지 않음.",
        "researchSource": "https://bomfamily.tistory.com/32",
        "membershipStatus": "unverified",
        "items": []
    },
    "정금이네 모두의 분식": {
        "researchStatus": "identity-unverified-report",
        "researchCheckedAt": "2026-09-09",
        "note": "정금이네김밥 2025-06-22 방문기 인용에 엽전도시락 이용. 현재 상호 연결과 메뉴별 수량 미확인.",
        "researchSource": "https://www.diningcode.com/profile.php?rid=zNzTUmFZVHe1",
        "membershipStatus": "unverified",
        "items": []
    },
    "명방앗간": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "충남방앗간": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "우리농산물유통": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "서울수산물회센타": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "서울수산물회센터 표기도 대조. 점포 소개 외 메뉴별 엽전 근거 미확보.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "체크인첸킨": {
        "researchStatus": "nonparticipation-reported-unverified",
        "researchCheckedAt": "2026-09-09",
        "note": "첸킨 검색으로 확장. 외부 게시물에 엽전 불가 명시. 현재 상호 연결·원문 날짜·점포 공식 확인이 없어 비가맹 확정 대신 재확인 대상으로 분류.",
        "researchSource": "https://pandarank.net/contents/6923112b25ccbb0e6a796e1c",
        "membershipStatus": "unverified",
        "items": []
    },
    "통인초록": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "시장 소개 및 영상에 상호가 등장하지만 엽전 결제·개수 직접 근거 미확보.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "통인다방": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "공식 방문 보도에 유자차 구매가 나오지만 엽전 사용 근거는 아님.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "티각태각": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "온누리 가맹 목록은 있으나 엽전 사용 증거와 구별함.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "서촌의 진심": {
        "researchStatus": "historical-payment-report",
        "researchCheckedAt": "2026-09-09",
        "note": "2024-08-17 직접 방문기에서 식혜 구매와 엽전 4냥 명시. 구 서촌국수라는 상호 설명 있음. 현재 유지 여부 미확인.",
        "researchSource": "https://bubumoney.com/서울-데이트-코스-통인시장-엽전-도시락으로-먹거리/",
        "membershipStatus": "unverified",
        "items": [
            {
                "id": "research-pending-55-0",
                "name": "식혜",
                "coins": 4,
                "portion": "1회 구매분 · 용량 미기재",
                "sourceUrl": "https://bubumoney.com/서울-데이트-코스-통인시장-엽전-도시락으로-먹거리/",
                "sourceDate": "2024-08-18",
                "accessedAt": "2026-09-09",
                "evidenceType": "research-pending",
                "planningEligible": false,
                "note": "2024년 기록"
            }
        ]
    },
    "이레해물칼국수": {
        "researchStatus": "context-only",
        "researchCheckedAt": "2026-09-09",
        "note": "2022년 기사에서 엽전 물가를 언급하지만 해당 가게의 특정 메뉴·분량·가격으로 연결할 수 없어 미채택.",
        "researchSource": "https://www.viva100.com/20220901010000388",
        "membershipStatus": "unverified",
        "items": []
    },
    "BYC": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "손맛김밥": {
        "researchStatus": "quoted-payment-report",
        "researchCheckedAt": "2026-09-09",
        "note": "뭉망뭉 방문기 인용에서 꼬마김밥 2줄 3개 결제. 2017년 경향신문에도 엽전도시락 제공 확인. 최신 원문 날짜 미확인.",
        "researchSource": "https://www.diningcode.com/profile.php?rid=9aC9T1pcBKQh",
        "membershipStatus": "unverified",
        "items": [
            {
                "id": "research-pending-58-0",
                "name": "기본 꼬마김밥",
                "coins": 3,
                "portion": "2줄",
                "sourceUrl": "https://www.diningcode.com/profile.php?rid=9aC9T1pcBKQh",
                "sourceDate": null,
                "accessedAt": "2026-09-09",
                "evidenceType": "research-pending",
                "planningEligible": false,
                "note": "원문 날짜 미확인"
            }
        ]
    },
    "박현순미용실": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "도시락카페": {
        "researchStatus": "operator-confirmed-item-prices-unverified",
        "researchCheckedAt": "2026-09-09",
        "note": "공식 엽전도시락카페 채널 확인. 2014년 자료의 밥·국 현금가를 현재 엽전가로 환산하지 않음. 현재 메뉴별 개수 미확인.",
        "researchSource": "https://pf.kakao.com/_NUxhxhG",
        "membershipStatus": "unverified",
        "items": []
    },
    "도깨비한과강정": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "현대식품": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "알뜰옷수선전문점": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "서촌등대": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "검색되는 한옥 숙소 정보만으로 기존 시트의 엽전 가맹 표시를 뒷받침할 수 없음.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "신일참기름": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "소문난김구이": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "효자365김밥": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "상호 변형 검색에도 메뉴별 엽전 근거 미확보. 과거 소문난효자김밥과 임의로 합치지 않음.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "통인포차": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "통인시장흑백사진관": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "서촌주막": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "다듬이": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "그릇∙혼수용품도소매": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "아빠김치찌개": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "통인정": {
        "researchStatus": "acceptance-reported-price-unverified",
        "researchCheckedAt": "2026-09-09",
        "note": "외부 방문기 인용에 가맹점이라는 문구가 있으나 개별 엽전 메뉴·수량은 없음. 2026년 다른 글의 엽전 소분 언급은 효자동닭꼬치 부분이므로 통인정에 전용하지 않음.",
        "researchSource": "https://www.diningcode.com/profile.php?rid=s0WIcLnXq6Ba",
        "membershipStatus": "unverified",
        "items": []
    },
    "나하나미용실": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "보물창고": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "효자청과마트": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "효자지하생선": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    },
    "현대정육점": {
        "researchStatus": "no-public-evidence-found",
        "researchCheckedAt": "2026-09-09",
        "note": "점포명과 통인시장·엽전·가격을 조합하여 검색했으나 해당 점포의 엽전 결제와 메뉴별 수량을 뒷받침하는 자료를 확보하지 못했습니다. 비가맹 또는 가격 미공개 판정이 아닙니다.",
        "researchSource": null,
        "membershipStatus": "unverified",
        "items": []
    }
};
    for (const [name, update] of Object.entries(researchUpdates)) {
        stores[name] = {...(stores[name] || {name, membershipStatus:'unverified', items:[]}), ...update};
    }

    // On-site price boards photographed by the team on 2026-10-15 (메뉴사진 folder; file names below).
    // 'site-price-board': the board prints the 엽전 price. 'site-won-converted': the board shows won only and the team
    // asked to assume 1냥 = 500원, so coins = won / 500 (priceKrw keeps the original). Store membership was confirmed
    // by the team for these stores. When a store prints its own 엽전 menu, only that menu is used (no conversion).
    const SITE_DATE = '2026-10-15';
    const photo = n => `KakaoTalk_20261015_164017606${n ? '_' + String(n).padStart(2, '0') : ''}.jpg`;
    const onBoard = (store, file) => (key, name, coins, portion = '') => ({id: `site-${store}-${key}`, name, coins, portion,
        sourceDate: SITE_DATE, sourcePhoto: file, evidenceType: 'site-price-board', planningEligible: true,
        note: '가게 가격표에 엽전 가격이 직접 표시됨'});
    const fromWon = (store, file) => (key, name, priceKrw, portion = '') => ({id: `site-${store}-${key}`, name, coins: priceKrw / 500, priceKrw, portion,
        sourceDate: SITE_DATE, sourcePhoto: file, evidenceType: 'site-won-converted', planningEligible: true,
        note: `가격표의 ${priceKrw.toLocaleString('ko-KR')}원을 1냥=500원으로 환산(팀 기준)`});
    const site = (note, items) => ({membershipStatus: 'site-confirmed', siteCheckedAt: SITE_DATE, note, items});

    const ire = onBoard('ire', photo(2));
    const hotteok = onBoard('hotteok', photo(15)), menbosha = onBoard('hotteok', photo(14)), rusk = onBoard('hotteok', photo(15));
    const jgBoard = onBoard('jg', photo(9)), jg = fromWon('jg', photo(8)), jgDrinks = fromWon('jg', photo(11)), jgBeer = fromWon('jg', photo(10));
    const dabang = fromWon('dabang', photo(3)), chenkin = fromWon('chenkin', photo(6));
    const siteSurvey = {
        '이레해물칼국수': site('2026-10-15 현장 엽전 메뉴판 확인. 팥죽은 크기별 두 가지 가격.', [
            ire('janchi', '잔치국수', 4), ire('kimchimari', '김치말이', 4), ire('kongguksu', '콩국수', 6),
            ire('yeolmu', '냉열무국수', 5), ire('patjuk-s', '팥죽', 4, '소(S)'), ire('patjuk-l', '팥죽', 7, '대(L)'),
            ire('odeng-1', '오뎅', 2, '1개'), ire('odeng-2', '오뎅', 4, '2개'), ire('mandu', '만두국', 3)]),
        '서촌호떡': site('2026-10-15 현장 가격표에 엽전 가격(Coin/냥) 표시. 가려져 읽을 수 없는 카드 1장은 제외.', [
            hotteok('seed', '씨앗 꿀 호떡', 4), hotteok('oreo', '오레오 호떡', 5), hotteok('ppurinkle', '뿌링클 호떡', 5),
            hotteok('sesame', '흑임자 호떡', 6), hotteok('injeolmi', '인절미 호떡', 6), hotteok('japchae', '잡채 호떡', 6),
            hotteok('icecream', '아이스크림 호떡', 11, '7가지 맛 선택'), menbosha('menbosha-1', '멘보샤', 4, '1개'),
            menbosha('menbosha-3', '멘보샤', 10, '3개'), rusk('rusk', '러스크', 2)]),
        '정금이네 모두의 분식': site('2026-10-15 현장 확인. 떡볶이는 엽전 9개가 직접 표시되어 있고, 나머지는 원화 가격을 1냥=500원으로 환산. 음료 기계·생맥주도 이 가게 메뉴(팀 확인).', [
            jgBoard('tteokbokki', '떡볶이', 9, '1인분'), jg('sundae', '순대', 5000, '1인분'), jg('twigim', '튀김', 4000, '1인분'),
            jg('gangjeong-l', '닭강정', 10000, '대(L)'), jg('gangjeong-s', '닭강정', 8000, '소(S)'), jg('skewer', '닭꼬치', 4000, '1개'),
            jg('sotteok', '소떡소떡', 3000, '1개'), jg('cheeseball', '크림치즈볼', 2000), jg('colpop', '콜팝', 3000, '1개'),
            jg('pikachu', '피카츄', 2500, '1개'), jg('kkoma-3', '꼬마김밥', 3000, '3개'), jg('kkoma-6', '꼬마김밥', 6000, '6개'),
            jg('shrimp', '새우튀김', 3000, '3개'), jg('sikhye', '식혜', 4000), jg('drink', '음료수', 2000), jg('water', '생수', 1000),
            jgDrinks('slush', '슬러시', 2500), jgBeer('beer', '생맥주', 3000, '300cc')]),
        '인타코 타코야끼': site('2026-10-15 현장 가격표에 "타코야끼 2알 엽전 3냥" 표시(팀이 점포 확인).', [
            onBoard('intaco', photo(0))('takoyaki-2', '타코야끼', 3, '2알')]),
        '통인다방': site('2026-10-15 현장 메뉴판(원화)을 1냥=500원으로 환산. 메뉴는 핫·아이스 공통.', [
            dabang('americano', '아메리카노', 2500), dabang('kenya', '케냐AA', 3000), dabang('latte', '카페라떼', 3500),
            dabang('cappuccino', '카푸치노', 3500), dabang('vanilla', '바닐라 라떼', 4000), dabang('greentea', '녹차', 2500),
            dabang('ginger', '생강차', 3000), dabang('yuja', '유자차', 3000), dabang('yuja-ade', '유자에이드', 3500),
            dabang('lemontea', '레몬차', 3000), dabang('lemonade', '레몬에이드', 3500)]),
        '체크인첸킨': site('2026-10-15 현장 가격표(원화)를 1냥=500원으로 환산.', [
            chenkin('pie', '첸킨 파이', 7000), chenkin('chicken', '첸킨 치킨', 7000), chenkin('shrimp', '쉬림프라임', 7000),
            chenkin('lamb', '양갈비 파이', 7500), chenkin('ragu', '라구 파이', 7000), chenkin('bacon', '베이컨 크림치즈 파이', 7000),
            chenkin('lager', '꿀꺽 라거', 6500), chenkin('ale', '스밈 에일', 6500), chenkin('soda', '콜라·스프라이트', 2000)]),
        '송림사우나': {membershipStatus: 'confirmed-non-member', siteCheckedAt: SITE_DATE, items: [],
            note: '엽전 가맹점이 아님(팀 확인, 2026-10-15). 목욕 요금은 일반 메뉴 정보에만 반영.'}
    };
    for (const [name, update] of Object.entries(siteSurvey)) {
        stores[name] = {...(stores[name] || {name}), ...update};
    }

    // Second batch: photos taken 2026-10-16 (KakaoTalk_20261016_164708624*.jpg), same rules as above.
    const SITE_DATE2 = '2026-10-16';
    const photo2 = n => `KakaoTalk_20261016_164708624${n ? '_' + String(n).padStart(2, '0') : ''}.jpg`;
    const dated = make => (store, file) => (...args) => ({...make(store, file)(...args), sourceDate: SITE_DATE2});
    const onBoard2 = dated(onBoard), fromWon2 = dated(fromWon);
    const site2 = (note, items) => ({membershipStatus: 'site-confirmed', siteCheckedAt: SITE_DATE2, note, items});
    const sinil = (n, file = photo2(n)) => onBoard2('sinil', file), sinilWon = fromWon2('sinil', photo2(2));
    const gim = n => onBoard2('gimgui', photo2(n));
    const tongin = onBoard2('tonginjeong', photo2(9));
    const jungang = onBoard2('jungang', photo2(12));
    const cocoro = onBoard2('cocoro', photo2(13));
    const kitchen = onBoard2('uridongne', photo2(10)), kitchenWon = fromWon2('uridongne', photo2(10));
    const buyeo = n => fromWon2('buyeo', photo2(n));
    const siteSurvey2 = {
        '신일참기름': site2('2026-10-16 현장 "추억의 주전부리" 매대(계산은 신일참기름). 엽전 가격 표시, 히트상품 2종만 원화 환산.', [
            sinil(1)('slush-grape', '슬러시', 4, '포도'), sinil(1)('slush-orange', '슬러시', 4, '오렌지'),
            sinil(2)('saekomjjang', '새콤짱', 2, '1개'), sinil(2)('dalgona', '달고나', 1), sinil(2)('chupa', '츄파춥스', 1),
            sinil(2)('byeolsatang', '불티나 우산 별사탕', 3), sinil(3)('wadadak', '와다닥', 3, '1개'), sinil(3)('apollo', '아폴로', 2),
            sinil(3)('minimum-cola', '미니멈 콜라', 2), sinil(3)('jjondigi', '추억의 쫀드기', 5, '1개'),
            sinilWon('meoktae', '먹태구이', 4000), sinilWon('butter-squid', '버터오징어', 3500)]),
        '소문난김구이': site2('2026-10-16 현장 엽전 가격 표시(장난감·사탕 매대와 식혜, 팀 확인).', [
            gim(0)('apollo', '아폴로', 2), gim(4)('cup-sikhye', '컵식혜', 4), gim(4)('slush-sikhye', '살얼음 식혜', 6)]),
        '통인정': site2('2026-10-16 현장 엽전 메뉴 표시. 일반 식사 메뉴는 엽전 가격이 없어 제외.', [
            tongin('tteoktwigim', '통인 떡튀김', 10, '간장·양념'), tongin('hangang', '한강 떡볶이', 10, '순한·중간매운'),
            tongin('cheese', '눈꽃치즈 추가', 4)]),
        '중앙전주반찬': site2('2026-10-16 현장 "엽전도시락카페 메뉴" 표시.', [
            jungang('gangjeong', '닭강정', 5), jungang('jeyuk', '제육볶음', 5), jungang('kimchijeon', '김치전', 5),
            jungang('japchae', '잡채', 5), jungang('skewer', '닭꼬치', 4, '2개'), jungang('mattang', '맛탕', 4),
            jungang('gyeranmari', '계란말이', 2, '2개'), jungang('hobakjeon', '호박전', 2, '2개'),
            jungang('sausagejeon', '소시지전', 2, '2개'), jungang('vienna', '비엔나', 2, '4개'), jungang('kimchi', '볶은 김치', 2)]),
        '코코로레시피': site2('2026-10-16 현장 코인 표시.', [
            cocoro('mini-jeon', '미니전', 5), cocoro('mini-fried', '미니튀김', 3),
            cocoro('makgeolli-glass', '막걸리', 5, '한 잔'), cocoro('makgeolli-handmade', '수제 막걸리', 9)]),
        '우리동네': site2('2026-10-16 현장 "Little Kichen" 메뉴판(팀 확인: 우리동네). 엽전 가격 표시, 생맥주만 원화 환산.', [
            kitchen('cheese-toast', '치즈 토스트', 8), kitchen('toast', '토스트', 6), kitchen('cheese-hotdog', '치즈 핫도그', 8),
            kitchen('cheese-sausage', '치즈&소시지 핫도그', 6), kitchen('sausage-hotdog', '소시지 핫도그', 6),
            kitchen('potato-sausage', '감자 소시지', 8), kitchen('tteokbokki', '떡볶이', 4), kitchen('soup-tteokbokki', '국물 떡볶이', 8),
            kitchen('drink', '음료수', 4), kitchen('iced-mix', '아이스 믹스 커피', 5), kitchen('iced-americano', '아이스 아메리카노', 5),
            kitchenWon('beer-500', '생맥주', 4500, '500cc'), kitchenWon('beer-300', '생맥주', 3000, '300cc')]),
        '경복궁 떡 방앗간': site2('2026-10-16 현장 식혜 엽전 가격 표시(팀 확인).', [
            onBoard2('gyeongbok', photo2(11))('sikhye', '식혜', 4)]),
        '부여떡방앗간': site2('2026-10-16 현장 원화 가격표를 1냥=500원으로 환산(팀 확인: 전 상품). 이름을 읽을 수 없는 1,500원 낱개 떡은 제외.', [
            buyeo(17)('yakgwa', '약과', 3000), buyeo(17)('songpyeon', '송편', 3000), buyeo(17)('gyeongdan', '경단', 4000),
            buyeo(17)('ssuk-injeolmi', '쑥 인절미', 1000), buyeo(17)('tteokguk', '떡국떡', 5000, '우리쌀 100%'),
            buyeo(16)('deulkkae', '들깨가루', 2000), buyeo(16)('misut-1', '미숫가루', 1000, '1팩'),
            buyeo(16)('misut-2', '미숫가루', 1500, '2팩'), buyeo(16)('misut-large', '미숫가루', 5000, '큰 봉지'),
            buyeo(18)('yeotgireum', '엿기름', 2000), buyeo(18)('corn', '옥수수', 2000), buyeo(18)('barley', '보리', 2000),
            buyeo(18)('raw-bean', '날콩가루', 2000), buyeo(18)('glutinous', '찹쌀가루', 2000)])
    };
    for (const [name, update] of Object.entries(siteSurvey2)) {
        stores[name] = {...(stores[name] || {name}), ...update};
    }
    // 서촌호떡: two extra cards on the 2026-10-16 window (won only, converted).
    stores['서촌호떡'].items.push(fromWon2('hotteok', photo2(20))('cheese', '치즈호떡', 3000),
        fromWon2('hotteok', photo2(20))('ppurinkle-cheese', '뿌링클치즈호떡', 3500));
    // Usage info: public sources plus the market's own notices photographed on 2026-10-16
    // (coin sales moved during the customer-center renovation; closed Mondays and the 3rd Sunday).
    const guide = {
        checkedAt: '2026-10-16',
        coinPriceKrw: 500, bundleSize: 10, bundlePriceKrw: 5000,
        purchasePlace: '통인 배송센터(팝업스토어) — 고객센터 공사로 임시 이전(2026.9.29~2027.1.30 예정)',
        hours: [
            {label: '평일', open: '11:00–16:00', coinSales: '엽전 판매 15:00까지'},
            {label: '주말', open: '11:00–17:00', coinSales: '엽전 판매 16:00까지'}
        ],
        closed: '매주 월요일과 셋째 주 일요일 (시장 안내문 기준)',
        refund: '남은 엽전은 환불할 수 있다는 안내가 있어요. 결제 수단별 조건은 현장에서 확인해 주세요.',
        phone: '02-722-0911',
        cafeExtras: [{id: 'cafe-rice', name: '밥', coins: 2}, {id: 'cafe-soup', name: '국', coins: 2}],
        cafeExtrasNote: '작성일이 확인되지 않은 안내 자료 기준(각 1,000원)이라 현장 확인이 필요해요.',
        sources: [
            {label: '서울시 미디어허브 2025.05', url: 'https://mediahub.seoul.go.kr/archives/2014553'},
            {label: '맘맘 2025.04', url: 'https://mom-mom.net/travel/places/651cc3f4caa4390924c21e61'},
            {label: '방문기 2026.02', url: 'https://row-sangsangin.tistory.com/6'},
            {label: '문의 번호', url: 'https://www.ivisitkorea.com/tongin-market/'},
            {label: '시장 안내문 2026.10', url: null}
        ]
    };
    root.COIN_MENU_DATA = {researchedAt:'2026-09-09', defaultBudget:0, surveyedStoreCount:80, currentOfficialVerificationComplete:false, stores, guide};
})(typeof window !== 'undefined' ? window : globalThis);
