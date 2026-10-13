const assert = require('node:assert/strict');
const fs = require('node:fs');
global.window = global;
require('./menu-data.js');
const m = require('./menu-utils.js');
let count = 0;
for (const [name, s] of Object.entries(STORE_MENU_DATA)) {
    const items = m.getItems({name, sheetMenu:s.rawMenu, sheetPrice:s.rawPrice, price:'OLD 999원'});
    assert(items.every(x => x.name && x.price && x.image === ''));
    assert.equal(items.length, s.items.length);
    count += items.length;
}
const row = m.parseCSV('name,메뉴,가격\r\n가게,"김치 400g\n나물 300g","6,000원\n4,000원"')[0];
const items = m.getItems({sheetMenu:row.메뉴, sheetPrice:row.가격});
assert.deepEqual(items.map(x => x.name), ['김치 400g', '나물 300g']);
assert.deepEqual(items.map(x => x.price), ['6,000원', '4,000원']);
assert.equal(m.parseCSV('a,b\n"A""B",C')[0].a, 'A"B');
const jam = STORE_MENU_DATA['자미당'];
assert.equal(m.getItems({name:'자미당', sheetMenu:jam.rawMenu, sheetPrice:jam.rawPrice})[1].price, '2,500원');
const changed = m.getItems({name:'자미당', sheetMenu:'새 메뉴', sheetPrice:'8,000원'});
assert.equal(changed[0].price, '8,000원');
assert.equal(changed[0].name, '새 메뉴');
for (const file of ['index.html','stores.html','markets.html','map.html']) {
    const html = fs.readFileSync(file, 'utf8');
    assert(html.includes('sheetPrice:'));
    assert(html.includes('const parseCSV = StoreMenus.parseCSV;'));
    assert(html.includes('const getStoreMenuItems = StoreMenus.getItems;'));
    if (file === 'map.html') for (const script of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) new Function(script[1]);
}
console.log(`${Object.keys(STORE_MENU_DATA).length} stores / ${count} menu items: PASS`);
for (const name of ['코코로레시피', '참괜찬소', '원조정할머니 기름떡볶이', '원조할머니 기름떡볶이']) {
    const record = STORE_MENU_DATA[name];
    assert.equal(record.sourceType, 'independent-research');
    assert(record.verifiedAddress);
    assert.deepEqual(m.getItems({name, sheetMenu:record.rawMenu, sheetPrice:record.rawPrice}), record.items);
    assert.deepEqual(m.getItems({name, sheetMenu:'관리자 확인 메뉴\n관리자 확인 메뉴 2', sheetPrice:'8,000원\n9,000원'}).map(x => [x.name, x.price]), [['관리자 확인 메뉴','8,000원'], ['관리자 확인 메뉴 2','9,000원']]);
    assert.equal(m.getItems({name, sheetMenu:'관리자 확인 단일 메뉴', sheetPrice:'7,000원'})[0].price, '7,000원');
    for (const item of record.items) {
        assert(item.sourceUrl.startsWith('https://'));
        assert.equal(item.sourceDate, null);
        assert.equal(item.accessedAt, '2026-09-09');
        assert(item.description.includes('갱신일 미표기'));
    }
}
assert.equal(STORE_MENU_DATA['원조정할머니 기름떡볶이'].items.at(-1).price, '12,000원');
assert.equal(STORE_MENU_DATA['원조할머니 기름떡볶이'].items.at(-1).price, '19,000원');
const mapHTML = fs.readFileSync('map.html', 'utf8');
const cards = mapHTML.slice(mapHTML.indexOf('const getStoreMenuCards ='), mapHTML.indexOf('const getStoreMenuItems ='));
assert(!cards.includes('<img'));
assert(!cards.includes('item1'));
console.log('Research overrides, source metadata, distinct stores, image-free preview: PASS');
console.log('Multiline CSV, escaped quotes, price pairing, live updates, page wiring, map syntax: PASS');
