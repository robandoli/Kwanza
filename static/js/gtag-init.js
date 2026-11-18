(() => {
  const measurementId = document.currentScript?.dataset.measurementId;
  if (!measurementId) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId);
})();
