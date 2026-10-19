// "정보 수정 요청" dialog shared by every page. Any element with data-correction-target opens it.
// Submissions go to the Netlify form "correction" (registered by the hidden static form in index.html);
// local-server.js accepts the same POST and appends it to correction-requests.jsonl.local.
(function (root) {
    // Submitted field values stay Korean for whoever reviews the requests; only the labels are translated.
    const FIELDS = ['영업시간·휴무', '메뉴·가격', '엽전 사용 여부', '위치·지도', '연락처', '사진', '기타'];
    const TEXT = {
        ko: { title: '정보 수정 요청', close: '닫기', bot: '사람이 아니면 입력:', which: '어떤 정보가 다른가요?', fields: FIELDS,
            correct: '올바른 정보', example: '예) 월요일도 영업해요 / 떡볶이는 엽전 5개예요', contact: '답변 받을 연락처 (선택)', contactPh: '이메일 또는 전화번호',
            send: '요청 보내기', note: '보내 주신 내용은 확인 후 반영돼요. 연락처는 답변에만 사용해요.',
            empty: '올바른 정보를 적어 주세요.', sending: '보내는 중…', sent: '요청을 보냈어요. 고맙습니다!', failed: '보내지 못했어요. 잠시 후 다시 시도해 주세요.' },
        en: { title: 'Suggest an edit', close: 'Close', bot: 'Leave empty:', which: 'What is different?',
            fields: ['Hours / days off', 'Menu / prices', 'Yeopjeon accepted', 'Location / map', 'Contact', 'Photos', 'Other'],
            correct: 'Correct information', example: 'e.g. Also open on Mondays / Tteokbokki costs 5 coins', contact: 'Contact for a reply (optional)', contactPh: 'Email or phone number',
            send: 'Send request', note: 'We review every request before updating. Your contact is only used to reply.',
            empty: 'Please describe the correct information.', sending: 'Sending…', sent: 'Request sent. Thank you!', failed: 'Could not send. Please try again later.' },
        zh: { title: '申请修改信息', close: '关闭', bot: '请留空：', which: '哪些信息有误？',
            fields: ['营业时间·休息日', '菜单·价格', '是否可用铜钱', '位置·地图', '联系方式', '照片', '其他'],
            correct: '正确信息', example: '例）周一也营业 / 炒年糕是5枚铜钱', contact: '回复联系方式（选填）', contactPh: '邮箱或电话号码',
            send: '提交申请', note: '我们会在确认后更新。联系方式仅用于回复。',
            empty: '请填写正确信息。', sending: '正在提交…', sent: '已提交，谢谢！', failed: '提交失败，请稍后再试。' },
        ja: { title: '情報の修正依頼', close: '閉じる', bot: '空欄のまま：', which: 'どの情報が違いますか？',
            fields: ['営業時間・定休日', 'メニュー・価格', 'ヨプジョン利用可否', '位置・地図', '連絡先', '写真', 'その他'],
            correct: '正しい情報', example: '例）月曜日も営業しています / トッポッキはヨプジョン5枚です', contact: '返信用の連絡先（任意）', contactPh: 'メールまたは電話番号',
            send: '依頼を送る', note: '内容を確認してから反映します。連絡先は返信にのみ使います。',
            empty: '正しい情報を入力してください。', sending: '送信中…', sent: '送信しました。ありがとうございます！', failed: '送信できませんでした。しばらくしてからもう一度お試しください。' }
    };
    // General inquiries (home page "문의하기"): same dialog, different wording and topics, separate form name.
    const INQUIRY_FIELDS = ['이용 문의', '기능 제안', '오류 신고', '제휴·협업', '기타'];
    const INQUIRY = {
        ko: { title: '문의하기', which: '어떤 내용인가요?', fields: INQUIRY_FIELDS, correct: '문의 내용',
            example: '예) 엽전은 어디서 사나요? / 이런 기능이 있으면 좋겠어요', send: '문의 보내기',
            note: '보내 주신 내용은 운영팀이 확인해요. 답변이 필요하면 연락처를 남겨 주세요.', empty: '문의 내용을 적어 주세요.', sent: '문의를 보냈어요. 고맙습니다!' },
        en: { title: 'Contact us', which: 'What is it about?', fields: ['Using the market', 'Feature idea', 'Report a bug', 'Partnership', 'Other'],
            correct: 'Your message', example: 'e.g. Where can I buy coins? / It would be great if…', send: 'Send message',
            note: 'Our team reads every message. Leave a contact if you would like a reply.', empty: 'Please write your message.', sent: 'Message sent. Thank you!' },
        zh: { title: '联系我们', which: '是关于什么的？', fields: ['使用咨询', '功能建议', '错误反馈', '合作洽谈', '其他'],
            correct: '咨询内容', example: '例）在哪里买铜钱？ / 希望能有这样的功能', send: '发送咨询',
            note: '运营团队会查看您的留言。如需回复，请留下联系方式。', empty: '请填写咨询内容。', sent: '已发送，谢谢！' },
        ja: { title: 'お問い合わせ', which: 'どのような内容ですか？', fields: ['ご利用について', '機能の提案', '不具合の報告', '提携・協業', 'その他'],
            correct: 'お問い合わせ内容', example: '例）ヨプジョンはどこで買えますか？ / こんな機能があると嬉しいです', send: '送信する',
            note: '運営チームが確認します。返信が必要な場合は連絡先をご記入ください。', empty: 'お問い合わせ内容を入力してください。', sent: '送信しました。ありがとうございます！' }
    };
    const currentLang = () => { try { return localStorage.getItem('tongin_lang') || 'ko'; } catch { return 'ko'; } };
    let dialog;

    const encode = data => new URLSearchParams(data).toString();

    function build(lang, kind) {
        const base = TEXT[lang] || TEXT.ko;
        const T = kind === 'inquiry' ? {...base, ...(INQUIRY[lang] || INQUIRY.ko)} : base;
        const values = kind === 'inquiry' ? INQUIRY_FIELDS : FIELDS;
        dialog = document.createElement('dialog');
        dialog.id = 'correctionDialog';
        dialog.dataset.lang = lang;
        dialog.dataset.kind = kind;
        dialog.className = 'w-[calc(100%-2rem)] max-w-md rounded-3xl p-0 shadow-2xl backdrop:bg-black/60';
        dialog.innerHTML = `
            <form method="dialog" class="p-6 space-y-4 text-[#2B2621]" novalidate>
                <div class="flex items-start justify-between gap-3">
                    <div>
                        <h2 class="text-lg font-bold">${T.title}</h2>
                        <p class="text-xs text-gray-500 mt-1" data-cr-target-label></p>
                    </div>
                    <button type="button" data-cr-close aria-label="${T.close}" class="w-8 h-8 shrink-0 rounded-full border border-gray-200 text-gray-500">✕</button>
                </div>
                <input type="hidden" name="target">
                <input type="hidden" name="page">
                <input type="hidden" name="lang" value="${lang}">
                <p class="hidden"><label>${T.bot} <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
                <fieldset>
                    <legend class="text-xs font-bold text-gray-500 mb-2">${T.which}</legend>
                    <div class="flex flex-wrap gap-2">
                        ${values.map((f, i) => `<label class="cursor-pointer"><input type="radio" name="field" value="${f}" class="peer sr-only" ${i === 0 ? 'checked' : ''}><span class="inline-block rounded-full border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 peer-checked:bg-[#2B2621] peer-checked:text-white peer-checked:border-[#2B2621] peer-focus-visible:ring-2 peer-focus-visible:ring-[#A68A64]">${T.fields[i]}</span></label>`).join('')}
                    </div>
                </fieldset>
                <label class="block">
                    <span class="text-xs font-bold text-gray-500">${T.correct}</span>
                    <textarea name="message" required maxlength="1000" rows="4" placeholder="${T.example}"
                        class="mt-1.5 w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#A68A64]"></textarea>
                </label>
                <label class="block">
                    <span class="text-xs font-bold text-gray-500">${T.contact}</span>
                    <input name="contact" maxlength="100" autocomplete="email" placeholder="${T.contactPh}"
                        class="mt-1.5 w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#A68A64]">
                </label>
                <p data-cr-status role="status" class="text-xs font-bold min-h-[1rem]"></p>
                <button type="submit" class="w-full h-12 rounded-xl bg-[#0F172A] text-white font-bold text-sm disabled:opacity-50">${T.send}</button>
                <p class="text-[11px] text-gray-400">${T.note}</p>
            </form>`;
        document.body.appendChild(dialog);

        const form = dialog.querySelector('form');
        const el = name => form.elements.namedItem(name);
        const status = dialog.querySelector('[data-cr-status]');
        dialog.querySelector('[data-cr-close]').onclick = () => dialog.close();
        dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
        form.addEventListener('submit', async e => {
            e.preventDefault();
            const message = el('message').value.trim();
            if (!message) { status.className = 'text-xs font-bold text-red-600'; status.textContent = T.empty; el('message').focus(); return; }
            const submit = form.querySelector('[type=submit]');
            submit.disabled = true;
            status.className = 'text-xs font-bold text-gray-500'; status.textContent = T.sending;
            try {
                const response = await fetch('/', {
                    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: encode({ 'form-name': kind, 'bot-field': el('bot-field').value, target: el('target').value,
                        page: el('page').value, lang: el('lang').value, field: el('field').value, message, contact: el('contact').value.trim() })
                });
                if (!response.ok) throw new Error(response.status);
                status.className = 'text-xs font-bold text-emerald-600'; status.textContent = T.sent;
                window.mjTrack?.(kind === 'inquiry' ? 'inquiry_submit' : 'correction_request_submit', { target: el('target').value, field: el('field').value });
                setTimeout(() => dialog.open && dialog.close(), 1200);
            } catch {
                status.className = 'text-xs font-bold text-red-600'; status.textContent = T.failed;
            } finally { submit.disabled = false; }
        });
    }

    function open({ target = '만장일치 정보', label, page = location.pathname, kind = 'correction' } = {}) {
        const lang = currentLang();
        if (dialog && (dialog.dataset.lang !== lang || dialog.dataset.kind !== kind)) { dialog.remove(); dialog = null; }
        if (!dialog) build(lang, kind);
        const form = dialog.querySelector('form');
        form.reset();
        form.elements.namedItem('target').value = target;
        form.elements.namedItem('page').value = page;
        dialog.querySelector('[data-cr-target-label]').textContent = label || target;
        dialog.querySelector('[data-cr-status]').textContent = '';
        dialog.showModal();
        form.elements.namedItem('message').focus();
    }

    document.addEventListener('click', e => {
        const trigger = e.target.closest?.('[data-correction-target]');
        if (!trigger) return;
        e.preventDefault();
        e.stopPropagation();
        open({ target: trigger.dataset.correctionTarget, label: trigger.dataset.correctionLabel, page: trigger.dataset.correctionPage || location.pathname,
            kind: trigger.dataset.correctionKind === 'inquiry' ? 'inquiry' : 'correction' });
    }, true);

    root.openCorrectionRequest = open;
})(window);
