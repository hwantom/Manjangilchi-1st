(function () {
  /**
   * GA4 Configuration
   */
  const GA_ID = 'G-3LZQJXZLXQ';
  const BASE_PARAMS = {
    service_name: 'manjangilchi',
    market_id: 'tongin',
    market_name: '통인시장',
  };

  // 1. Pre-define gtag to queue events immediately (Standard GA4 pattern)
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  /**
   * Initialize GA4 - Inject script and configure
   */
  function initGA() {
    // Prevent duplicate injection
    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_ID}"]`)) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    
    // Insert before the first script tag to ensure early loading
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript);

    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {
      ...BASE_PARAMS,
      send_page_view: true // Enable automatic page view tracking
    });
  }

  /**
   * Custom Event Tracking
   * @param {string} eventName 
   * @param {Object} params 
   */
  window.mjTrack = function (eventName, params = {}) {
    if (!eventName) return;
    
    window.gtag('event', eventName, {
      ...BASE_PARAMS,
      page_path: window.location.pathname,
      page_location: window.location.href,
      language: localStorage.getItem('tongin_lang') || document.documentElement.lang || 'ko',
      ...params,
    });
  };

  /**
   * Manual Page View Tracking (for SPAs or specific transitions)
   * @param {Object} params 
   */
  window.mjPageView = function (params = {}) {
    window.gtag('event', 'page_view', {
      ...BASE_PARAMS,
      page_title: params.page_title || document.title,
      page_path: params.page_path || window.location.pathname,
      page_location: params.page_location || window.location.href,
      language: localStorage.getItem('tongin_lang') || document.documentElement.lang || 'ko',
      ...params,
    });
  };

  /**
   * Microsoft Clarity: scroll heatmaps and session replays (not loaded on localhost).
   */
  const CLARITY_ID = 'z20kcsk4e2';
  function initClarity() {
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) || window.clarity) return;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  /**
   * How far people get and where they leave.
   * - tab_view: a main tab (HOME, STORES, YEOPJEON, FACILITIES) or the map is shown
   * - section_view: a block marked data-mj-section scrolls into view (once per tab visit)
   * - scroll_depth: 25/50/75/100% of the page reached (once per tab visit)
   * - page_exit: the page is hidden or closed, with the tab, last section and deepest scroll
   */
  const DEPTHS = [25, 50, 75, 100];
  const visit = { tab: null, section: null, depth: 0, seen: new Set(), since: Date.now(), quietUntil: 0 };
  let exitSent = false;

  window.mjSetTab = function (tab) {
    if (!tab || tab === visit.tab) return;
    // Switching tabs scrolls back to the top; ignore those scroll events for a moment.
    Object.assign(visit, { tab, section: null, depth: 0, seen: new Set(), since: Date.now(), quietUntil: Date.now() + 1000 });
    window.mjTrack('tab_view', { tab });
    window.clarity?.('set', 'tab', tab);
  };

  function onScroll() {
    if (!visit.tab || Date.now() < visit.quietUntil) return;
    const percent = Math.min(100, Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100));
    DEPTHS.filter(d => d > visit.depth && percent >= d).forEach(d => {
      visit.depth = d;
      window.mjTrack('scroll_depth', { tab: visit.tab, percent: d });
    });
  }

  const sectionObserver = 'IntersectionObserver' in window && new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || !visit.tab) return;
      const name = entry.target.dataset.mjSection;
      visit.section = name;
      if (visit.seen.has(name)) return;
      visit.seen.add(name);
      window.mjTrack('section_view', { tab: visit.tab, section: name, section_order: visit.seen.size });
    });
  }, { threshold: 0.4 });

  function watchSections() {
    if (!sectionObserver) return;
    const observed = new WeakSet();
    const scan = () => document.querySelectorAll('[data-mj-section]').forEach(el => {
      if (observed.has(el)) return;
      observed.add(el);
      sectionObserver.observe(el);
    });
    scan();
    // React renders (and re-renders) the sections after load.
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  }

  function sendExit() {
    if (exitSent || !visit.tab) return;
    exitSent = true;
    window.mjTrack('page_exit', {
      tab: visit.tab,
      last_section: visit.section || '(none)',
      sections_seen: visit.seen.size,
      max_scroll: visit.depth,
      seconds_on_tab: Math.round((Date.now() - visit.since) / 1000),
      transport_type: 'beacon'
    });
  }

  function initJourney() {
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') sendExit();
      else exitSent = false;
    });
    window.addEventListener('pagehide', sendExit);
    if (/\/map(\.html)?$|\/shop\//.test(location.pathname)) window.mjSetTab('MAP');
    if (document.body) watchSections();
    else document.addEventListener('DOMContentLoaded', watchSections);
  }

  // Initialize immediately
  initGA();
  initClarity();
  initJourney();
})();
