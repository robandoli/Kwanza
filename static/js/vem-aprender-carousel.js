document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero--vem-aprender");
  if (!hero) return;

  const slides = hero.querySelectorAll(".hero-bg img");
  let current = 0;

  if (slides.length <= 1) return;

  setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }, 9000); // 9 segundos
});
