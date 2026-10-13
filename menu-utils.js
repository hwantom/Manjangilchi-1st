(function (root) {
    // Preserve quoted newlines and escaped quotes in Google Sheets CSV exports.
    function parseCSV(text) {
        const rows = []; let row = [], cell = '', quoted = false;
        text = text.replace(/^\uFEFF/, '');
        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            if (c === '"') {
                if (quoted && text[i + 1] === '"') { cell += '"'; i++; }
                else quoted = !quoted;
            } else if (c === ',' && !quoted) { row.push(cell.trim()); cell = ''; }
            else if ((c === '\n' || c === '\r') && !quoted) {
                if (c === '\r' && text[i + 1] === '\n') i++;
                row.push(cell.trim()); if (row.some(Boolean)) rows.push(row);
                row = []; cell = '';
            } else cell += c;
        }
        row.push(cell.trim()); if (row.some(Boolean)) rows.push(row);
        const header = rows.shift() || [];
        return rows.map(values => Object.fromEntries(header.map((key, i) => [key, values[i] || ''])));
    }
    const lines = value => String(value || '').split(/\r?\n|[|;]/).map(s => s.trim()).filter(Boolean);
    const item = (name, price, description = '') => ({name, price: price || '가격 확인 필요', description, image: ''});
    function parseItem(value) {
        const m = value.match(/^(.*?)\s*[:：]?\s*((?:\d[\d,]*(?:~[\d,]+)?\s*원(?:~|부터)?|\d[\d,]*만(?:원)?|\d[\d,]{2,})(?:\s*\([^)]*\))?)$/);
        if (!m || !m[1].trim()) return item(value, '가격 확인 필요');
        return item(m[1].trim(), /^\d[\d,]*$/.test(m[2]) ? Number(m[2].replace(/,/g, '')).toLocaleString('en-US') + '원' : m[2]);
    }
    function getItems(store) {
        const menu = store.sheetMenu || '', price = store.sheetPrice || '';
        const snapshot = (root.STORE_MENU_DATA || {})[store.name];
        // An edited, explicitly paired sheet menu is authoritative, including admin photo imports.
        // Keep historical research only while the original sheet snapshot is unchanged/unstructured.
        if (menu && price && (!snapshot || snapshot.rawMenu !== menu || snapshot.rawPrice !== price)) {
            const names = lines(menu), prices = lines(price);
            if (names.length && names.length === prices.length) return names.map((name, i) => item(name, prices[i]));
        }
        if (snapshot?.sourceType === 'independent-research') return snapshot.items;
        if (menu && snapshot && snapshot.rawMenu === menu && snapshot.rawPrice === price) return snapshot.items;
        if (menu) {
            const names = lines(menu), prices = lines(price);
            if (names.length === prices.length) return names.map((name, i) => item(name, prices[i]));
            if (names.length > 1 && prices.length === 1 && !/\d/.test(price)) return names.map(name => item(name, price));
            return names.map(name => {
                const parsed = parseItem(name);
                return parsed.price !== '가격 확인 필요' ? parsed : item(name, '가격 확인 필요');
            });
        }
        const legacy = lines(store.menu || '').filter(v => !/^[\d,]+$/.test(v)).map(parseItem);
        if (store.price) legacy.push(...lines(store.price).map(parseItem));
        const seen = new Set();
        const items = legacy.filter(entry => {
            const key = entry.name.replace(/[\s()]/g, '');
            if (seen.has(key)) return false; seen.add(key); return true;
        });
        return items.length ? items : [item(store.description || store.shortDesc || '상품·서비스', '점포 문의')];
    }
    const escapeHTML = value => String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
    root.StoreMenus = {parseCSV, getItems, escapeHTML};
    if (typeof module !== 'undefined') module.exports = root.StoreMenus;
})(typeof window !== 'undefined' ? window : globalThis);
