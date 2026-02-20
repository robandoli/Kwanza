document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero--vem-aprender");
  if (!hero) return;

  const slides = hero.querySelectorAll(".hero-bg img");
  if (slides.length <= 1) return;
  const prevButton = hero.querySelector("[data-carousel-prev]");
  const nextButton = hero.querySelector("[data-carousel-next]");

  let current = Array.from(slides).findIndex((slide) =>
    slide.classList.contains("active")
  );
  if (current < 0) {
    current = 0;
    slides[current].classList.add("active");
  }
  let intervalId = null;

  const state = {
    hidden: document.hidden,
    hovered: false,
    focused: false,
  };

  const goToSlide = (index) => {
    slides[current].classList.remove("active");
    current = index;
    slides[current].classList.add("active");
  };

  const nextSlide = () => {
    goToSlide((current + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((current - 1 + slides.length) % slides.length);
  };

  const shouldPause = () => state.hidden || state.hovered || state.focused;

  const start = () => {
    if (intervalId || shouldPause()) return;
    intervalId = window.setInterval(nextSlide, 9000);
  };

  const stop = () => {
    if (!intervalId) return;
    window.clearInterval(intervalId);
    intervalId = null;
  };

  const syncPlayback = () => {
    if (shouldPause()) {
      stop();
      return;
    }

    start();
  };

  hero.addEventListener("mouseenter", () => {
    state.hovered = true;
    syncPlayback();
  });

  hero.addEventListener("mouseleave", () => {
    state.hovered = false;
    syncPlayback();
  });

  hero.addEventListener("focusin", () => {
    state.focused = true;
    syncPlayback();
  });

  hero.addEventListener("focusout", () => {
    state.focused = hero.matches(":focus-within");
    syncPlayback();
  });

  document.addEventListener("visibilitychange", () => {
    state.hidden = document.hidden;
    syncPlayback();
  });

  prevButton?.addEventListener("click", () => {
    prevSlide();
    syncPlayback();
  });

  nextButton?.addEventListener("click", () => {
    nextSlide();
    syncPlayback();
  });

  start();
});
