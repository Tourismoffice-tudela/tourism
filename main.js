/* =========================================
   Tudela Tourism Office – Main JS
   - Mobile hamburger menu (3-slash toggle)
   - Image slider for tourist spots & accommodations
   ========================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------
     MOBILE NAV (HAMBURGER)
     --------------------------- */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav   = document.getElementById('main-nav');
  const navList   = mainNav ? mainNav.querySelector('ul') : null;

  const openMenu = () => {
    if (!mainNav) return;
    mainNav.classList.add('open');
    if (navToggle) {
      navToggle.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
    }
    document.body.classList.add('no-scroll');
  };

  const closeMenu = () => {
    if (!mainNav) return;
    mainNav.classList.remove('open');
    if (navToggle) {
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('no-scroll');
  };

  const toggleMenu = () => {
    if (!mainNav) return;
    mainNav.classList.contains('open') ? closeMenu() : openMenu();
  };

  if (navToggle && mainNav && navList) {
    // Initial ARIA state
    navToggle.setAttribute('aria-expanded', 'false');

    // Open/close on hamburger click
    navToggle.addEventListener('click', toggleMenu);

    // Close when a menu link is clicked
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (mainNav.classList.contains('open')) closeMenu();
      });
    });

    // Close menu when clicking outside the header
    document.addEventListener('click', (e) => {
      const header = document.querySelector('header');
      if (!header.contains(e.target) && mainNav.classList.contains('open')) {
        closeMenu();
      }
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        closeMenu();
        navToggle.focus();
      }
    });

    // Automatically close menu when resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 700 && mainNav.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* ---------------------------
     IMAGE SLIDERS
     Handles all sliders with .slider-container
     --------------------------- */
  function initSlider(container) {
    const slides = container.querySelectorAll('.slider-img');
    if (!slides.length) return;

    const prevBtn = container.querySelector('.slider-btn.prev');
    const nextBtn = container.querySelector('.slider-btn.next');

    // Determine starting slide
    let current = Math.max(
      0,
      Array.from(slides).findIndex(img => img.classList.contains('active'))
    );
    if (current === -1) current = 0;

    const showSlide = (idx) => {
      slides.forEach((img, i) => img.classList.toggle('active', i === idx));
    };

    const goPrev = (e) => {
      if (e) e.preventDefault();
      current = (current - 1 + slides.length) % slides.length;
      showSlide(current);
    };

    const goNext = (e) => {
      if (e) e.preventDefault();
      current = (current + 1) % slides.length;
      showSlide(current);
    };

    // Prev and Next button controls
    if (prevBtn) prevBtn.addEventListener('click', goPrev);
    if (nextBtn) nextBtn.addEventListener('click', goNext);

    // Clicking a slide advances to the next
    slides.forEach(img => img.addEventListener('click', goNext));

    // Keyboard navigation support
    [prevBtn, nextBtn].forEach(btn => {
      if (!btn) return;
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goPrev();
        if (e.key === 'ArrowRight') goNext();
      });
    });

    // Initialize the first slide
    showSlide(current);
  }

  // Initialize all sliders on the page
  document.querySelectorAll('.slider-container').forEach(initSlider);
});
