import os

new_code = """
            let activeTab = 'home';

            const renderDetailPanel = () => {
                if (!selectedStore) return;
                const t = UI_TRANSLATIONS[currentLang];
                const store = selectedStore;
                const isFav = favorites.has(store.name);
                const catStyle = CATEGORY_STYLES[store.category];
                const keywords = parseKeywords(getStoreProp(store, 'keyword'));

                const catKey = store.category === '식당' ? 'food' : store.category === '간식' ? 'snack' : 'life';
                const catName = t['cat_' + catKey];

                const tabClass = (tabId) => activeTab === tabId 
                    ? "tab-btn active text-brand-ink font-bold border-b-2 border-brand-ink pb-2.5 transition-colors" 
                    : "tab-btn text-gray-400 pb-2.5 border-b-2 border-transparent hover:text-gray-600 transition-colors";

                detailPanel.innerHTML = `
                <div class="flex flex-col h-full w-full bg-transparent overflow-hidden pb-safe relative pointer-events-none">
                    <div id="sheetMainContainer" class="flex flex-col h-full w-full bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.12)] pointer-events-auto mt-auto">
                        
                        <div class="sheet-handle-bar sm:hidden mx-auto mt-4 mb-3 w-12 h-1.5 bg-gray-300 rounded-full shrink-0"></div>
                        
                        <div id="sheetDetailBody" class="flex-1 overflow-y-auto no-scrollbar w-full h-full relative">
                            
                            <!-- Image Area (Hidden in Collapsed) -->
                            <div id="sheetImageArea" class="relative w-full h-64 shrink-0 bg-gray-100 hidden opacity-0 transition-opacity duration-300">
                                <img id="detailPanelImage" src="${normalizeImageUrl(store.repre_image)}" class="w-full h-full object-cover cursor-zoom-in" onerror="this.src='${PLACEHOLDER_IMG}'" />
                                <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                                <button id="expandedCloseBtn" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 z-50 transition-colors backdrop-blur-sm hidden">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                            
                            <!-- Header Info -->
                            <div id="sheetSummaryHeader" class="bg-white px-6 pt-2 pb-5 shrink-0 relative z-20 transition-all duration-300">
                                <div class="flex items-center gap-2 mb-2" id="sheetTagsContainer">
                                    <span class="${catStyle.bg} px-2.5 py-0.5 rounded text-[10px] font-black uppercase text-brand-ink">${catName}</span>
                                    ${store.coin === 'o' ? `<span class="px-2.5 py-0.5 rounded text-[10px] font-black uppercase text-yellow-800 bg-yellow-100">${t.yeopjeonBadge}</span>` : ''}
                                </div>
                                <div class="flex justify-between items-start">
                                    <div class="flex-1 pr-4">
                                        <h2 class="text-[22px] font-bold text-gray-900 leading-tight">${getStoreProp(store, 'name')}</h2>
                                        <p class="text-xs text-gray-500 mt-1 truncate">${getStoreProp(store, 'shortDesc')}</p>
                                    </div>
                                    <div class="flex gap-2 shrink-0">
                                        <button id="shareBtn" class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors border border-gray-100"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg></button>
                                        <button id="detailFavBtn" class="w-9 h-9 flex items-center justify-center rounded-full transition-all border ${isFav ? 'bg-pink-50 border-pink-100 text-pink-500' : 'bg-gray-50 border-gray-100 text-gray-400'}"><svg class="w-4 h-4" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></button>
                                        <button id="routeBtn" class="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 border border-blue-100 hover:bg-blue-100"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg></button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Extended Content Area (Hidden in Collapsed & Half) -->
                            <div id="sheetExtendedArea" class="hidden flex-col min-h-screen bg-white">
                                <!-- Tabs -->
                                <div class="sticky top-0 z-30 bg-white border-b border-gray-100 flex px-6 gap-6 text-sm">
                                    <button class="${tabClass('home')}" data-tab="home">홈</button>
                                    <button class="${tabClass('menu')}" data-tab="menu">메뉴</button>
                                    <button class="${tabClass('review')}" data-tab="review">리뷰 (129)</button>
                                    <button class="${tabClass('info')}" data-tab="info">정보</button>
                                </div>
                                
                                <!-- Tab Content -->
                                <div id="tabContentContainer" class="flex-1 bg-[#F5F6F8]">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

                document.getElementById('detailFavBtn').onclick = () => toggleFavorite(store.name);
                document.getElementById('routeBtn').onclick = () => handleRoute(store);
                document.getElementById('shareBtn').onclick = () => handleShare(store);
                
                const expCloseBtn = document.getElementById('expandedCloseBtn');
                if (expCloseBtn) {
                    expCloseBtn.onclick = () => {
                        sheetStage = 'HALF';
                        snapToStage(sheetStage);
                    };
                }

                // Attach click handler for image popup
                const imgEl = document.getElementById('detailPanelImage');
                if (imgEl) {
                    imgEl.onclick = () => {
                        if (sheetStage === 'EXPANDED') openImageModal(normalizeImageUrl(store.repre_image));
                    };
                }

                // Setup Tabs
                const tabBtns = detailPanel.querySelectorAll('.tab-btn');
                tabBtns.forEach(btn => {
                    btn.onclick = (e) => {
                        activeTab = e.target.dataset.tab;
                        renderDetailPanel(); // Re-render to update tab states and content
                        // Restore expanded state and scroll to top of tabs
                        sheetStage = 'EXPANDED';
                        snapToStage('EXPANDED');
                        const scrollContainer = detailPanel.querySelector('#sheetDetailBody');
                        const imageArea = detailPanel.querySelector('#sheetImageArea');
                        if (scrollContainer && imageArea) {
                            scrollContainer.scrollTop = imageArea.offsetHeight; // Scroll past image so tabs stick to top
                        }
                    };
                });
                
                // Render Active Tab Content
                const tabContentContainer = detailPanel.querySelector('#tabContentContainer');
                if (tabContentContainer) {
                    tabContentContainer.innerHTML = renderTabContent(store, activeTab, t, keywords);
                }

                setupBottomSheetEvents();
                // Initialize Stage
                snapToStage(sheetStage);
            };

            const renderTabContent = (store, tab, t, keywords) => {
                if (tab === 'home') {
                    return `
                        <div class="p-5 space-y-6 bg-white pb-20">
                            <!-- Store Intro -->
                            <div class="bg-orange-50/50 p-4 rounded-2xl border border-orange-100/50">
                                <p class="text-sm text-gray-700 leading-relaxed"><span class="font-bold text-orange-600">통인시장</span> 터줏대감 30년의 자리를 지켜온 다방. 옛 다방의 정취를 그대로 간직한 채, 직접 손수달인 쌍화차/대추차 등 건강한 한방차를 선보입니다.</p>
                            </div>

                            <!-- Operation Status -->
                            <div class="space-y-4">
                                <div class="flex items-start gap-3">
                                    <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <div>
                                        <div class="flex items-center text-sm font-bold text-gray-900 mb-1">
                                            <span class="status-dot dot-${getOperatingStatus(store.hours || '', t).color}"></span>
                                            <span class="status-${getOperatingStatus(store.hours || '', t).color}-text mr-2">${getOperatingStatus(store.hours || '', t).label}</span>
                                            <span class="font-medium text-gray-600">${getOperatingStatus(store.hours || '', t).detail}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3">
                                    <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    <p class="text-sm text-gray-600 leading-tight">통인시장 내 12문 방향 - 서울 종로구 자하문로15길 18</p>
                                </div>
                                <div class="flex items-start gap-3">
                                    <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                    <p class="text-sm text-gray-600 leading-tight">02-733-****</p>
                                </div>
                            </div>
                            
                            <hr class="border-gray-100" />
                            
                            <!-- Dummy Recommended Menu -->
                            <div>
                                <div class="flex justify-between items-center mb-4">
                                    <h3 class="font-bold text-gray-900">대표 메뉴</h3>
                                    <span class="text-xs text-gray-400 flex items-center gap-1 cursor-pointer">전체 메뉴 <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></span>
                                </div>
                                <div class="grid grid-cols-2 gap-3">
                                    <div class="border border-gray-100 rounded-xl p-3 bg-white shadow-sm flex flex-col justify-between">
                                        <p class="text-sm font-bold text-gray-800 mb-2">오늘의 커피</p>
                                        <p class="text-xs text-gray-500 mb-2 truncate">매일 직접 볶는 원두로 내린 커피</p>
                                        <p class="text-sm font-black text-orange-500">2,500원</p>
                                    </div>
                                    <div class="border border-gray-100 rounded-xl p-3 bg-white shadow-sm flex flex-col justify-between">
                                        <p class="text-sm font-bold text-gray-800 mb-2">쌍화차</p>
                                        <p class="text-xs text-gray-500 mb-2 truncate">직접 달인 전통 한방차</p>
                                        <p class="text-sm font-black text-orange-500">4,500원</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (tab === 'menu') {
                    return `
                        <div class="p-5 bg-white min-h-[400px]">
                            <h3 class="font-bold text-gray-900 mb-4 text-sm">전체 메뉴 (4)</h3>
                            <div class="space-y-4">
                                <!-- Menu Item Dummy 1 -->
                                <div class="flex items-start justify-between border-b border-gray-100 pb-4">
                                    <div class="flex-1 pr-4">
                                        <div class="flex items-center gap-2 mb-1">
                                            <h4 class="font-bold text-gray-900">오늘의 커피</h4>
                                            <span class="px-1.5 py-0.5 bg-red-50 text-red-500 text-[10px] font-black rounded uppercase">Best</span>
                                        </div>
                                        <p class="text-xs text-gray-500 mb-2 line-clamp-2">매일 직접 볶는 원두로 갓 내린 아메리카노</p>
                                        <p class="font-bold text-gray-900 text-sm">2,500원</p>
                                    </div>
                                    <div class="w-20 h-20 bg-gray-100 rounded-xl shrink-0 overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1551030173-122aabc4489c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" class="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <!-- Menu Item Dummy 2 -->
                                <div class="flex items-start justify-between border-b border-gray-100 pb-4">
                                    <div class="flex-1 pr-4">
                                        <div class="flex items-center gap-2 mb-1">
                                            <h4 class="font-bold text-gray-900">쌍화차</h4>
                                            <span class="px-1.5 py-0.5 bg-yellow-50 text-yellow-600 text-[10px] font-black rounded uppercase">인기</span>
                                        </div>
                                        <p class="text-xs text-gray-500 mb-2 line-clamp-2">정성으로 직접 달인 깊은 맛의 한방차</p>
                                        <p class="font-bold text-gray-900 text-sm">4,500원</p>
                                    </div>
                                    <div class="w-20 h-20 bg-gray-100 rounded-xl shrink-0 overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1594910196238-7fba0b9a6b82?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" class="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <!-- Menu Item Dummy 3 -->
                                <div class="flex items-start justify-between pb-4">
                                    <div class="flex-1 pr-4">
                                        <h4 class="font-bold text-gray-900 mb-1">옛날 모과차</h4>
                                        <p class="text-xs text-gray-500 mb-2 line-clamp-2">가을빛을 담은 달콤한 수제 모과차</p>
                                        <p class="font-bold text-gray-900 text-sm">3,500원</p>
                                    </div>
                                    <div class="w-20 h-20 bg-gray-100 rounded-xl shrink-0 overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1563822249548-9a72b6353cad?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" class="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (tab === 'review') {
                    return `
                        <div class="p-5 bg-white min-h-[500px]">
                            <!-- Rating Summary -->
                            <div class="flex items-center gap-6 mb-8 border-b border-gray-100 pb-6">
                                <div class="text-center">
                                    <p class="text-4xl font-black text-gray-900 mb-1">4.7<span class="text-lg text-gray-400 font-normal">/5</span></p>
                                    <div class="flex text-yellow-400 justify-center mb-1 text-sm">★★★★★</div>
                                    <p class="text-[10px] text-gray-400">리뷰 129개</p>
                                </div>
                                <div class="flex-1 space-y-2">
                                    <div class="flex items-center gap-3 text-xs"><span class="w-8 text-gray-500">맛</span><div class="flex-1 h-1.5 bg-gray-100 rounded-full"><div class="h-full bg-black rounded-full" style="width: 95%"></div></div><span class="w-4 text-right text-gray-900 font-bold">4.8</span></div>
                                    <div class="flex items-center gap-3 text-xs"><span class="w-8 text-gray-500">분위기</span><div class="flex-1 h-1.5 bg-gray-100 rounded-full"><div class="h-full bg-black rounded-full" style="width: 85%"></div></div><span class="w-4 text-right text-gray-900 font-bold">4.5</span></div>
                                    <div class="flex items-center gap-3 text-xs"><span class="w-8 text-gray-500">서비스</span><div class="flex-1 h-1.5 bg-gray-100 rounded-full"><div class="h-full bg-black rounded-full" style="width: 98%"></div></div><span class="w-4 text-right text-gray-900 font-bold">4.9</span></div>
                                </div>
                            </div>
                            
                            <!-- Dummy Reviews -->
                            <div class="space-y-6">
                                <div class="border-b border-gray-100 pb-5">
                                    <div class="flex items-center gap-3 mb-2">
                                        <div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden"><img src="https://i.pravatar.cc/100?img=1" class="w-full h-full object-cover" /></div>
                                        <div>
                                            <p class="text-xs font-bold text-gray-900">김서현</p>
                                            <div class="flex text-yellow-400 text-[10px]">★★★★★ <span class="text-gray-400 ml-2">1일 전</span></div>
                                        </div>
                                    </div>
                                    <p class="text-sm text-gray-700 leading-relaxed">할머니 댁 놀러온 것 같이 푸근하고 좋아요~ 사장님이 너무 친절하시고 쌍화차가 특히 진짜 맛있습니다. 시장 돌아다니다 잠깐 쉬어가기 딱 좋아요!</p>
                                </div>
                                
                                <div>
                                    <div class="flex items-center gap-3 mb-2">
                                        <div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden"><img src="https://i.pravatar.cc/100?img=12" class="w-full h-full object-cover" /></div>
                                        <div>
                                            <p class="text-xs font-bold text-gray-900">Minsu L.</p>
                                            <div class="flex text-yellow-400 text-[10px]">★★★★★ <span class="text-gray-400 ml-2">3일 전</span></div>
                                        </div>
                                    </div>
                                    <div class="flex gap-2 mb-3">
                                        <div class="w-16 h-16 rounded bg-gray-100 overflow-hidden"><img src="https://images.unsplash.com/photo-1594910196238-7fba0b9a6b82?w=100&q=80" class="w-full h-full object-cover" /></div>
                                    </div>
                                    <p class="text-sm text-gray-700 leading-relaxed mb-2">Hidden gem inside the traditional market. I loved the retro vibe and the owner's hospitality. Try the ssanghwa-cha!</p>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (tab === 'info') {
                    return `
                        <div class="p-5 bg-white min-h-[400px] space-y-6">
                            <!-- Hours Detail -->
                            <div>
                                <h3 class="font-bold text-gray-900 mb-4 text-sm">영업시간 안내</h3>
                                <div class="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-gray-600">
                                    <div class="flex justify-between"><span>월요일</span><span class="font-medium">10:00 - 21:00</span></div>
                                    <div class="flex justify-between text-black font-bold"><span>화요일</span><span>10:00 - 21:00</span></div>
                                    <div class="flex justify-between"><span>수요일</span><span class="font-medium">10:00 - 21:00</span></div>
                                    <div class="flex justify-between"><span>목요일</span><span class="font-medium">10:00 - 21:00</span></div>
                                    <div class="flex justify-between"><span>금요일</span><span class="font-medium">10:00 - 22:00</span></div>
                                    <div class="flex justify-between"><span>토요일</span><span class="font-medium">10:00 - 22:00</span></div>
                                    <div class="flex justify-between text-red-500"><span>일요일</span><span class="font-medium">휴무</span></div>
                                </div>
                            </div>
                            
                            <!-- Keywords -->
                            ${keywords.length ? `
                            <div>
                                <h3 class="font-bold text-gray-900 mb-3 text-sm">가게 키워드</h3>
                                <div class="flex flex-wrap gap-2">
                                    ${keywords.map(k => `<span class="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium">#${k}</span>`).join('')}
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    `;
                }
                return '';
            };

            const setupBottomSheetEvents = () => {
                const scrollContainer = detailPanel.querySelector('#sheetDetailBody');
                const mainContainer = detailPanel.querySelector('#sheetMainContainer');
                const header = detailPanel.querySelector('#sheetSummaryHeader');
                let animationFrameId = null;
                let isNativeScrolling = false;
                
                // Track start height specifically to differentiate logic
                let startMainHeight = 0;

                detailPanel.addEventListener('touchstart', (e) => {
                    if (window.innerWidth >= 640) return;
                    startY = e.touches[0].clientY;
                    currentY = startY;
                    isDragging = true;
                    isNativeScrolling = (sheetStage === 'EXPANDED' && scrollContainer && scrollContainer.scrollTop > 0);
                    
                    if (mainContainer) {
                        mainContainer.style.transition = 'none';
                        startMainHeight = mainContainer.getBoundingClientRect().height;
                    }
                    if (animationFrameId) cancelAnimationFrame(animationFrameId);
                }, { passive: true });

                detailPanel.addEventListener('touchmove', (e) => {
                    if (!isDragging || window.innerWidth >= 640) return;

                    const y = e.touches[0].clientY;
                    const deltaY = y - startY;

                    const isDraggingHeader = e.target.closest('#sheetSummaryHeader') || e.target.closest('.sheet-handle-bar');

                    if (!isDraggingHeader && sheetStage === 'EXPANDED') {
                        if (!isNativeScrolling && scrollContainer && scrollContainer.scrollTop === 0 && deltaY < 0) {
                            isNativeScrolling = true;
                        }

                        if (isNativeScrolling) {
                            return; // Let native scroll handle this
                        }
                    }

                    if (e.cancelable) e.preventDefault();
                    currentY = y;

                    if (animationFrameId) cancelAnimationFrame(animationFrameId);
                    animationFrameId = requestAnimationFrame(() => {
                        const h = window.innerHeight;
                        // Determine base translation for the container
                        let baseTranslateY = 0;
                        if (sheetStage === 'COLLAPSED') {
                            baseTranslateY = h - startMainHeight; 
                        } else if (sheetStage === 'HALF') {
                            baseTranslateY = h * 0.45;
                        } else if (sheetStage === 'EXPANDED') {
                            baseTranslateY = 0;
                        }

                        let newTranslateY = baseTranslateY + deltaY;
                        if (newTranslateY < 0) newTranslateY = 0;

                        if (mainContainer) {
                            mainContainer.style.transform = `translateY(${newTranslateY}px)`;
                        }
                        
                        // Toggle overlay
                        if (newTranslateY < h * 0.3) overlay.classList.remove('hidden');
                        else overlay.classList.add('hidden');
                    });
                }, { passive: false });

                detailPanel.addEventListener('touchend', (e) => {
                    if (!isDragging || window.innerWidth >= 640) return;
                    isDragging = false;
                    isNativeScrolling = false;

                    const deltaY = currentY - startY;
                    const absDeltaY = Math.abs(deltaY);

                    if (absDeltaY < 20) {
                        snapToStage(sheetStage);
                        return;
                    }

                    if (deltaY > 0) {
                        // Swiping down
                        if (sheetStage === 'EXPANDED') sheetStage = 'HALF';
                        else if (sheetStage === 'HALF') sheetStage = 'COLLAPSED';
                        else if (sheetStage === 'COLLAPSED' && absDeltaY > 40) {
                            closeAllPanels();
                            return;
                        }
                    } else {
                        // Swiping up
                        if (sheetStage === 'COLLAPSED') sheetStage = 'HALF';
                        else if (sheetStage === 'HALF') sheetStage = 'EXPANDED';
                    }

                    snapToStage(sheetStage);
                });
            };

            const snapToStage = (stage) => {
                if (window.innerWidth >= 640) return;
                const h = window.innerHeight;
                const mainContainer = detailPanel.querySelector('#sheetMainContainer');
                const scrollContainer = detailPanel.querySelector('#sheetDetailBody');
                const imageArea = detailPanel.querySelector('#sheetImageArea');
                const extendedArea = detailPanel.querySelector('#sheetExtendedArea');
                const header = detailPanel.querySelector('#sheetSummaryHeader');
                const closeBtn = detailPanel.querySelector('#expandedCloseBtn');
                const tagsContainer = detailPanel.querySelector('#sheetTagsContainer');
                
                if (!mainContainer) return;

                let targetY = 0;
                
                // Set transition for everything
                mainContainer.style.transition = 'transform 0.4s cubic-bezier(0.3, 0, 0.2, 1)';
                
                if (stage === 'COLLAPSED') {
                    // In collapsed, hide image, hide extended, show only header
                    if (imageArea) {
                        imageArea.style.opacity = '0';
                        setTimeout(() => { if(sheetStage === 'COLLAPSED') imageArea.classList.add('hidden'); }, 300);
                    }
                    if (extendedArea) extendedArea.classList.add('hidden');
                    if (closeBtn) closeBtn.classList.add('hidden');
                    if (tagsContainer) tagsContainer.classList.remove('hidden');
                    
                    overlay.classList.add('hidden');
                    if (scrollContainer) {
                        scrollContainer.style.overflowY = 'hidden';
                        scrollContainer.scrollTop = 0;
                    }
                    
                    // We need to know the height of the handle + header to calculate targetY
                    // We can estimate it or measure it dynamically.
                    const headerHeight = header ? header.offsetHeight : 100;
                    const handleHeight = 32; // mt-4 + h-1.5 + mb-3 is about 32px
                    targetY = h - headerHeight - handleHeight;
                    
                } else if (stage === 'HALF') {
                    // Show image, hide extended
                    if (imageArea) {
                        imageArea.classList.remove('hidden');
                        setTimeout(() => { imageArea.style.opacity = '1'; }, 10);
                    }
                    if (extendedArea) extendedArea.classList.add('hidden');
                    if (closeBtn) closeBtn.classList.add('hidden');
                    if (tagsContainer) tagsContainer.classList.remove('hidden');
                    
                    targetY = h * 0.45;
                    overlay.classList.add('hidden');
                    if (scrollContainer) {
                        scrollContainer.style.overflowY = 'hidden';
                        scrollContainer.scrollTop = 0;
                    }
                } else if (stage === 'EXPANDED') {
                    // Show image, show extended, show close button
                    if (imageArea) {
                        imageArea.classList.remove('hidden');
                        setTimeout(() => { imageArea.style.opacity = '1'; }, 10);
                    }
                    if (extendedArea) extendedArea.classList.remove('hidden');
                    if (closeBtn) closeBtn.classList.remove('hidden');
                    // Hide tags in header if preferred, but for now we keep it based on design
                    
                    targetY = 0;
                    overlay.classList.remove('hidden');
                    if (scrollContainer) {
                        scrollContainer.style.overflowY = 'auto';
                    }
                }

                mainContainer.style.transform = `translateY(${targetY}px)`;

                // Adjust map offset dynamically
                if (map && selectedStore) {
                    const storeLatLng = { lat: parseFloat(selectedStore.lat), lng: parseFloat(selectedStore.lng) };
                    map.panTo(storeLatLng);

                    if (window.__mapPanTimeout) clearTimeout(window.__mapPanTimeout);
                    if (stage === 'HALF') {
                        window.__mapPanTimeout = setTimeout(() => map.panBy(0, h * 0.20), 100);
                    } else if (stage === 'EXPANDED') {
                        window.__mapPanTimeout = setTimeout(() => map.panBy(0, h * 0.4), 50);
                    }
                }
            };
"""

with open('map.html', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = 'const renderDetailPanel = () => {'
end_marker = 'const handleRoute = async (store) => {'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    # Need to keep `let activeTab = 'home';` before `renderDetailPanel`.
    # Actually `let activeTab` is defined in `new_code`.
    # Let's replace exactly from start_marker to end_marker with `new_code` + `end_marker`
    
    new_content = content[:start_idx] + new_code + '\n            ' + content[end_idx:]
    with open('map.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully patched map.html")
else:
    print("Markers not found, patch failed.")

