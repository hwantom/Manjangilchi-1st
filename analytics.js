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

  window.mjPageView = function (params = {}) {
    if (typeof window.gtag !== 'function') {
      console.warn('[GA4] gtag is not ready: page_view', params);
      return;
    }

    window.gtag('event', 'page_view', {
      ...BASE_PARAMS,
      page_title: params.page_title || document.title,
      page_path: params.page_path || window.location.pathname,
      page_location: params.page_location || window.location.href,
      language:
        localStorage.getItem('tongin_lang') ||
        document.documentElement.lang ||
        'ko',
      ...params,
    });
  };
})();
