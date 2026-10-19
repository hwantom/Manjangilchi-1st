// UI strings for the 매장 tab, store modal, 엽전도시락 planner and 편의시설 page, per language (ko/en/zh/ja).
// Labels copied from the map's detail panel are translated with MapI18n instead, so both pages match.
(function (root) {
    const ko = {
        heroTitle: '통인시장', heroSub: '예술과 문화가 공존하는 전통시장',
        cat: { '식당': '식당', '간식': '간식', '생활형': '생활형' },
        viewLocation: '위치 보기', detailsFallback: '상세보기',
        favorites: n => `즐겨찾기 (${n})`,
        correctionLink: '정보가 다른가요? 수정 요청하기', correctionFooter: '정보 수정 요청',
        storesTitle: '통인시장 매장', storesSub: n => `통인시장의 모든 점포를 한눈에 둘러보세요 (${n}개)`,
        noResultTitle: '검색 조건에 맞는 점포가 없습니다', noResultDesc: '카테고리를 바꾸거나 다른 단어로 검색해보세요.', showAllStores: '전체 점포 보기',
        share: '공유하기', favorite: '즐겨찾기', routeOnMap: '지도에서 길찾기', close: '닫기', linkCopied: '링크가 복사되었습니다!',
        plannerTitle: '엽전도시락 미리 짜보기', plannerSub: '엽전 수를 정하고 담을 메뉴를 골라 보세요. 구매·예약은 되지 않아요.',
        barMenus: n => `🍱 담은 메뉴 ${n}개`, remainingLabel: '남은 엽전', coinUnit: '개',
        budgetLabel: '보유 엽전', budgetWon: (won, left) => `= ${won}원 · 남은 엽전 ${left}개`,
        decCoin: '엽전 1개 줄이기', incCoin: '엽전 1개 늘리기', trayAria: '나의 엽전 도시락', slotsAria: '도시락 칸', trayEmpty: '메뉴를 담아 보세요',
        removeOne: name => `${name} 1개 빼기`, overflow: n => `칸에 다 안 보이는 메뉴 ${n}종이 더 있어요.`,
        clearAll: '모두 비우기', msgCleared: '도시락을 비웠어요.', msgAdded: name => `${name} 담았어요.`,
        msgSetFirst: '먼저 보유 엽전 수를 정해 주세요.', msgShort: n => `엽전이 ${n}개 부족해요.`, msgCantReduce: '담은 메뉴를 먼저 빼야 엽전 수를 줄일 수 있어요.',
        verifiedTitle: '가격이 확인된 메뉴', coinSearchPlaceholder: '매장명이나 메뉴로 검색', coinSearchEmpty: '검색 결과가 없어요. 다른 단어로 찾아보세요.', coinSearchCount: (s, m) => `매장 ${s}곳 · 메뉴 ${m}개`, storeMeta: (cat, n, from) => `${cat ? cat + ' · ' : ''}메뉴 ${n}개 · 엽전 ${from}개부터`,
        coins: n => `${n}개`, convertedFrom: won => `${won}원 기준 환산`, add: '담기', addAria: name => `${name} 담기`, short: n => `${n}개 부족`, storeInfo: '가게 정보 보기',
        refTitle: '가격 기록만 있는 메뉴', refExcluded: '(계산 제외)', refDesc: '오래됐거나 날짜를 확인하지 못한 기록이에요. 현장에서 물어보고 사 보세요.',
        refDate: d => `${d} 기록`, refNoDate: '기록 날짜 미확인', source: '자료', approx: n => `약 ${n}개`,
        researchSummary: (total, n) => `조사한 점포 ${total}곳 중 추가 확인이 필요한 ${n}곳`,
        researchNote: d => `${d} 공개자료 검색 결과입니다. 확정 가맹점 목록이 아니며, 자료를 찾지 못한 점포도 비가맹으로 단정하지 않습니다.`,
        researchSource: '조사 근거',
        guideAria: '엽전도시락 이용 정보', guideTitle: '가기 전에 확인하세요',
        gPrice: '가격', gPriceValue: (coin, size, bundle) => `엽전 1개 ${coin}원 · ${size}개 묶음 ${bundle}원`,
        gPlace: '구매처', gHours: '운영', gClosed: '휴무', gRefund: '남은 엽전',
        gCall: phone => `방문 전 전화로 확인하기 ${phone}`, gSources: d => `공개 자료 기준(${d} 확인) · 운영 정보는 바뀔 수 있어요 · `,
        guide: null, // Korean guide text lives in COIN_MENU_DATA.guide
        facTitle: '통인시장 편의시설 안내', facSub: '화장실, 주차장, 고객만족센터 위치를 확인하세요',
        restroomName: '도시락카페 🚻', restroomDesc: '고객만족센터 화장실 · 시설개선 공사 중(2026.9.29~2027.1.30 예정)이라 이용이 어려울 수 있어요',
        parkingName: '신교 공영주차장', parkingDesc: '도보 5분 · 5분당 250원', naverMap: '네이버 지도'
    };

    const en = {
        heroTitle: 'Tongin Market', heroSub: 'A traditional market where art and culture meet',
        cat: { '식당': 'Restaurant', '간식': 'Snacks', '생활형': 'Lifestyle' }, // same as map.html cat_* labels
        viewLocation: 'View location', detailsFallback: 'Details',
        favorites: n => `Favorites (${n})`,
        correctionLink: 'Something wrong? Suggest an edit', correctionFooter: 'Suggest an edit',
        storesTitle: 'Tongin Market Shops', storesSub: n => `Browse every shop in Tongin Market (${n})`,
        noResultTitle: 'No shops match your search', noResultDesc: 'Try another category or search word.', showAllStores: 'Show all shops',
        share: 'Share', favorite: 'Favorite', routeOnMap: 'Directions on map', close: 'Close', linkCopied: 'Link copied!',
        plannerTitle: 'Plan your Yeopjeon Lunchbox', plannerSub: 'Set your coins and pick dishes. This is a planner only — nothing is bought or booked.',
        barMenus: n => `🍱 ${n} ${n === 1 ? 'dish' : 'dishes'}`, remainingLabel: 'Coins left', coinUnit: '',
        budgetLabel: 'My coins', budgetWon: (won, left) => `= ₩${won} · ${left} left`,
        decCoin: 'One fewer coin', incCoin: 'One more coin', trayAria: 'My Yeopjeon lunchbox', slotsAria: 'Lunchbox compartments', trayEmpty: 'Add dishes',
        removeOne: name => `Remove one ${name}`, overflow: n => `${n} more ${n === 1 ? 'dish doesn’t' : 'dishes don’t'} fit in the box.`,
        clearAll: 'Clear all', msgCleared: 'Lunchbox cleared.', msgAdded: name => `Added ${name}.`,
        msgSetFirst: 'Set how many coins you have first.', msgShort: n => `You need ${n} more ${n === 1 ? 'coin' : 'coins'}.`, msgCantReduce: 'Remove dishes before lowering your coins.',
        verifiedTitle: 'Dishes with confirmed prices', coinSearchPlaceholder: 'Search shops or dishes', coinSearchEmpty: 'No results. Try another word.', coinSearchCount: (s, m) => `${s} ${s === 1 ? 'shop' : 'shops'} · ${m} ${m === 1 ? 'dish' : 'dishes'}`, storeMeta: (cat, n, from) => `${cat ? cat + ' · ' : ''}${n} ${n === 1 ? 'dish' : 'dishes'} · from ${from} coins`,
        coins: n => `${n}`, convertedFrom: won => `Converted from ₩${won}`, add: 'Add', addAria: name => `Add ${name}`, short: n => `${n} short`, storeInfo: 'Shop details',
        refTitle: 'Dishes with price reports only', refExcluded: '(not counted)', refDesc: 'These reports are old or undated. Ask at the shop before buying.',
        refDate: d => `Reported ${d}`, refNoDate: 'Date unknown', source: 'Source', approx: n => `~${n} coins`,
        researchSummary: (total, n) => `${n} of ${total} surveyed shops need more checking`,
        researchNote: d => `Results of a public-source search on ${d}. This is not a confirmed member list, and shops without records are not assumed to be non-members. Notes are in Korean.`,
        researchSource: 'Source',
        guideAria: 'Yeopjeon Lunchbox info', guideTitle: 'Check before you go',
        gPrice: 'Price', gPriceValue: (coin, size, bundle) => `1 coin ₩${coin} · bundle of ${size} ₩${bundle}`,
        gPlace: 'Buy at', gHours: 'Hours', gClosed: 'Closed', gRefund: 'Leftovers',
        gCall: phone => `Call before visiting ${phone}`, gSources: d => `Based on public sources (checked ${d}) · details may change · `,
        guide: {
            purchasePlace: 'Tongin Delivery Center (pop-up) — moved during customer-center renovation (Sep 29, 2026 – Jan 30, 2027, planned)',
            hours: [{label: 'Weekdays', open: '11:00–16:00', coinSales: 'coins sold until 15:00'}, {label: 'Weekends', open: '11:00–17:00', coinSales: 'coins sold until 16:00'}],
            closed: 'Every Monday and the 3rd Sunday of the month (market notice)',
            refund: 'Leftover coins can reportedly be refunded. Ask on site about conditions for each payment method.',
            sourceLabels: ['Seoul Media Hub 2025.05', 'Mom-mom 2025.04', 'Visit blog 2026.02', 'Contact number', 'Market notice 2026.10']
        },
        facTitle: 'Tongin Market Facilities', facSub: 'Find restrooms, parking and the customer center',
        restroomName: 'Dosirak Cafe 🚻', restroomDesc: 'Customer center restrooms · may be unavailable during renovation (Sep 29, 2026 – Jan 30, 2027, planned)',
        parkingName: 'Singyo Public Parking', parkingDesc: '5 min walk · ₩250 per 5 min', naverMap: 'Naver Map'
    };

    const zh = {
        heroTitle: '通仁市场', heroSub: '艺术与文化共存的传统市场',
        cat: { '식당': '美食店', '간식': '零食点心', '생활형': '生活用品' },
        viewLocation: '查看位置', detailsFallback: '查看详情',
        favorites: n => `收藏 (${n})`,
        correctionLink: '信息有误？申请修改', correctionFooter: '申请修改信息',
        storesTitle: '通仁市场店铺', storesSub: n => `一览通仁市场所有店铺（${n}家）`,
        noResultTitle: '没有符合条件的店铺', noResultDesc: '请更换分类或搜索词。', showAllStores: '查看全部店铺',
        share: '分享', favorite: '收藏', routeOnMap: '在地图上导航', close: '关闭', linkCopied: '链接已复制！',
        plannerTitle: '预先搭配铜钱便当', plannerSub: '设定铜钱数量并挑选菜品。这里仅供规划，不能购买或预约。',
        barMenus: n => `🍱 已选 ${n} 道`, remainingLabel: '剩余铜钱', coinUnit: '枚',
        budgetLabel: '持有铜钱', budgetWon: (won, left) => `= ${won}韩元 · 剩余${left}枚`,
        decCoin: '减少1枚铜钱', incCoin: '增加1枚铜钱', trayAria: '我的铜钱便当', slotsAria: '便当格', trayEmpty: '请添加菜品',
        removeOne: name => `移除1份${name}`, overflow: n => `还有${n}种菜品放不进格子。`,
        clearAll: '全部清空', msgCleared: '便当已清空。', msgAdded: name => `已添加${name}。`,
        msgSetFirst: '请先设置持有的铜钱数量。', msgShort: n => `还差${n}枚铜钱。`, msgCantReduce: '请先移除菜品再减少铜钱。',
        verifiedTitle: '已确认价格的菜品', coinSearchPlaceholder: '搜索店铺或菜品', coinSearchEmpty: '没有搜索结果，请换个词试试。', coinSearchCount: (s, m) => `${s}家店铺 · ${m}道菜品`, storeMeta: (cat, n, from) => `${cat ? cat + ' · ' : ''}${n}道菜 · ${from}枚起`,
        coins: n => `${n}枚`, convertedFrom: won => `按${won}韩元换算`, add: '添加', addAria: name => `添加${name}`, short: n => `差${n}枚`, storeInfo: '查看店铺信息',
        refTitle: '仅有价格记录的菜品', refExcluded: '（不计入）', refDesc: '这些记录较旧或日期不明，请在现场确认后购买。',
        refDate: d => `${d}记录`, refNoDate: '日期未确认', source: '资料', approx: n => `约${n}枚`,
        researchSummary: (total, n) => `调查的${total}家店铺中有${n}家需进一步确认`,
        researchNote: d => `${d}公开资料检索结果。这不是确定的加盟店名单，未找到资料的店铺也不认定为非加盟店。备注为韩文。`,
        researchSource: '调查依据',
        guideAria: '铜钱便当使用信息', guideTitle: '出发前请确认',
        gPrice: '价格', gPriceValue: (coin, size, bundle) => `1枚${coin}韩元 · ${size}枚一组${bundle}韩元`,
        gPlace: '购买地点', gHours: '营业', gClosed: '休息', gRefund: '剩余铜钱',
        gCall: phone => `出发前电话确认 ${phone}`, gSources: d => `依据公开资料（${d}确认）· 运营信息可能变动 · `,
        guide: {
            purchasePlace: '通仁配送中心（快闪店）——顾客中心施工期间临时搬迁（2026.9.29~2027.1.30 预计）',
            hours: [{label: '工作日', open: '11:00–16:00', coinSales: '铜钱售卖至15:00'}, {label: '周末', open: '11:00–17:00', coinSales: '铜钱售卖至16:00'}],
            closed: '每周一及每月第三个周日（市场公告）',
            refund: '据介绍剩余铜钱可以退款，不同支付方式的条件请在现场确认。',
            sourceLabels: ['首尔市媒体中心 2025.05', 'Mom-mom 2025.04', '探访博客 2026.02', '咨询电话', '市场公告 2026.10']
        },
        facTitle: '通仁市场便利设施', facSub: '查看洗手间、停车场和顾客服务中心位置',
        restroomName: '便当咖啡馆 🚻', restroomDesc: '顾客服务中心洗手间 · 设施改造施工期间（2026.9.29~2027.1.30 预计）可能无法使用',
        parkingName: '新桥公营停车场', parkingDesc: '步行5分钟 · 每5分钟250韩元', naverMap: 'Naver 地图'
    };

    const ja = {
        heroTitle: '通仁市場', heroSub: 'アートと文化が共存する伝統市場',
        cat: { '식당': '食堂', '간식': '軽食・カフェ', '생활형': '生活・雑貨' },
        viewLocation: '位置を見る', detailsFallback: '詳細を見る',
        favorites: n => `お気に入り (${n})`,
        correctionLink: '情報が違いますか？修正をリクエスト', correctionFooter: '情報の修正依頼',
        storesTitle: '通仁市場のお店', storesSub: n => `通仁市場の全店舗を一覧できます（${n}店）`,
        noResultTitle: '条件に合うお店がありません', noResultDesc: 'カテゴリや検索語を変えてみてください。', showAllStores: 'すべてのお店を見る',
        share: '共有', favorite: 'お気に入り', routeOnMap: '地図で道案内', close: '閉じる', linkCopied: 'リンクをコピーしました！',
        plannerTitle: 'ヨプジョン弁当を組んでみる', plannerSub: 'ヨプジョンの枚数を決めて料理を選びましょう。購入・予約はできません。',
        barMenus: n => `🍱 ${n}品`, remainingLabel: '残りヨプジョン', coinUnit: '枚',
        budgetLabel: '手持ちヨプジョン', budgetWon: (won, left) => `= ${won}ウォン · 残り${left}枚`,
        decCoin: 'ヨプジョンを1枚減らす', incCoin: 'ヨプジョンを1枚増やす', trayAria: 'わたしのヨプジョン弁当', slotsAria: '弁当の区画', trayEmpty: '料理を入れてみよう',
        removeOne: name => `${name}を1つ減らす`, overflow: n => `区画に入りきらない料理があと${n}種類あります。`,
        clearAll: 'すべて空にする', msgCleared: '弁当を空にしました。', msgAdded: name => `${name}を入れました。`,
        msgSetFirst: 'まず手持ちのヨプジョンの枚数を決めてください。', msgShort: n => `ヨプジョンが${n}枚足りません。`, msgCantReduce: '先に料理を外してから枚数を減らしてください。',
        verifiedTitle: '価格が確認できた料理', coinSearchPlaceholder: 'お店やメニューで検索', coinSearchEmpty: '検索結果がありません。別の言葉で探してみてください。', coinSearchCount: (s, m) => `${s}店 · ${m}品`, storeMeta: (cat, n, from) => `${cat ? cat + ' · ' : ''}${n}品 · ${from}枚から`,
        coins: n => `${n}枚`, convertedFrom: won => `${won}ウォンから換算`, add: '入れる', addAria: name => `${name}を入れる`, short: n => `${n}枚不足`, storeInfo: 'お店の情報',
        refTitle: '価格の記録だけある料理', refExcluded: '（計算対象外）', refDesc: '古いか日付不明の記録です。お店で確認してから購入してください。',
        refDate: d => `${d}の記録`, refNoDate: '日付不明', source: '出典', approx: n => `約${n}枚`,
        researchSummary: (total, n) => `調査した${total}店のうち追加確認が必要な${n}店`,
        researchNote: d => `${d}の公開資料の検索結果です。確定した加盟店リストではなく、資料が見つからないお店も非加盟とは判断していません。メモは韓国語です。`,
        researchSource: '調査根拠',
        guideAria: 'ヨプジョン弁当の利用案内', guideTitle: '行く前に確認',
        gPrice: '料金', gPriceValue: (coin, size, bundle) => `1枚${coin}ウォン · ${size}枚セット${bundle}ウォン`,
        gPlace: '購入場所', gHours: '営業', gClosed: '休業', gRefund: '残ったヨプジョン',
        gCall: phone => `訪問前に電話で確認 ${phone}`, gSources: d => `公開資料に基づく（${d}確認）· 営業情報は変わる場合があります · `,
        guide: {
            purchasePlace: '通仁配送センター（ポップアップストア）— お客様センター工事のため臨時移転（2026.9.29〜2027.1.30予定）',
            hours: [{label: '平日', open: '11:00–16:00', coinSales: 'ヨプジョン販売は15:00まで'}, {label: '週末', open: '11:00–17:00', coinSales: 'ヨプジョン販売は16:00まで'}],
            closed: '毎週月曜日と第3日曜日（市場の案内）',
            refund: '残ったヨプジョンは払い戻しできるとの案内があります。支払い方法ごとの条件は現地で確認してください。',
            sourceLabels: ['ソウル市メディアハブ 2025.05', 'Mom-mom 2025.04', '訪問ブログ 2026.02', '問い合わせ番号', '市場の案内 2026.10']
        },
        facTitle: '通仁市場の施設案内', facSub: 'トイレ・駐車場・お客様センターの場所を確認',
        restroomName: '弁当カフェ 🚻', restroomDesc: 'お客様センターのトイレ · 改修工事中（2026.9.29〜2027.1.30予定）のため利用できない場合があります',
        parkingName: '新橋公営駐車場', parkingDesc: '徒歩5分 · 5分ごとに250ウォン', naverMap: 'NAVERマップ'
    };

    const UI_TEXT = {ko, en, zh, ja};
    // Sheet columns use _eng/_cn/_jp suffixes for translated store fields.
    const SHEET_SUFFIX = {en: 'eng', zh: 'cn', ja: 'jp'};
    function storeText(store, prop, lang) {
        if (!store) return '';
        const field = prop === 'shortDesc' ? 'description' : prop;
        const base = store[field] || '';
        if (lang === 'ko' || !SHEET_SUFFIX[lang]) return base;
        const translated = store[`${field}_${SHEET_SUFFIX[lang]}`];
        if (translated) return translated;
        if (prop === 'hours' && root.MapI18n) return root.MapI18n.hours(base, lang);
        if (prop === 'price' && root.MapI18n) return root.MapI18n.text(base, lang);
        return base;
    }
    root.UiText = {UI_TEXT, storeText, get: lang => UI_TEXT[lang] || ko};
    if (typeof module !== 'undefined') module.exports = root.UiText;
})(typeof window !== 'undefined' ? window : globalThis);
