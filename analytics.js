(function () {
  const BASE_PARAMS = {
    service_name: 'manjangilchi',
    market_id: 'tongin',
    market_name: '통인시장',
  };

  window.mjTrack = function (eventName, params = {}) {
    if (!eventName) return;

    if (typeof window.gtag !== 'function') {
      console.warn('[GA4] gtag is not ready:', eventName, params);
      return;
    }

    window.gtag('event', eventName, {
      ...BASE_PARAMS,
      page_path: window.location.pathname,
      page_location: window.location.href,
      language:
        localStorage.getItem('tongin_lang') ||
        document.documentElement.lang ||
        'ko',
      ...params,
    });
  };
})();
