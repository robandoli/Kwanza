(function () {
  const sendAnalyticsEvent = (eventName, params = {}) => {
    if (!eventName || typeof window.gtag !== "function") return;

    window.gtag("event", eventName, {
      page_path: window.location.pathname,
      page_title: document.title,
      ...params,
    });
  };

  window.trackKwanzaAnalytics = sendAnalyticsEvent;

  const getDatasetParams = (element) => {
    const params = {};

    Object.entries(element.dataset).forEach(([key, value]) => {
      if (!key.startsWith("analyticsParam") || !value) return;

      const paramName = key
        .replace("analyticsParam", "")
        .replace(/^[A-Z]/, (match) => match.toLowerCase())
        .replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);

      params[paramName] = value;
    });

    if (element.href) {
      params.link_url = element.href;
    }

    return params;
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-analytics-page-event]").forEach((element) => {
      sendAnalyticsEvent(element.dataset.analyticsPageEvent, getDatasetParams(element));
    });

    document.addEventListener("click", (event) => {
      if (!event.target || typeof event.target.closest !== "function") return;

      const target = event.target.closest("[data-analytics-event]");
      if (!target) return;

      sendAnalyticsEvent(target.dataset.analyticsEvent, getDatasetParams(target));
    });
  });
})();
