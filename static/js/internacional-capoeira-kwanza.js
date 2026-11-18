document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxImage = document.querySelector("[data-lightbox-image]");
  const lightboxCaption = document.querySelector("[data-lightbox-caption]");
  const lightboxClose = document.querySelector("[data-lightbox-close]");
  const lightboxPrevious = document.querySelector("[data-lightbox-prev]");
  const lightboxNext = document.querySelector("[data-lightbox-next]");
  let activeTrigger = null;
  let activeGroup = "";

  const groupedImages = () => Array.from(document.querySelectorAll("[data-lightbox-open]"))
    .filter((button) => (button.dataset.lightboxGroup || "") === activeGroup);

  const showImage = (button) => {
    if (!lightbox || !lightboxImage || !button) return;
    activeTrigger = button;
    activeGroup = button.dataset.lightboxGroup || "";
    lightboxImage.src = button.dataset.lightboxSrc || "";
    lightboxImage.alt = button.dataset.lightboxAlt || "";
    if (lightboxCaption) lightboxCaption.textContent = button.dataset.lightboxCaption || "";
    if (!lightbox.open) lightbox.showModal();
  };

  const moveImage = (direction) => {
    const images = groupedImages();
    if (images.length < 2 || !activeTrigger) return;
    const currentIndex = images.indexOf(activeTrigger);
    const nextIndex = (currentIndex + direction + images.length) % images.length;
    showImage(images[nextIndex]);
    activeTrigger.focus();
    if (activeGroup === "gallery") {
      window.trackKwanzaAnalytics?.("event_gallery_navigate", {
        event_name: "internacional_capoeira_kwanza",
        gallery_item: activeTrigger.dataset.analyticsParamGalleryItem || "unknown",
        gallery_action: direction > 0 ? "next" : "previous",
      });
    }
  };

  document.querySelectorAll("[data-lightbox-open]").forEach((button) => {
    button.addEventListener("click", () => showImage(button));
  });

  lightboxClose?.addEventListener("click", () => lightbox?.close());
  lightboxPrevious?.addEventListener("click", () => moveImage(-1));
  lightboxNext?.addEventListener("click", () => moveImage(1));

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  lightbox?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveImage(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      moveImage(1);
    }
  });

  lightbox?.addEventListener("close", () => {
    if (activeGroup === "schedule") {
      window.trackKwanzaAnalytics?.("schedule_image_close", {
        event_name: "internacional_capoeira_kwanza",
        component_name: "event_activity_lightbox",
        page_section: "arquivo_historico",
      });
    }
    activeTrigger?.focus();
    activeTrigger = null;
    activeGroup = "";
  });

  document.querySelectorAll("[data-event-image]").forEach((image) => {
    const frame = image.closest("[data-image-frame]");
    const error = frame?.querySelector("[data-image-error]");
    const markLoaded = () => frame?.classList.add("has-loaded");
    const markError = () => {
      frame?.classList.add("has-error");
      image.hidden = true;
      if (error) error.hidden = false;
    };
    image.addEventListener("load", markLoaded);
    image.addEventListener("error", markError);
    if (image.complete && image.naturalWidth > 0) markLoaded();
    if (image.complete && image.naturalWidth === 0) markError();
  });

  const parseVideo = (provider, identifier, rawUrl) => {
    const normalizedProvider = (provider || "").toLowerCase();
    const id = (identifier || "").trim();
    if (normalizedProvider === "youtube" && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`;
    }
    if (normalizedProvider === "vimeo" && /^\d{5,12}$/.test(id)) {
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    if (!rawUrl) return "";

    try {
      const url = new URL(rawUrl);
      if (url.protocol !== "https:") return "";
      let videoId = "";
      if (normalizedProvider === "youtube") {
        if (["youtube.com", "www.youtube.com", "m.youtube.com", "www.youtube-nocookie.com"].includes(url.hostname)) {
          videoId = url.searchParams.get("v") || url.pathname.match(/^\/embed\/([a-zA-Z0-9_-]{11})/)?.[1] || "";
        } else if (url.hostname === "youtu.be") {
          videoId = url.pathname.slice(1);
        }
        if (/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
          return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`;
        }
      }
      if (normalizedProvider === "vimeo") {
        if (["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(url.hostname)) {
          videoId = url.pathname.match(/(?:\/video)?\/(\d{5,12})\/?$/)?.[1] || "";
        }
        if (/^\d{5,12}$/.test(videoId)) return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
      }
    } catch {
      return "";
    }
    return "";
  };

  document.querySelectorAll("[data-event-local-video]").forEach((video) => {
    const trackVideo = (eventName) => {
      window.trackKwanzaAnalytics?.(eventName, {
        event_name: video.dataset.analyticsParamEventName || "internacional_capoeira_kwanza",
        video_category: video.dataset.analyticsParamVideoCategory || "uncategorized",
      });
    };
    video.addEventListener("play", () => trackVideo("event_video_play"));
    video.addEventListener("ended", () => trackVideo("event_video_complete"));
  });

  document.querySelectorAll("[data-video-load]").forEach((button) => {
    button.addEventListener("click", () => {
      const src = parseVideo(button.dataset.videoProvider, button.dataset.videoId, button.dataset.videoUrl);
      if (!src) {
        button.disabled = true;
        button.setAttribute("aria-disabled", "true");
        return;
      }
      const iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.title = button.dataset.videoTitle || "Capoeira video";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allow = "accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen";
      iframe.allowFullscreen = true;
      button.replaceWith(iframe);
      window.trackKwanzaAnalytics?.("event_video_play", {
        event_name: button.dataset.analyticsParamEventName || "internacional_capoeira_kwanza",
        video_category: button.dataset.analyticsParamVideoCategory || "uncategorized",
      });
    });
  });

  const carousel = document.querySelector("[data-mestres-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector("[data-carousel-track]");
  const viewport = carousel.querySelector("[data-carousel-viewport]");
  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const dotsContainer = carousel.querySelector("[data-carousel-dots]");
  const cards = Array.from(track?.children || []);
  if (!track || cards.length === 0) return;

  const getCardsPerView = () => {
    if (window.innerWidth <= 680) return 1;
    if (window.innerWidth <= 980) return 2;
    if (window.innerWidth <= 1200) return 3;
    return 4;
  };

  let currentPage = 0;
  let pages = 1;

  const update = () => {
    const cardsPerView = getCardsPerView();
    pages = Math.max(1, Math.ceil(cards.length / cardsPerView));
    currentPage = Math.min(currentPage, pages - 1);
    const firstCard = cards[0];
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 0;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "0");
    track.style.transform = `translateX(-${currentPage * (cardWidth + gap) * cardsPerView}px)`;
    if (prevButton) prevButton.disabled = currentPage === 0;
    if (nextButton) nextButton.disabled = currentPage >= pages - 1;
    if (dotsContainer) {
      dotsContainer.innerHTML = "";
      const pageLabel = dotsContainer.dataset.carouselPageLabel || "%current% / %total%";
      Array.from({ length: pages }).forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "evento-kwanza__carousel-dot";
        dot.setAttribute("aria-label", pageLabel
          .replace("%current%", String(index + 1))
          .replace("%total%", String(pages)));
        dot.setAttribute("aria-pressed", String(index === currentPage));
        dot.dataset.analyticsEvent = "carousel_interaction";
        dot.dataset.analyticsParamCarouselName = "formados_mestres";
        dot.dataset.analyticsParamCarouselAction = "dot";
        dot.dataset.analyticsParamCarouselPage = String(index + 1);
        dot.addEventListener("click", () => {
          currentPage = index;
          update();
        });
        dotsContainer.appendChild(dot);
      });
    }
  };

  prevButton?.addEventListener("click", () => {
    currentPage = Math.max(0, currentPage - 1);
    update();
  });
  nextButton?.addEventListener("click", () => {
    currentPage = Math.min(pages - 1, currentPage + 1);
    update();
  });
  let touchStart = null;
  viewport?.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1) {
      touchStart = null;
      return;
    }
    const touch = event.touches[0];
    touchStart = { id: touch.identifier, x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  viewport?.addEventListener("touchend", (event) => {
    if (!touchStart || event.touches.length !== 0) {
      touchStart = null;
      return;
    }
    const touch = Array.from(event.changedTouches).find((item) => item.identifier === touchStart.id);
    if (!touch) {
      touchStart = null;
      return;
    }
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    const nextPage = Math.max(0, Math.min(pages - 1, currentPage + (deltaX < 0 ? 1 : -1)));
    if (nextPage === currentPage) return;
    currentPage = nextPage;
    update();
    window.trackKwanzaAnalytics?.("carousel_interaction", {
      carousel_name: "formados_mestres",
      carousel_action: deltaX < 0 ? "swipe_next" : "swipe_previous",
    });
  }, { passive: true });
  viewport?.addEventListener("touchcancel", () => { touchStart = null; }, { passive: true });
  window.addEventListener?.("resize", update);
  update();
});
