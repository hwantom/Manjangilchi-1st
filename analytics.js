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

  // Initialize immediately
  initGA();
})();
