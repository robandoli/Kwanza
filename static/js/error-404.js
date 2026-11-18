(() => {
  const container = document.querySelector(".error-emoji");
  if (!container) return;

  const emojis = [
    "\\(o_o)/", "(o^^)o", "(˚Δ˚)b", "(^-^*)", "(≥o≤)", "(^_^)b", "(·_·)",
    "(='X'=)", "(>_<)", "(;-;)", "\\(^Д^)/",
  ];
  container.textContent = emojis[Math.floor(Math.random() * emojis.length)];
})();
