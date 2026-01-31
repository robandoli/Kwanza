document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".hero-calendario-bg img");
  let current = 0;

  if (!slides.length) return;

  slides[0].classList.add("active");

  setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }, 6000);
});
