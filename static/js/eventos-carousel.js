document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.eventos-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.eventos-track');
  const cards = Array.from(track.querySelectorAll('.evento-card'));
  const prevBtn = document.querySelector('.eventos-prev');
  const nextBtn = document.querySelector('.eventos-next');
  const dotsContainer = document.querySelector('.eventos-dots');

  let currentPage = 0;
  let cardsPerPage = 3;
  let autoPlayInterval = null;
  const autoPlayDelay = 5000; // 5 segundos

  // Detectar número de cards visíveis baseado na largura da tela
  function updateCardsPerPage() {
    const width = window.innerWidth;
    if (width <= 600) {
      cardsPerPage = 1;
    } else if (width <= 900) {
      cardsPerPage = 2;
    } else {
      cardsPerPage = 3;
    }
  }

  const totalPages = () => Math.ceil(cards.length / cardsPerPage);

  // Criar indicadores (dots)
  function createDots() {
    dotsContainer.innerHTML = '';
    const pages = totalPages();
    
    if (pages <= 1) {
      dotsContainer.style.display = 'none';
      return;
    }
    
    dotsContainer.style.display = 'flex';
    
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.className = 'eventos-dot';
      dot.setAttribute('aria-label', `Ir para página ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        stopAutoPlay();
        goToPage(i);
        startAutoPlay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  // Atualizar posição do carrossel
  function updateCarousel() {
    const offset = currentPage * cardsPerPage;
    const cardWidth = cards[0].offsetWidth;
    const gap = 32; // var(--space-lg)
    const distance = (cardWidth + gap) * offset;
    
    track.style.transform = `translateX(-${distance}px)`;

    // Atualizar botões
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage >= totalPages() - 1;

    // Atualizar dots
    const dots = dotsContainer.querySelectorAll('.eventos-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentPage);
    });
  }

  // Ir para página específica
  function goToPage(page) {
    const maxPage = totalPages() - 1;
    currentPage = Math.max(0, Math.min(page, maxPage));
    updateCarousel();
  }

  // Avançar automaticamente
  function autoAdvance() {
    const maxPage = totalPages() - 1;
    if (currentPage < maxPage) {
      goToPage(currentPage + 1);
    } else {
      // Volta ao início quando chega no final
      goToPage(0);
    }
  }

  // Iniciar auto-play
  function startAutoPlay() {
    // Só inicia auto-play se houver mais de uma página
    if (totalPages() > 1) {
      stopAutoPlay(); // Limpa qualquer timer existente
      autoPlayInterval = setInterval(autoAdvance, autoPlayDelay);
    }
  }

  // Parar auto-play
  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  // Navegação
  prevBtn.addEventListener('click', () => {
    stopAutoPlay();
    goToPage(currentPage - 1);
    startAutoPlay();
  });

  nextBtn.addEventListener('click', () => {
    stopAutoPlay();
    goToPage(currentPage + 1);
    startAutoPlay();
  });

  // Suporte a teclado
  prevBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      prevBtn.click();
    }
  });

  nextBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      nextBtn.click();
    }
  });

  // Pausar auto-play quando o mouse está sobre o carrossel
  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);

  // Pausar auto-play quando o usuário está interagindo
  carousel.addEventListener('focusin', stopAutoPlay);
  carousel.addEventListener('focusout', startAutoPlay);

  // Redimensionamento da janela
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const oldCardsPerPage = cardsPerPage;
      updateCardsPerPage();
      
      if (oldCardsPerPage !== cardsPerPage) {
        currentPage = 0;
        createDots();
        updateCarousel();
        stopAutoPlay();
        startAutoPlay();
      }
    }, 150);
  });

  // Pausar auto-play quando a aba não está visível
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  });

  // Inicializar
  updateCardsPerPage();
  createDots();
  updateCarousel();

  // Ocultar navegação se houver poucos eventos
  if (cards.length <= cardsPerPage) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  } else {
    // Iniciar auto-play
    startAutoPlay();
  }
});
