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

  const getSafeLinkParams = (element) => {
    if (!element?.href) return {};

    try {
      const baseUrl = window.location?.href || `${window.location?.origin || "https://kwanza.invalid"}/`;
      const destination = new URL(element.href, baseUrl);
      const currentOrigin = window.location?.origin || new URL(baseUrl).origin;

      if (destination.protocol === "mailto:") return { link_type: "email" };
      if (destination.protocol === "tel:") return { link_type: "telephone" };

      const isInternal = destination.origin === currentOrigin;
      return {
        link_type: isInternal ? "internal" : "external",
        link_url: isInternal ? destination.pathname : destination.origin,
      };
    } catch {
      return {};
    }
  };

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

    return params;
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-analytics-page-event]").forEach((element) => {
      sendAnalyticsEvent(element.dataset.analyticsPageEvent, getDatasetParams(element));
    });

    document.addEventListener("click", (event) => {
      if (!event.target || typeof event.target.closest !== "function") return;

      const target = event.target.closest("[data-analytics-event]");
      if (target) {
        sendAnalyticsEvent(target.dataset.analyticsEvent, {
          ...getDatasetParams(target),
          ...getSafeLinkParams(target),
        });
        return;
      }

      const contentLink = event.target.closest("a");
      if (!contentLink?.href) return;
      if (
        contentLink.closest(".site-nav") ||
        contentLink.closest(".site-footer") ||
        contentLink.closest(".home-event-banner")
      ) return;

      const component = contentLink.closest("[data-analytics-component]");
      const componentName = component?.dataset.analyticsComponent || "page_content";
      const linkLabel = (
        contentLink.getAttribute("aria-label") ||
        contentLink.getAttribute("title") ||
        contentLink.textContent ||
        ""
      ).replace(/\s+/g, " ").trim().slice(0, 100);

      sendAnalyticsEvent("content_link_click", {
        ...(component ? getDatasetParams(component) : {}),
        component_name: componentName,
        link_label: linkLabel,
        ...getSafeLinkParams(contentLink),
      });
    });

    document.addEventListener("toggle", (event) => {
      const target = event.target;
      if (target?.tagName?.toLowerCase() !== "details") return;
      if (!target.dataset.analyticsComponent) return;

      sendAnalyticsEvent("content_component_toggle", {
        ...getDatasetParams(target),
        component_name: target.dataset.analyticsComponent,
        component_action: target.open ? "open" : "close",
      });
    }, true);

    document.querySelectorAll("[data-analytics-media]").forEach((media) => {
      let started = false;
      const mediaParams = {
        ...getDatasetParams(media),
        component_name: media.dataset.analyticsComponent || "embedded_media",
        media_type: media.dataset.analyticsMedia,
      };

      media.addEventListener("play", () => {
        if (started) return;
        started = true;
        sendAnalyticsEvent("content_media_start", mediaParams);
      });

      media.addEventListener("ended", () => {
        sendAnalyticsEvent("content_media_complete", mediaParams);
      });
    });
  });
})();
