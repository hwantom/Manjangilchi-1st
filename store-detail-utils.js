// Store detail helpers shared with the 매장 tab modal; copied from map.html's detail panel so both show the same content.
(function (root) {
    // Same wording as map.html's UI_TRANSLATIONS status strings.
    const STATUS_TEXTS = {
        ko: {
            status_open: "영업 중", status_closed: "휴무", status_break: "브레이크타임", status_ended: "영업 종료",
            detail_closed: "오늘 정기 휴무", detail_24h: "24시간 영업 중", detail_ended: "오늘 영업 종료", detail_check: "영업 시간 확인 필요",
            detail_closeAt: (t) => `${t}에 영업 종료`, detail_openAt: (t) => `${t}에 영업 시작`, detail_reopen: (t) => `${t}에 영업 재개`
        },
        en: {
            status_open: "Open", status_closed: "Closed", status_break: "Break Time", status_ended: "Closed",
            detail_closed: "Closed today", detail_24h: "Open 24 hours", detail_ended: "Closed for today", detail_check: "Check hours",
            detail_closeAt: (t) => `Closes at ${t}`, detail_openAt: (t) => `Opens at ${t}`, detail_reopen: (t) => `Reopens at ${t}`
        },
        zh: {
            status_open: "营业中", status_closed: "休息", status_break: "休息时间", status_ended: "已关门",
            detail_closed: "今日定期休息", detail_24h: "24小时营业", detail_ended: "今日已关门", detail_check: "请确认营业时间",
            detail_closeAt: (t) => `${t} 关门`, detail_openAt: (t) => `${t} 开门`, detail_reopen: (t) => `${t} 重新营业`
        },
        ja: {
            status_open: "営業中", status_closed: "休業", status_break: "休憩時間", status_ended: "営業終了",
            detail_closed: "本日定休日", detail_24h: "24時間営業", detail_ended: "本日の営業終了", detail_check: "営業時間確認必要",
            detail_closeAt: (t) => `${t} に営業終了`, detail_openAt: (t) => `${t} に営業開始`, detail_reopen: (t) => `${t} に営業再開`
        }
    };
    const STATUS_TEXT = STATUS_TEXTS.ko;

    const getDayOperatingStatus = (hoursStr, dayIdx, checkNthHoliday = false) => {
        if (!hoursStr) return '정보 없음';
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const targetDayName = dayNames[dayIdx];

        // 1. Nth week holiday check (e.g. "매달 3번째 일요일")
        if (checkNthHoliday) {
            const nthMatch = hoursStr.match(/매달\s*(\d)번째\s*([일월화수목금토])요일/);
            if (nthMatch) {
                const nth = parseInt(nthMatch[1]);
                const hDayName = nthMatch[2];
                if (targetDayName === hDayName) {
                    const today = new Date();
                    if (Math.ceil(today.getDate() / 7) === nth) return '휴무';
                }
            }
        }

        const segments = hoursStr.split('/').map(s => s.trim());
        let resultTime = null;
        let isHoliday = false;

        for (const segment of segments) {
            const daysInSegment = new Set();

            // a. Extract Ranges (e.g. 월-수)
            const rangeRegex = /([일월화수목금토])\s*[~-–—]\s*([일월화수목금토])/g;
            let m;
            while ((m = rangeRegex.exec(segment)) !== null) {
                const start = dayNames.indexOf(m[1]);
                const end = dayNames.indexOf(m[2]);
                if (start <= end) {
                    for (let i = start; i <= end; i++) daysInSegment.add(i);
                } else {
                    for (let i = start; i <= 6; i++) daysInSegment.add(i);
                    for (let i = 0; i <= end; i++) daysInSegment.add(i);
                }
            }

            // b. Extract Standalone Days (excluding those already in range)
            dayNames.forEach((name, idx) => {
                if (segment.includes(name) && !daysInSegment.has(idx)) {
                    // Check if it's not part of a larger word or range (heuristic)
                    const prevChar = segment[segment.indexOf(name) - 1];
                    const nextChar = segment[segment.indexOf(name) + name.length];
                    if (!/[~-–—]/.test(prevChar) && !/[~-–—]/.test(nextChar)) {
                        daysInSegment.add(idx);
                    }
                }
            });

            // If no specific days mentioned, assume it applies to all UNLESS it's a holiday note
            const hasDays = daysInSegment.size > 0;
            const appliesToToday = daysInSegment.has(dayIdx) || (!hasDays && !segment.includes('휴무'));

            if (appliesToToday) {
                if (segment.includes('휴무')) {
                    isHoliday = true;
                } else {
                    const timeMatch = segment.match(/(\d{1,2}:\d{2})\s*[~-–—]\s*(\d{1,2}:\d{2})/);
                    const is24h = segment.includes('24시간');
                    if (timeMatch) resultTime = timeMatch[0];
                    else if (is24h) resultTime = "24시간 영업";
                }
            }
        }

        if (isHoliday) return '휴무';
        return resultTime || '휴무';
    };

    const getOperatingStatus = (hoursStr, t) => {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const dayIdx = now.getDay();

        const statusStr = getDayOperatingStatus(hoursStr, dayIdx, true);

        if (statusStr === '휴무' || statusStr === '휴무 중') {
            return { label: t.status_closed, color: 'closed', detail: t.detail_closed };
        }

        if (statusStr === '24시간 영업' || statusStr === '00:00–24:00') {
            return { label: t.status_open, color: 'open', detail: t.detail_24h };
        }

        const timeMatch = statusStr.match(/(\d{1,2}:\d{2})\s*[~-–—]\s*(\d{1,2}:\d{2})/);
        if (timeMatch) {
            const [_, openStr, closeStr] = timeMatch;
            const [openH, openM] = openStr.split(':').map(Number);
            const [closeH, closeM] = closeStr.split(':').map(Number);
            const openMinutes = openH * 60 + openM;
            const closeMinutes = closeH * 60 + closeM;

            let normalizedClose = closeMinutes;
            if (closeMinutes <= openMinutes) normalizedClose += 1440;

            if (currentMinutes >= openMinutes && currentMinutes < normalizedClose) {
                // Check for break time in the raw string
                const breakMatch = hoursStr.match(/브레이크타임\s*(\d{1,2}:\d{2})\s*[~-–—]\s*(\d{1,2}:\d{2})/);
                if (breakMatch) {
                    const [_, bo, bc] = breakMatch;
                    const bOpen = bo.split(':').map(Number)[0] * 60 + bo.split(':').map(Number)[1];
                    const bClose = bc.split(':').map(Number)[0] * 60 + bc.split(':').map(Number)[1];
                    if (currentMinutes >= bOpen && currentMinutes < bClose) {
                        return { label: t.status_break, color: 'break', detail: t.detail_reopen(bc) };
                    }
                }
                return { label: t.status_open, color: 'open', detail: t.detail_closeAt(closeStr) };
            } else if (currentMinutes < openMinutes) {
                return { label: t.status_ended, color: 'ended', detail: t.detail_openAt(openStr) };
            } else {
                return { label: t.status_ended, color: 'ended', detail: t.detail_ended };
            }
        }

        return { label: t.status_open, color: 'open', detail: t.detail_check };
    };

    // Phone numbers from each store's Kakao Map place (checked 2026-10-11). Only places whose name and
    // 통인시장 address clearly match the store are listed; stores without a match show no 연락처 row.
    const STORE_PHONES = {
        '자미당': '02-735-8787', '삼화식당': '02-735-3967', '개화플로이죵': '010-5433-4417', '부여떡방앗간': '02-735-4171',
        '싱싱과일나라': '02-738-5708', '설야만두': '010-8977-6768', '인왕산건강원': '02-734-9948', '효자동닭꼬치': '010-6336-1490',
        '원조정할머니 기름떡볶이': '02-735-7289', '옛날통인감자탕': '02-735-7296', '반찬하우스': '02-735-5771',
        '원조할머니 기름떡볶이': '02-725-4870', '체부동잔치집': '02-730-5420', '점순이네반찬': '010-8630-2211',
        '반디수블': '070-8877-3355', '육곳간축산물': '02-730-3320', '여주상회': '02-733-9100', '송림사우나': '02-723-1698',
        '피노키오 옷수선': '02-733-3654', '서촌호떡': '010-5416-4736', '엄마손반찬': '010-3922-2643', '명방앗간': '02-364-7774',
        '우리농산물유통': '02-722-3285', '서울수산물회센타': '02-734-4149', '체크인첸킨': '010-2070-1841',
        '티각태각': '010-5237-5823', '서촌의 진심': '02-736-7111', '이레해물칼국수': '02-734-1501', 'BYC': '02-720-1601',
        '손맛김밥': '02-722-8389', '도깨비한과강정': '0502-5552-7446', '알뜰옷수선전문점': '02-736-5435',
        '신일참기름': '02-736-5119', '통인시장흑백사진관': '010-5607-0020', '통인정': '02-737-1713',
        '참괜찬소': '02-733-0398', '뜻밖의 조작가': '010-2603-2388', '인타코 타코야끼': '010-4338-9710',
        '효자지하생선': '02-735-8989'
    };
    const getStorePhone = (name) => STORE_PHONES[name] || '';

    const getStoreIntro = (store) => {
        const name = store.name;
        const cat = store.category;
        const desc = store.shortDesc || store.description || '';
        
        if (name === '통인다방') {
            return "통인시장 안의 로스터리 카페로, 윤경양품 통인다방이라는 이름으로도 알려져 있습니다. 커피와 차, 로스팅 원두를 판매합니다.";
        }
        if (name === '자미당') {
            return "통인시장의 명물로 자리잡은 자미당. 겉은 바삭하고 속은 쫄깃한 명품 꽈배기와 찹쌀도너츠를 선보입니다. 매일 깨끗한 새 기름으로 정성껏 튀겨내어 식어도 맛있는 것이 비결이에요.";
        }
        if (name === '원조정할머니 기름떡볶이' || name === '원조할머니 기름떡볶이') {
            return "통인시장하면 빼놓을 수 없는 기름떡볶이의 원조! 가마솥 뚜껑 같은 무쇠팬에 고추장 양념 및 간장 양념을 지글지글 볶아내어 겉은 바삭하고 속은 쫀득한 특유의 감칠맛을 자랑합니다.";
        }
        if (name === '효자동닭꼬치') {
            return "와인 소스, 치즈, 깻잎 등 독특하고 다양한 토핑과 소스를 얹은 수제 왕닭꼬치 전문점. 통인시장의 긴 줄을 자랑하는 맛집으로, 불맛 가득한 닭꼬치를 맛볼 수 있습니다.";
        }
        if (cat === '식당') {
            return `통인시장에서 사랑받는 대표 식당 ${name}입니다. 정갈하고 든든한 한 끼를 맛볼 수 있으며, 사장님의 따뜻한 손맛과 넉넉한 인심이 담긴 정성스러운 메뉴들을 합리적인 가격에 제공합니다.`;
        } else if (cat === '간식') {
            return `지나칠 수 없는 통인시장의 대표 디저트/간식 명소 ${name}입니다. 입안 가득 즐거움을 선사하는 다채로운 먹거리와 시장 특유의 활기찬 매력을 가득 느끼실 수 있습니다.`;
        } else {
            return `통인시장의 활기를 지탱하는 든든한 동네 상점 ${name}입니다. ${desc || '방문하시는 손님들께 최상의 서비스와 믿을 수 있는 제품들을 선보입니다.'}`;
        }
    };

    root.StoreDetail = {STATUS_TEXT, STATUS_TEXTS, getDayOperatingStatus, getOperatingStatus, getStorePhone, getStoreIntro};
    if (typeof module !== 'undefined') module.exports = root.StoreDetail;
})(typeof window !== 'undefined' ? window : globalThis);
