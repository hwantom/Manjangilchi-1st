const assert = require('node:assert/strict');
global.window = global;
require('./coin-menu-data');
const planner = require('./coin-planner');
assert.equal(COIN_MENU_DATA.defaultBudget, 0);
assert.equal(Object.keys(COIN_MENU_DATA.stores).length, 80);
assert.equal(COIN_MENU_DATA.surveyedStoreCount, 80);
assert.equal(COIN_MENU_DATA.currentOfficialVerificationComplete, false);
assert.equal(planner.catalog().length, 2);
assert.equal(planner.budget(-2), 0);
assert.equal(planner.budget('bad'), 0);
assert.equal(planner.budget(5.8), 5);
let cart = [];
const [first,second] = planner.catalog();
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
for (const item of planner.catalog()) {
    assert.equal(item.evidenceType,'first-person-payment-report');
    assert(item.sourceDate && item.sourceUrl && item.visitDate);
}
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
