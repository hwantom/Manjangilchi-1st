(function(root) {
    const budget = n => Number.isFinite(Number(n)) ? Math.max(0, Math.min(999, Math.floor(Number(n)))) : 0;
    // Which evidence counts for each membership status: a dated visitor payment report, or the team's on-site
    // price-board photos (coins printed on the board, or won converted at 1냥 = 500원).
    const ELIGIBLE = {
        'payment-observed': ['first-person-payment-report'],
        'site-confirmed': ['site-price-board', 'site-won-converted']
    };
    function catalog(data = root.COIN_MENU_DATA) {
        return Object.values(data?.stores || {}).flatMap(store =>
            (store.items || []).filter(item =>
                (ELIGIBLE[store.membershipStatus] || []).includes(item.evidenceType) &&
                item.planningEligible && Number.isSafeInteger(item.coins) && item.coins > 0 &&
                item.sourceDate && (item.sourceUrl || item.sourcePhoto))
                .map(item => ({...item,storeName:store.name})));
    }
    const used = items => items.reduce((sum,item) => sum + item.coins, 0);
    function add(items, id, total, data) {
        const item = catalog(data).find(item => item.id === id);
        if (!item || used(items) + item.coins > budget(total)) return items;
        return [...items,item];
    }
    root.CoinPlanner = {budget,catalog,used,add};
    if (typeof module !== 'undefined') module.exports = root.CoinPlanner;
})(typeof window !== 'undefined' ? window : globalThis);
