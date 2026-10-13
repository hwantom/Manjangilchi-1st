const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(`${__dirname}/map.html`, 'utf8');
const start = html.indexOf('const renderFilters = () => {');
const end = html.indexOf('const renderLangMenu =', start);
assert(start >= 0 && end > start);
const buttons = ['식당', '간식', '생활형'].map(filterCat => ({dataset: {filterCat}}));
buttons.push({dataset: {filter: 'coin'}}, {dataset: {filter: 'fav'}});
let updates = 0;
const context = vm.createContext({
    window: {}, clearTimeout, setTimeout,
    searchInput: {value: ''}, clearSearchBtn: {classList: {add() {}}},
    currentLang: 'ko', UI_TRANSLATIONS: {ko: {}},
    CATEGORY_STYLES: Object.fromEntries(['식당', '간식', '생활형', '엽전'].map(c => [c, {icon: '', bg: ''}])),
    activeCategories: new Set(), favorites: new Set(['가게']),
    coinFilter: false, favoritesFilter: false,
    filtersContainer: {innerHTML: '', querySelectorAll: () => buttons},
    updateMarkers: () => updates++,
    // Any attempted camera operation fails, including fitBounds or a heading reset.
    map: new Proxy({}, {get() { throw new Error('Filter must not access map camera'); }}),
});
vm.runInContext(html.slice(start, end) + '\nrenderFilters();', context);
for (let i = 0; i < 3; i++) {
    buttons[i].onclick();
    assert.deepEqual([...context.activeCategories], [buttons[i].dataset.filterCat]);
}
buttons[2].onclick();
assert.equal(context.activeCategories.size, 0);
buttons[3].onclick();
assert.equal(context.coinFilter, true);
buttons[4].onclick();
assert.equal(context.favoritesFilter, true);
assert.equal(updates, 6);
console.log('Category switch/reset, coin/favorites filters, marker updates, camera preservation: PASS');

// Run the real filter predicate, visibility update and marker sizing together.
const camera = {getZoom: () => 19};
const classList = () => ({remove() {}, add() {}, toggle() {}});
const stores = [
    {name: '식당점포', category: '식당', coin: 'o'},
    {name: '간식점포', category: '간식', coin: ''},
    {name: '생활점포', category: '생활형', coin: 'o'},
];
const markers = new Map(stores.map(s => [s.name, {
    marker: {map: camera},
    element: {classList: classList(), style: {}},
    label: {style: {}},
}]));
Object.assign(context, {
    map: camera, stores, markers, selectedStore: null, searchQuery: '',
    coinFilter: false, favoritesFilter: false, noResults: null,
    getStoreProp: (store, key) => store[key] || '',
    markerLabelHtml: store => store.name,
});
const predicateStart = html.indexOf('const getFilteredStoreNames =');
const predicateEnd = html.indexOf('// --- UI Rendering ---', predicateStart);
const sizingStart = html.indexOf('const updateMarkerSizes =');
const visibilityEnd = html.indexOf('window.clearAllFilters =', sizingStart);
vm.runInContext(html.slice(predicateStart, predicateEnd) + html.slice(sizingStart, visibilityEnd), context);
const visible = () => [...markers].filter(([, obj]) => obj.marker.map === camera).map(([name]) => name);
for (let i = 0; i < 3; i++) {
    buttons[i].onclick();
    assert.deepEqual(visible(), [stores[i].name]);
}
// Rapid toggles need no animationend event to restore hidden markers.
buttons[2].onclick();
assert.equal(visible().length, 3);
buttons[0].onclick();
buttons[1].onclick();
buttons[0].onclick();
assert.deepEqual(visible(), ['식당점포']);
buttons[0].onclick();
buttons[3].onclick();
assert.deepEqual(visible(), ['식당점포', '생활점포']);
buttons[3].onclick();
assert.equal(visible().length, 3);
console.log('Real marker visibility, category switching, reset, rapid clicks and coin filtering: PASS');

// Deterministic animation tests: no real delays or browser events required.
let timerId = 0;
const timers = new Map();
Object.assign(context, {
    setTimeout: fn => { timers.set(++timerId, fn); return timerId; },
    clearTimeout: id => timers.delete(id),
    getComputedStyle: () => ({opacity: '0.5'}),
});
const animations = [];
for (const obj of markers.values()) obj.element.animate = (frames, options) => {
    const animation = {cancel() { this.cancelled = true; }, frames, options};
    animations.push(animation);
    return animation;
};
buttons[0].onclick();
assert.equal(animations.length, 3);
assert.equal(markers.get('간식점포').element.style.pointerEvents, 'none');
const staleFinish = animations[1].onfinish;
buttons[1].onclick();
staleFinish();
assert.equal(markers.get('간식점포').marker.map, camera);
for (const fn of [...timers.values()]) fn();
assert.deepEqual(visible(), ['간식점포']);
assert.equal(timers.size, 0);
buttons[1].onclick();
for (const animation of animations.filter(a => !a.cancelled)) animation.onfinish();
assert.equal(visible().length, 3);
assert.equal(timers.size, 0);
context.window.matchMedia = () => ({matches: true});
const previousCount = animations.length;
buttons[2].onclick();
assert.deepEqual(visible(), ['생활점포']);
assert.equal(animations.length, previousCount);
console.log('Animated enter/exit, interrupted transitions, timer fallback, reduced motion: PASS');
context.coinFilter = true;
context.favoritesFilter = true;
context.searchQuery = '일치하지 않는 검색';
context.searchInput.value = context.searchQuery;
buttons[2].onclick();
assert.equal(context.activeCategories.size, 0);
assert.equal(context.coinFilter, false);
assert.equal(context.favoritesFilter, false);
assert.equal(context.searchQuery, '');
assert.equal(context.searchInput.value, '');
assert.equal(visible().length, 3);
context.window.matchMedia = () => ({matches: false});
buttons[0].onclick();
buttons[0].onclick();
for (const fn of [...timers.values()]) fn();
assert.equal(visible().length, 3);
assert.equal(context.activeCategories.size, 0);
const pop = animations.find(a => a.frames.length === 4);
assert(pop);
assert.equal(pop.frames[1].scale, '1.16');
assert.equal(pop.frames.at(-1).scale, '1');
assert.equal(timers.size, 0);
console.log('Same-category full reset with combined filters and mid-animation, pop keyframes: PASS');
