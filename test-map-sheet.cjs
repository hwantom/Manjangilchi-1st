const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(__dirname + '/map.html', 'utf8');
const make = () => ({style: {}, offsetHeight: 130, scrollTop: 0, classList: {remove() {}, toggle() {}}});
const elements = Object.fromEntries(['sheetSummaryHeader','sheetImageArea','sheetExtendedArea','sheetDetailBody','sheetBottomBar','sheetCloseBtn','sheetLangBar'].map(id => [id, make()]));
const context = vm.createContext({
    window: {innerHeight: 800, innerWidth: 390, matchMedia: () => ({matches: false})},
    detailPanel: {style: {}, querySelector: selector => elements[selector.slice(1)]},
    overlay: make(), document: {getElementById: () => null}, sheetStage: 'HALF',
});
const start = html.indexOf('let sheetEventsController;');
const end = html.indexOf('const handleRoute =', start);
vm.runInContext(html.slice(start, end), context);
for (const [stage,y] of [['COLLAPSED',670],['HALF',384],['EXPANDED',0]]) {
    vm.runInContext(`snapToStage('${stage}')`, context);
    assert.equal(context.detailPanel.style.transform, `translateY(${y}px)`);
    assert.equal(elements.sheetSummaryHeader.style.transform, 'none');
    assert.equal(elements.sheetImageArea.style.transform, 'none');
    assert.equal(context.sheetStage, stage);
}
assert.equal(vm.runInContext('nearestSheetStage(360)', context), 'HALF');
assert.equal(vm.runInContext('nearestSheetStage(140)', context), 'EXPANDED');
assert.equal(vm.runInContext('nearestSheetStage(630)', context), 'COLLAPSED');
assert.equal(vm.runInContext('nearestSheetStage(300, -1)', context), 'EXPANDED');
assert(html.includes('sheetEventsController?.abort()'));
assert(html.includes("addEventListener('touchcancel'"));
const tabs = html.slice(html.indexOf('// Setup Tabs'), html.indexOf('// Render Active Tab Content'));
assert(!tabs.includes('renderDetailPanel()'));
assert(!tabs.includes('snapToStage('));
assert(tabs.includes('translateX('));
global.window = global;
require('./map-i18n');
require('./menu-data');
for (const lang of ['en','zh','ja']) {
    for (const store of Object.values(STORE_MENU_DATA)) for (const item of store.items) {
        assert(!/[가-힣]/.test(MapI18n.text(item.name, lang)), `${lang}: ${item.name}`);
        assert(!/[가-힣]/.test(MapI18n.text(item.price, lang)), `${lang}: ${item.price}`);
        assert(!/[가-힣]/.test(MapI18n.text(item.description, lang)), `${lang}: ${item.description}`);
        assert.equal(MapI18n.text(item.price, lang).match(/\d/g)?.join(''), item.price.match(/\d/g)?.join(''));
    }
    assert(!/[가-힣]/.test(MapI18n.hours('수–일 9:00–19:00 / 정기휴무: 매주 월, 화',lang)));
}
assert.equal(MapI18n.text('카페라떼', 'ko'), '카페라떼');
// Rebinding must remove old handlers. Exercise actual touch paths without RAF delays.
const handlers = new Map();
const listen = (type, fn, options) => {
    if (!handlers.has(type)) handlers.set(type, new Set());
    handlers.get(type).add(fn);
    options.signal.addEventListener('abort', () => handlers.get(type).delete(fn));
};
let now = 0;
Object.assign(context, {
    AbortController,
    performance: {now: () => now},
    getComputedStyle: () => ({transform: context.detailPanel.style.transform}),
    DOMMatrixReadOnly: class { constructor(value) { this.m42 = Number(value.match(/translateY\(([-\d.]+)px\)/)?.[1] || 0); } },
});
context.detailPanel.addEventListener = listen;
context.window.addEventListener = listen;
vm.runInContext('setupBottomSheetEvents(); setupBottomSheetEvents(); snapToStage("HALF");', context);
for (const listeners of handlers.values()) assert.equal(listeners.size, 1);
const target = {closest: selector => selector.includes('sheetSummaryHeader')};
const send = (type,y) => {
    now += 200;
    for (const handler of handlers.get(type)) handler({target, touches: [{clientY:y}], cancelable: true, preventDefault() {}});
};
send('touchstart', 450); send('touchmove', 415); send('touchend', 415);
assert.equal(context.sheetStage, 'HALF');
assert.equal(context.detailPanel.style.transform, 'translateY(384px)');
send('touchstart', 450); send('touchmove', 150); send('touchend', 150);
assert.equal(context.sheetStage, 'EXPANDED');
send('touchstart', 100); send('touchmove', 360); send('touchcancel', 360);
assert.equal(context.sheetStage, 'EXPANDED');
assert.equal(context.detailPanel.style.transform, 'translateY(0px)');
send('touchstart', 100); send('touchmove', 470); send('touchend', 470);
assert.equal(context.sheetStage, 'HALF');
send('touchstart', 400); send('touchmove', 690); send('touchend', 690);
assert.equal(context.sheetStage, 'COLLAPSED');
console.log('Repeated binding, short drag snap-back, expand/collapse, touch cancellation: PASS');
console.log('Three snap positions, nearest/velocity snapping, stable header, isolated tab sliding, all menu names in EN/ZH/JA: PASS');
