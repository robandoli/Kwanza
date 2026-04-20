document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxImage = document.querySelector("[data-lightbox-image]");
  const lightboxClose = document.querySelector("[data-lightbox-close]");
  const carousel = document.querySelector("[data-mestres-carousel]");

  document.querySelectorAll("[data-lightbox-open]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = button.dataset.lightboxSrc || "";
      lightboxImage.alt = button.dataset.lightboxAlt || "";
      lightbox.showModal();
    });
  });

  lightboxClose?.addEventListener("click", () => {
    lightbox?.close();
  });

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });

  if (!carousel) return;

  const track = carousel.querySelector("[data-carousel-track]");
  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const dotsContainer = carousel.querySelector("[data-carousel-dots]");
  const cards = Array.from(track?.children || []);

  if (!track || cards.length === 0) return;

  const getCardsPerView = () => {
    if (window.innerWidth <= 680) return 1;
    if (window.innerWidth <= 980) return 2;
    return 3;
  };

  let currentPage = 0;
  let pages = 1;

  const buildDots = () => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";

    Array.from({ length: pages }).forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "evento-kwanza__carousel-dot";
      dot.setAttribute("aria-label", `Ir para grupo ${index + 1}`);
      dot.addEventListener("click", () => {
        currentPage = index;
        update();
      });
      dotsContainer.appendChild(dot);
    });
  };

  const updateButtons = () => {
    if (prevButton) prevButton.disabled = currentPage === 0;
    if (nextButton) nextButton.disabled = currentPage >= pages - 1;
  };

  const updateDots = () => {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll(".evento-kwanza__carousel-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentPage);
    });
  };

  const update = () => {
    const cardsPerView = getCardsPerView();
    pages = Math.max(1, Math.ceil(cards.length / cardsPerView));
    currentPage = Math.min(currentPage, pages - 1);

    const firstCard = cards[0];
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 0;
    const gap = parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap || "0");
    const offset = currentPage * (cardWidth + gap) * cardsPerView;

    track.style.transform = `translateX(-${offset}px)`;
    buildDots();
    updateButtons();
    updateDots();
  };

  prevButton?.addEventListener("click", () => {
    currentPage = Math.max(0, currentPage - 1);
    update();
  });

  nextButton?.addEventListener("click", () => {
    currentPage = Math.min(pages - 1, currentPage + 1);
    update();
  });

  window.addEventListener("resize", update);
  update();
});
