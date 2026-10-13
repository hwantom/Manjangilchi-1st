(() => {
    'use strict';
    const $ = id => document.getElementById(id);
    let token = '', stores = [], selected = null, image = '', items = [], busy = false, demo = false, dirty = false;
    const message = (text, error = false) => { $('status').textContent = text; $('status').classList.toggle('error', error); };
    const invalidate = () => { dirty = true; $('reviewed').checked = false; sync(); };
    function sync() {
        $('extract').disabled = busy || !selected || (!image && !demo);
        $('save').disabled = busy || demo || !selected || !items.length || !$('reviewed').checked;
        for (const id of ['add', 'refresh', 'store-select', 'store-search', 'photo', 'reviewed', 'logout', 'access-key', 'demo']) $(id).disabled = busy;
        document.querySelectorAll('#rows input, #rows button, #login-form button').forEach(el => el.disabled = busy);
        $('count').textContent = items.length + '개 메뉴';
        $('empty').hidden = !!items.length;
        $('target-name').textContent = selected?.name || '선택한 점포';
        $('workspace').setAttribute('aria-busy', String(busy));
    }
    async function run(fn) {
        if (busy) return;
        busy = true; sync();
        try { await fn(); } catch (error) { message(error.message, true); }
        finally { busy = false; sync(); }
    }
    async function api(body) {
        const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 90000);
        try {
            const response = await fetch('/.netlify/functions/admin-menu', { method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(body), signal: controller.signal });
            let result;
            try { result = await response.json(); } catch { throw new Error('관리자 서버에 연결할 수 없습니다. 서버 실행 또는 배포 설정을 확인해 주세요.'); }
            if (!response.ok) throw new Error(result.error || '요청에 실패했습니다.');
            return result;
        } catch (error) {
            if (error.name === 'AbortError') throw new Error('응답 시간이 초과되었습니다. 저장 중이었다면 현재 시트 다시 읽기로 반영 여부를 먼저 확인해 주세요.');
            throw error;
        } finally { clearTimeout(timer); }
    }
    function renderStores() {
        const search = $('store-search').value.trim().toLowerCase();
        $('store-select').replaceChildren(new Option('점포를 선택해 주세요', ''));
        stores.forEach((store, index) => {
            if (store === selected || store.name.toLowerCase().includes(search)) $('store-select').add(new Option(store.name, String(index)));
        });
        $('store-select').value = selected ? String(stores.indexOf(selected)) : '';
    }
    function renderOriginal() {
        $('old-menu').value = selected?.menu || '';
        $('old-price').value = selected?.price || '';
        sync();
    }
    function renderRows() {
        $('rows').replaceChildren();
        items.forEach((item, i) => {
            const row = document.createElement('div'); row.className = 'menu-row' + (item.needsReview ? ' flagged' : '');
            for (const [key, title] of [['name', '메뉴명'], ['price', '가격 · 단위 포함']]) {
                const wrap = document.createElement('div'), label = document.createElement('label'), input = document.createElement('input');
                input.id = key + '-' + i; label.htmlFor = input.id; label.textContent = title;
                input.value = item[key]; input.maxLength = key === 'name' ? 150 : 100;
                input.setAttribute('aria-label', (i + 1) + '번 ' + title);
                input.addEventListener('input', () => { item[key] = input.value; invalidate(); });
                wrap.append(label, input); row.append(wrap);
            }
            const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'remove'; remove.textContent = '×'; remove.setAttribute('aria-label', (i + 1) + '번 메뉴 삭제');
            remove.onclick = () => { items.splice(i, 1); invalidate(); renderRows(); }; row.append(remove);
            if (item.needsReview || item.note) { const note = document.createElement('div'); note.className = 'row-note'; note.textContent = (item.needsReview ? '확인 필요 · ' : '') + (item.note || '사진과 직접 비교해 주세요.'); row.append(note); }
            $('rows').append(row);
        });
        sync();
    }
    async function loadStores(preserve = false) {
        const result = await api({ action: 'list' });
        const previous = selected;
        stores = result.stores;
        selected = preserve ? stores.find(s => s.name === previous?.name && s.slug === previous?.slug) || null : null;
        $('connection-text').textContent = result.title + ' / ' + result.tabName;
        renderStores(); renderOriginal();
        if (!result.ocrReady) message('시트는 연결됐습니다. 사진 인식을 사용하려면 서버의 GEMINI_API_KEY 설정이 필요합니다.', true);
        return result;
    }
    $('login-form').onsubmit = event => {
        event.preventDefault();
        run(async () => {
            token = $('access-key').value.trim();
            message('점포 목록을 불러오는 중입니다.');
            try {
                const result = await loadStores();
                $('access-key').value = ''; demo = false;
                $('login').hidden = true; $('workspace').hidden = false; $('logout').hidden = false;
                if (result.ocrReady) message('연결됐습니다. 메뉴를 수정할 점포를 선택해 주세요.');
            } catch (error) { token = ''; throw error; }
        });
    };
    $('store-search').oninput = renderStores;
    $('store-select').onchange = () => {
        const next = $('store-select').value === '' ? null : stores[Number($('store-select').value)];
        if (dirty && !confirm('다른 점포를 선택하면 저장하지 않은 메뉴와 사진이 초기화됩니다. 변경할까요?')) { renderStores(); return; }
        selected = next; items = []; image = ''; dirty = false;
        $('photo').value = ''; $('preview').removeAttribute('src'); $('preview-wrap').hidden = true;
        $('warnings').hidden = true; $('reviewed').checked = false;
        renderOriginal(); renderRows();
    };
    async function preparePhoto(file) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('JPG, PNG, WebP 사진을 선택해 주세요. HEIC는 JPG로 변환한 뒤 올려 주세요.');
        if (file.size > 25 * 1024 * 1024) throw new Error('원본 사진은 25MB 이하로 선택해 주세요.');
        const bitmap = await createImageBitmap(file);
        try {
            const scale = Math.min(1, 2200 / Math.max(bitmap.width, bitmap.height));
            const canvas = document.createElement('canvas'); canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
            const context = canvas.getContext('2d'); context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
            let data = canvas.toDataURL('image/jpeg', .9);
            if (data.length > 4_000_000) data = canvas.toDataURL('image/jpeg', .7);
            if (data.length > 4_000_000) throw new Error('사진이 너무 큽니다. 메뉴판을 나누어 촬영해 주세요.');
            return data;
        } finally { bitmap.close(); }
    }
    $('photo').onchange = () => run(async () => {
        image = ''; $('preview-wrap').hidden = true; $('reviewed').checked = false;
        const file = $('photo').files[0]; if (!file) return;
        if (demo) { message('샘플 체험에서는 실제 사진을 전송하지 않습니다. 샘플 인식 버튼을 사용해 주세요.'); return; }
        message('사진을 준비하는 중입니다.');
        image = await preparePhoto(file); $('preview').src = image; $('photo-name').textContent = file.name; $('preview-wrap').hidden = false;
        message('사진이 준비됐습니다. 메뉴·가격 인식하기를 눌러 주세요.');
    });
    $('extract').onclick = () => run(async () => {
        message('메뉴판을 읽고 있습니다. 잠시 기다려 주세요.');
        const result = demo ? {
            detectedStore: '자미당', warnings: ['체험용 결과입니다. 실제 사진 인식은 관리자 접속 후 사용할 수 있습니다.'],
            items: ['꽈배기 3개', '찹쌀도너츠 3개', '팥도너츠', '핫도그', '치즈핫도그'].map((name, i) => ({ name, price: i === 2 || i === 3 ? '2,000원' : '2,500원', needsReview: false, note: '' }))
        } : await api({ action: 'extract', image });
        if (items.length + result.items.length > 150) throw new Error('메뉴는 최대 150개입니다. 현재 목록을 정리해 주세요.');
        items.push(...result.items);
        const warnings = [...result.warnings];
        if (result.detectedStore && result.detectedStore.replace(/\s/g, '') !== selected.name.replace(/\s/g, '')) warnings.unshift('사진 속 상호: ' + result.detectedStore + ' / 선택한 점포: ' + selected.name + '. 같은 점포인지 확인해 주세요.');
        if (!result.items.length) warnings.push('읽을 수 있는 메뉴가 없습니다. 선명한 사진을 다시 올려 주세요.');
        $('warnings').textContent = warnings.join('\n'); $('warnings').hidden = !warnings.length;
        invalidate(); renderRows();
        message(result.items.length + '개 메뉴를 인식했습니다. 사진과 비교한 뒤 저장해 주세요.');
    });
    $('add').onclick = () => { if (items.length >= 150) return message('메뉴는 최대 150개입니다.', true); items.push({ name: '', price: '', needsReview: false, note: '' }); invalidate(); renderRows(); $('name-' + (items.length - 1)).focus(); };
    $('reviewed').onchange = sync;
    $('refresh').onclick = () => run(async () => {
        if (demo) return message('체험용 원본입니다. 실제 시트에는 연결되지 않습니다.');
        await loadStores(true); $('reviewed').checked = false; message('현재 시트 내용을 다시 읽었습니다. 검토 중인 목록과 비교해 주세요.'); $('existing').open = true;
    });
    $('save').onclick = () => run(async () => {
        if (demo || !selected || !$('reviewed').checked) return;
        if (items.some(x => !x.name.trim() || !x.price.trim())) throw new Error('빈 메뉴명이나 가격이 있습니다. 읽을 수 없는 가격은 확인 후 입력해 주세요.');
        message(selected.name + ' 메뉴를 저장하고 있습니다.');
        const result = await api({ action: 'save', store: { name: selected.name, slug: selected.slug }, version: selected.version, reviewed: true, items: items.map(({ name, price }) => ({ name, price })) });
        dirty = false; $('reviewed').checked = false;
        selected.menu = result.menu; selected.price = result.price; selected.version = ''; renderOriginal();
        message(result.name + ' 메뉴 ' + result.count + '개를 저장했습니다. 고객 화면은 새로고침 후 확인해 주세요.');
        try { await loadStores(true); } catch { message('저장은 완료됐습니다. 목록 갱신에 실패했으니 다음 저장 전에 현재 시트 다시 읽기를 눌러 주세요.'); }
    });
    $('logout').onclick = () => { if (dirty && !confirm('저장하지 않은 내용이 있습니다. 접속을 종료할까요?')) return; dirty = false; token = ''; location.href = 'admin-menu.html'; };
    $('demo').onclick = () => {
        demo = true; stores = [{ name: '자미당', slug: 'sample', menu: '꽈배기 3개\n찹쌀도너츠 3개', price: '2,500원\n2,500원', version: 'sample' }]; selected = stores[0];
        $('login').hidden = true; $('workspace').hidden = false; $('logout').hidden = false; $('demo-banner').hidden = false; $('sample-photo').hidden = false;
        $('connection-text').textContent = '샘플 체험 · 실제 시트 연결 없음'; $('extract').textContent = '샘플 메뉴 인식 결과 보기';
        renderStores(); renderOriginal(); renderRows(); message('샘플 메뉴로 검토 화면을 체험해 보세요. 실제 시트에는 저장되지 않습니다.');
    };
    window.addEventListener('beforeunload', event => { if (dirty && !demo) { event.preventDefault(); event.returnValue = ''; } });
})();
