/* =========================================
   Tudela Tourism Office – Main JS
   =========================================
   Features:
   1. Mobile hamburger menu toggle
   2. Image sliders (.slider-container)
   3. YouTube intro overlay with sound
      - Skippable by button or ESC key
      - Auto closes when video ends
      - Shows once per session
========================================= */

document.addEventListener('DOMContentLoaded', function () {
  /* ===============================
     1. MOBILE NAV (HAMBURGER MENU)
  =============================== */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('main-nav');
  const navList = mainNav ? mainNav.querySelector('ul') : null;

  const openMenu = () => {
    mainNav.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  };

  const closeMenu = () => {
    mainNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Close menu when a nav link is clicked
    if (navList) {
      navList.querySelectorAll('a').forEach(link =>
        link.addEventListener('click', closeMenu)
      );
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      const header = document.querySelector('header');
      if (!header.contains(e.target) && mainNav.classList.contains('open')) {
        closeMenu();
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        closeMenu();
        navToggle.focus();
      }
    });

    // Close menu if resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 700 && mainNav.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* ===============================
     2. IMAGE SLIDER FUNCTIONALITY
  =============================== */
  function initSlider(container) {
    const slides = container.querySelectorAll('.slider-img');
    if (!slides.length) return;

    const prevBtn = container.querySelector('.slider-btn.prev');
    const nextBtn = container.querySelector('.slider-btn.next');

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

    if (prevBtn) prevBtn.addEventListener('click', goPrev);
    if (nextBtn) nextBtn.addEventListener('click', goNext);

    // Click slide to go to next
    slides.forEach(img => img.addEventListener('click', goNext));

    // Keyboard navigation
    [prevBtn, nextBtn].forEach(btn => {
      if (!btn) return;
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goPrev();
        if (e.key === 'ArrowRight') goNext();
      });
    });

    // Initialize
    showSlide(current);
  }

  // Initialize all sliders
  document.querySelectorAll('.slider-container').forEach(initSlider);

  /* ===============================
     3. YOUTUBE INTRO OVERLAY
  =============================== */
  const overlay = document.getElementById('video-overlay');
  const skipBtn = document.getElementById('skip-btn');

  // Hide the overlay
  const hideOverlay = () => {
    overlay.style.display = 'none';
    try {
      sessionStorage.setItem('promoDismissed', '1'); // remember skip for this session
    } catch (_) {}
  };

  // Check if user has already skipped in this session
  try {
    if (sessionStorage.getItem('promoDismissed') === '1') {
      overlay.style.display = 'none';
    }
  } catch (_) {
    // ignore if session storage not available
  }

  // Skip button click
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      if (window.promoPlayer && typeof window.promoPlayer.stopVideo === 'function') {
        window.promoPlayer.stopVideo();
      }
      hideOverlay();
    });
  }

  // Allow ESC key to skip
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.style.display !== 'none') {
      if (window.promoPlayer && typeof window.promoPlayer.stopVideo === 'function') {
        window.promoPlayer.stopVideo();
      }
      hideOverlay();
    }
  });
});

/* =========================================
   YOUTUBE IFRAME API
   - Detects when video ends
   - Allows auto closing overlay
========================================= */
window.onYouTubeIframeAPIReady = function () {
  const frame = document.getElementById('promo-video');
  if (!frame) return;

  // Create player instance with sound
  window.promoPlayer = new YT.Player('promo-video', {
    events: {
      'onStateChange': function (event) {
        // If video ends, close overlay
        if (event.data === YT.PlayerState.ENDED) {
          const overlay = document.getElementById('video-overlay');
          if (overlay) {
            try {
              sessionStorage.setItem('promoDismissed', '1');
            } catch (_) {}
            overlay.style.display = 'none';
          }
        }
      }
    }
  });
};
