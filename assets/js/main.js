(() => {
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const slideButtons = Array.from(document.querySelectorAll('.hero-count button'));
  const previous = document.querySelector('.hero-prev');
  const next = document.querySelector('.hero-next');
  const hero = document.querySelector('.hero-section');
  let slideIndex = 0;
  let slideshowTimer = null;

  function showSlide(index) {
    if (!slides.length) return;
    slideIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === slideIndex);
      slide.setAttribute('aria-hidden', String(i !== slideIndex));
    });
    slideButtons.forEach((button, i) => {
      button.classList.toggle('is-active', i === slideIndex);
      button.setAttribute('aria-pressed', String(i === slideIndex));
    });
  }
  function stopSlideshow() {
    if (slideshowTimer) window.clearInterval(slideshowTimer);
    slideshowTimer = null;
  }
  function startSlideshow() {
    stopSlideshow();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      slideshowTimer = window.setInterval(() => showSlide(slideIndex + 1), 6500);
    }
  }
  previous?.addEventListener('click', () => { showSlide(slideIndex - 1); startSlideshow(); });
  next?.addEventListener('click', () => { showSlide(slideIndex + 1); startSlideshow(); });
  slideButtons.forEach((button, i) => button.addEventListener('click', () => { showSlide(i); startSlideshow(); }));
  hero?.addEventListener('mouseenter', stopSlideshow);
  hero?.addEventListener('mouseleave', startSlideshow);
  hero?.addEventListener('focusin', stopSlideshow);
  hero?.addEventListener('focusout', startSlideshow);
  showSlide(0);
  startSlideshow();

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  function closeMenu() {
    nav?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open menu');
  }
  menuToggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('is-open') ?? false;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuToggle.innerHTML = open ? '<span class="menu-close">×</span>' : '<span></span><span></span><span></span>';
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => {
    if (nav?.classList.contains('is-open') && !event.target.closest('.header-inner')) closeMenu();
  });

  document.querySelector('.quick-menu')?.addEventListener('click', () => {
    document.querySelector('#destination-search')?.scrollIntoView({behavior:'smooth',block:'center'});
    document.querySelector('#search-keyword')?.focus({preventScroll:true});
  });

  const cards = Array.from(document.querySelectorAll('.destination-card'));
  const filterButtons = Array.from(document.querySelectorAll('.filter-chip'));
  const searchForm = document.querySelector('#destination-search');
  const keywordInput = document.querySelector('#search-keyword');
  const categorySelect = document.querySelector('#search-category');
  const regionSelect = document.querySelector('#search-region');
  const feedback = document.querySelector('#search-feedback');
  const emptyState = document.querySelector('#empty-state');
  let selectedRegion = 'all';
  let selectedCategory = 'all';
  let selectedQuery = '';

  function regionMatches(card, region) {
    const cardRegion = card.dataset.region || '';
    if (region === 'all') return true;
    if (region === 'africa') return ['kenya','africa'].includes(cardRegion);
    return cardRegion === region;
  }
  function applyFilters({announce = false} = {}) {
    const query = selectedQuery.trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const categories = (card.dataset.categories || '').split(/\s+/);
      const text = card.textContent.toLowerCase();
      const matchesQuery = !query || text.includes(query);
      const matchesCategory = selectedCategory === 'all' || categories.includes(selectedCategory);
      const matchesRegion = regionMatches(card, selectedRegion);
      const show = matchesQuery && matchesCategory && matchesRegion;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (emptyState) emptyState.hidden = visible > 0;
    filterButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.region === selectedRegion);
    });
    if (announce && feedback) {
      feedback.textContent = visible
        ? 'Showing ' + visible + ' destination' + (visible === 1 ? '' : 's') + ' matching your selection.'
        : 'No destinations match those options. Try another search.';
    }
  }

  filterButtons.forEach(button => button.addEventListener('click', () => {
    selectedRegion = button.dataset.region || 'all';
    selectedCategory = 'all';
    if (regionSelect) regionSelect.value = selectedRegion;
    if (categorySelect) categorySelect.value = 'all';
    applyFilters({announce:true});
  }));

  searchForm?.addEventListener('submit', event => {
    event.preventDefault();
    selectedQuery = keywordInput?.value || '';
    selectedCategory = categorySelect?.value || 'all';
    selectedRegion = regionSelect?.value || 'all';
    applyFilters({announce:true});
    document.querySelector('#destinations')?.scrollIntoView({behavior:'smooth',block:'start'});
  });

  document.querySelectorAll('[data-category]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      selectedCategory = link.dataset.category || 'all';
      selectedRegion = 'all';
      selectedQuery = '';
      if (keywordInput) keywordInput.value = '';
      if (categorySelect) categorySelect.value = selectedCategory;
      if (regionSelect) regionSelect.value = 'all';
      applyFilters({announce:true});
      document.querySelector('#destinations')?.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });

  document.querySelectorAll('.save-button').forEach(button => {
    button.setAttribute('aria-pressed','false');
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      const saved = button.getAttribute('aria-pressed') === 'true';
      button.setAttribute('aria-pressed', String(!saved));
      button.textContent = saved ? '♡' : '♥';
      const destinationName = (button.getAttribute('aria-label') || 'destination').replace(/^Save |^Remove saved /,'');
      button.setAttribute('aria-label', (saved ? 'Save ' : 'Remove saved ') + destinationName);
    });
  });

  document.querySelectorAll('[data-destination]').forEach(link => {
    link.addEventListener('click', () => {
      const destination = link.dataset.destination;
      const email = document.querySelector('.contact-email');
      if (email && destination) {
        email.href = 'mailto:wintripsafarishelp@gmail.com?subject=' + encodeURIComponent('Enquiry about ' + destination);
      }
    });
  });

  document.querySelectorAll('input[type="date"]').forEach(input => {
    const now = new Date();
    input.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0,10);
  });
})();