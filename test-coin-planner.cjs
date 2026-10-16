const assert = require('node:assert/strict');
global.window = global;
require('./coin-menu-data');
const planner = require('./coin-planner');
assert.equal(COIN_MENU_DATA.defaultBudget, 0);
assert.equal(Object.keys(COIN_MENU_DATA.stores).length, 80);
assert.equal(COIN_MENU_DATA.surveyedStoreCount, 80);
assert.equal(COIN_MENU_DATA.currentOfficialVerificationComplete, false);
assert.equal(planner.catalog().length, 60);
assert.equal(planner.budget(-2), 0);
assert.equal(planner.budget('bad'), 0);
assert.equal(planner.budget(5.8), 5);
let cart = [];
const byId = id => planner.catalog().find(item => item.id === id);
const first = byId('hyoja-wine-cheese-coin'), second = byId('wonjojung-gochujang-coin');
assert.equal(first.coins + second.coins, 13);
assert.equal(planner.add(cart,first.id,0),cart);
cart = planner.add(cart,first.id,13);
cart = planner.add(cart,second.id,13);
assert.equal(planner.used(cart),13);
assert.equal(planner.add(cart,first.id,13),cart);
assert.equal(planner.add([], 'sonmat-mini-coin-pending', 100).length,0);
assert.equal(planner.add([], 'unknown', 100).length,0);
const tampered = structuredClone(COIN_MENU_DATA);
tampered.stores[first.storeName].membershipStatus='unverified';
assert(!planner.catalog(tampered).some(item=>item.id===first.id));
const ELIGIBLE = {'payment-observed': ['first-person-payment-report'], 'site-confirmed': ['site-price-board', 'site-won-converted']};
for (const item of planner.catalog()) {
    const store = COIN_MENU_DATA.stores[item.storeName];
    assert(ELIGIBLE[store.membershipStatus].includes(item.evidenceType), item.id);
    assert(item.sourceDate, item.id);
    if (item.evidenceType === 'first-person-payment-report') assert(item.sourceUrl && item.visitDate, item.id);
    else assert(/^KakaoTalk_20261015_164017606(_\d{2})?\.jpg$/.test(item.sourcePhoto), item.id);
    // won-only boards: 1냥 = 500원, and the original won price is kept
    if (item.evidenceType === 'site-won-converted') assert.equal(item.coins * 500, item.priceKrw, item.id);
}
assert.equal(new Set(planner.catalog().map(item => item.id)).size, planner.catalog().length);
assert.equal(byId('site-jg-tteokbokki').coins, 9);
assert.equal(byId('site-intaco-takoyaki-2').coins, 3);
assert.equal(COIN_MENU_DATA.stores['송림사우나'].membershipStatus, 'confirmed-non-member');
for (const name of ['송림사우나', '명방앗간']) assert(!planner.catalog().some(item => item.storeName === name), name);
const fs = require('node:fs');
for (const file of ['index.html','stores.html','markets.html']) {
    const html=fs.readFileSync(__dirname+'/'+file,'utf8');
    assert(html.includes('useState(0)'));
    assert(html.includes("if (subView !== 'FACILITIES') return <LunchboxPlanner"));
    assert(html.includes('COIN_MENU_DATA.guide'));
    assert(!html.includes('application/x-tongin-menu'), 'drag-and-drop was replaced by tap-to-add');
    assert(html.includes('coin-menu-data.js'));
}
const guide = COIN_MENU_DATA.guide;
assert.equal(guide.coinPriceKrw, 500);
assert.equal(guide.bundleSize * guide.coinPriceKrw, guide.bundlePriceKrw);
assert(guide.sources.length && guide.sources.every(s => s.url.startsWith('https://')));
assert(guide.cafeExtras.every(x => Number.isSafeInteger(x.coins) && x.coins > 0));
assert(!planner.catalog().some(item => guide.cafeExtras.some(x => x.id === item.id)), 'cafe rice/soup stays out of the verified catalog');
console.log('0-coin budget, explicit evidence gate, unaffordable/unknown rejection, totals, page wiring: PASS');
const audit = require('./coin-research-audit.json');
assert.equal(audit.records.length, 80);
assert.equal(new Set(audit.records.map(r=>r.name)).size, 80);
for (const record of audit.records) {
    assert(record.searchQueries.length > 0, record.name);
    assert(COIN_MENU_DATA.stores[record.name], record.name);
    assert.equal(record.currentMembership, 'unverified');
    for (const item of COIN_MENU_DATA.stores[record.name].items) {
        if (!item.planningEligible) assert.equal(planner.add([], item.id, 999).length, 0);
    }
}
console.log('80-store audit coverage, unique names, current-verification distinction, pending-price exclusion: PASS');
