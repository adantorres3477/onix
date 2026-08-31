/* ==========================================================================
   ONIX — app.js
   JavaScript Vanilla. Sin frameworks ni librerías externas.
   ========================================================================== */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     HEADER DINÁMICO AL HACER SCROLL
  ------------------------------------------------------------------ */
  const siteHeader = document.getElementById('siteHeader');
  const onHeaderScroll = () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onHeaderScroll, { passive: true });
  onHeaderScroll();

  /* ------------------------------------------------------------------
     MENÚ MÓVIL
  ------------------------------------------------------------------ */
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');

  const closeMenu = () => {
    primaryNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    primaryNav.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Cerrar menú');
    document.body.style.overflow = 'hidden';
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  primaryNav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && window.innerWidth <= 900) closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });

  /* ------------------------------------------------------------------
     HERO: SLIDER, AUTOPLAY, INDICADORES
  ------------------------------------------------------------------ */
  const heroSlides = Array.from(document.querySelectorAll('.hero__slide'));
  const heroIndicators = Array.from(document.querySelectorAll('.hero-indicators li'));
  let currentSlide = 0;
  let heroTimer = null;
  const HERO_INTERVAL = 6000;

  const goToSlide = (index) => {
    heroSlides[currentSlide].classList.remove('is-active');
    heroIndicators[currentSlide].classList.remove('active');
    heroIndicators[currentSlide].removeAttribute('aria-current');

    currentSlide = (index + heroSlides.length) % heroSlides.length;

    heroSlides[currentSlide].classList.add('is-active');
    heroIndicators[currentSlide].classList.add('active');
    heroIndicators[currentSlide].setAttribute('aria-current', 'true');
  };

  const startHeroAutoplay = () => {
    stopHeroAutoplay();
    if (prefersReducedMotion) return;
    heroTimer = setInterval(() => goToSlide(currentSlide + 1), HERO_INTERVAL);
  };

  const stopHeroAutoplay = () => {
    if (heroTimer) clearInterval(heroTimer);
  };

  heroIndicators.forEach((li, index) => {
    const select = () => { goToSlide(index); startHeroAutoplay(); };
    li.addEventListener('click', select);
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); }
    });
  });

  startHeroAutoplay();

  /* ------------------------------------------------------------------
     HERO: ANIMACIÓN DE ENTRADA
  ------------------------------------------------------------------ */
  const hero = document.getElementById('hero');
  const animatedEls = Array.from(hero.querySelectorAll('[data-anim]'));

  window.addEventListener('DOMContentLoaded', () => {
    animatedEls.forEach((el, i) => {
      const delay = prefersReducedMotion ? 0 : 250 + i * 180;
      setTimeout(() => el.classList.add('in'), delay);
    });
  });

  /* ------------------------------------------------------------------
     HERO: PARALLAX CON MOUSEMOVE
  ------------------------------------------------------------------ */
  if (!prefersReducedMotion) {
    let rafId = null;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      if (!rafId) rafId = requestAnimationFrame(updateParallax);
    });

    hero.addEventListener('mouseleave', () => {
      targetX = 0; targetY = 0;
      if (!rafId) rafId = requestAnimationFrame(updateParallax);
    });

    function updateParallax() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      const activeSlide = heroSlides[currentSlide];
      if (activeSlide) {
        activeSlide.style.transform = `scale(1.04) translate(${currentX * -10}px, ${currentY * -10}px)`;
      }
      const content = hero.querySelector('.hero__content');
      if (content) {
        content.style.transform = `translate(${currentX * 6}px, ${currentY * 4}px)`;
      }

      if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
        rafId = requestAnimationFrame(updateParallax);
      } else {
        rafId = null;
      }
    }
  }

  /* ------------------------------------------------------------------
     HERO: EFECTO DE SCROLL
  ------------------------------------------------------------------ */
  if (!prefersReducedMotion) {
    let ticking = false;
    const heroContent = hero.querySelector('.hero__content');

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;
        const progress = Math.min(scrollY / heroHeight, 1);

        heroContent.style.opacity = String(1 - progress * 1.3);
        hero.style.backgroundPositionY = `${scrollY * 0.3}px`;

        ticking = false;
      });
    }, { passive: true });
  }

  const heroScrollCue = document.getElementById('heroScrollCue');
  heroScrollCue.addEventListener('click', () => {
    document.querySelector('.benefits').scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ------------------------------------------------------------------
     CARRITO
  ------------------------------------------------------------------ */
  const cartCountEl = document.getElementById('cartCount');
  const cartIconBtn = document.getElementById('cartIconBtn');
  const toast = document.getElementById('cartToast');
  let cartCount = 0;
  let toastTimer = null;

  const showToast = (message) => {
    toast.innerHTML = `<i class="fa-solid fa-circle-check" aria-hidden="true"></i> ${message}`;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  };

  document.querySelectorAll('.btn--add').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const name = card?.dataset.productName || 'Producto';

      cartCount += 1;
      cartCountEl.textContent = String(cartCount);
      cartCountEl.setAttribute('value', String(cartCount));

      cartIconBtn.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }],
        { duration: prefersReducedMotion ? 1 : 380, easing: 'ease-out' }
      );

      const originalText = btn.textContent;
      btn.textContent = 'AGREGADO ✓';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 1400);

      showToast(`${name} se agregó al carrito`);
    });
  });

  /* ------------------------------------------------------------------
     WISHLIST
  ------------------------------------------------------------------ */
  const wishlistCountEl = document.getElementById('wishlistCount');
  let wishlistCount = 0;

  document.querySelectorAll('.wishlist-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const isActive = btn.classList.toggle('is-active');
      btn.setAttribute('aria-pressed', String(isActive));
      wishlistCount += isActive ? 1 : -1;
      wishlistCountEl.textContent = String(wishlistCount);
      wishlistCountEl.setAttribute('value', String(wishlistCount));
    });
  });

  /* ------------------------------------------------------------------
     NEWSLETTER
  ------------------------------------------------------------------ */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterMessage = document.getElementById('newsletterMessage');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const isValid = newsletterEmail.checkValidity();
    newsletterMessage.classList.remove('is-error', 'is-success');

    if (!isValid) {
      newsletterMessage.textContent = 'Ingresa un correo electrónico válido.';
      newsletterMessage.classList.add('is-error');
      return;
    }

    newsletterMessage.textContent = '¡Listo! Revisa tu bandeja de entrada para confirmar tu suscripción.';
    newsletterMessage.classList.add('is-success');
    newsletterForm.reset();
  });

  /* ------------------------------------------------------------------
     ASIDE: CHAT DE AYUDA
  ------------------------------------------------------------------ */
  const helpToggle = document.getElementById('helpToggle');
  const helpPanel = document.getElementById('helpPanel');
  const helpClose = document.getElementById('helpClose');

  const openHelp = () => {
    helpPanel.hidden = false;
    requestAnimationFrame(() => helpPanel.setAttribute('data-open', 'true'));
    helpToggle.setAttribute('aria-expanded', 'true');
  };

  const closeHelp = () => {
    helpPanel.setAttribute('data-open', 'false');
    helpToggle.setAttribute('aria-expanded', 'false');
    setTimeout(() => { helpPanel.hidden = true; }, 250);
  };

  helpToggle.addEventListener('click', () => {
    helpPanel.hidden ? openHelp() : closeHelp();
  });
  helpClose.addEventListener('click', closeHelp);

  document.addEventListener('click', (e) => {
    if (!helpPanel.hidden && !helpPanel.contains(e.target) && !helpToggle.contains(e.target)) {
      closeHelp();
    }
  });

  /* ------------------------------------------------------------------
     TRENDING: SLIDER HORIZONTAL
  ------------------------------------------------------------------ */
  const trendingTrack = document.getElementById('trendingTrack');
  const trendingPrev = document.getElementById('trendingPrev');
  const trendingNext = document.getElementById('trendingNext');

  const trendingScrollAmount = () => {
    const item = trendingTrack.querySelector('.trending__item');
    return item ? item.getBoundingClientRect().width + 22 : 260;
  };

  trendingPrev.addEventListener('click', () => {
    trendingTrack.scrollBy({ left: -trendingScrollAmount(), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
  trendingNext.addEventListener('click', () => {
    trendingTrack.scrollBy({ left: trendingScrollAmount(), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ------------------------------------------------------------------
     MODAL DE AUTENTICACIÓN: INICIO DE SESIÓN / REGISTRO
  ------------------------------------------------------------------ */
  const authOverlay = document.getElementById('authModalOverlay');
  const authClose = document.getElementById('authModalClose');
  const authMessage = document.getElementById('authModalMessage');
  const loginTabBtn = document.getElementById('loginTabBtn');
  const registerTabBtn = document.getElementById('registerTabBtn');
  const loginPanel = document.getElementById('loginPanel');
  const registerPanel = document.getElementById('registerPanel');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  let lastFocusedTrigger = null;

  const setFieldError = (key, message) => {
    const errorEl = document.querySelector(`[data-error-for="${key}"]`);
    if (!errorEl) return;
    errorEl.textContent = message || '';
    const field = errorEl.closest('.form-field');
    if (field) field.classList.toggle('has-error', Boolean(message));
  };

  const clearAuthMessage = () => {
    authMessage.textContent = '';
    authMessage.className = 'auth-modal__message';
  };

  const switchAuthTab = (tab) => {
    const isLogin = tab !== 'register';

    loginTabBtn.classList.toggle('is-active', isLogin);
    registerTabBtn.classList.toggle('is-active', !isLogin);
    loginTabBtn.setAttribute('aria-selected', String(isLogin));
    registerTabBtn.setAttribute('aria-selected', String(!isLogin));

    loginPanel.hidden = !isLogin;
    registerPanel.hidden = isLogin;

    clearAuthMessage();

    const panelToFocus = isLogin ? loginPanel : registerPanel;
    const firstInput = panelToFocus.querySelector('input');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), prefersReducedMotion ? 0 : 150);
    }
  };

  const openAuthModal = (tab) => {
    lastFocusedTrigger = document.activeElement;
    authOverlay.hidden = false;
    requestAnimationFrame(() => authOverlay.classList.add('is-visible'));
    document.body.style.overflow = 'hidden';
    switchAuthTab(tab || 'login');
  };

  const closeAuthModal = () => {
    authOverlay.classList.remove('is-visible');
    document.body.style.overflow = '';
    clearAuthMessage();
    setTimeout(() => { authOverlay.hidden = true; }, prefersReducedMotion ? 0 : 250);
    if (lastFocusedTrigger) lastFocusedTrigger.focus();
  };

  document.querySelectorAll('[data-modal-open]').forEach((btn) => {
    btn.addEventListener('click', () => openAuthModal(btn.dataset.modalOpen));
  });

  authClose.addEventListener('click', closeAuthModal);

  authOverlay.addEventListener('click', (e) => {
    if (e.target === authOverlay) closeAuthModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !authOverlay.hidden) closeAuthModal();
  });

  [loginTabBtn, registerTabBtn].forEach((btn) => {
    btn.addEventListener('click', () => switchAuthTab(btn.dataset.tab));
  });

  document.querySelectorAll('.auth-modal__switch button[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => switchAuthTab(btn.dataset.tab));
  });

  /* Validación y envío: LOGIN */
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');

    if (!email.checkValidity()) {
      setFieldError('loginEmail', 'Ingresa un correo electrónico válido.');
      valid = false;
    } else {
      setFieldError('loginEmail', '');
    }

    if (!password.checkValidity()) {
      setFieldError('loginPassword', 'La contraseña debe tener al menos 6 caracteres.');
      valid = false;
    } else {
      setFieldError('loginPassword', '');
    }

    if (!valid) return;

    authMessage.textContent = `¡Bienvenido de nuevo! Iniciaste sesión con ${email.value}.`;
    authMessage.className = 'auth-modal__message is-success';
    loginForm.reset();
    setTimeout(closeAuthModal, 1600);
  });

  /* Validación y envío: REGISTRO */
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('registerName');
    const email = document.getElementById('registerEmail');
    const password = document.getElementById('registerPassword');
    const confirm = document.getElementById('registerPasswordConfirm');
    const terms = registerForm.querySelector('[name="terms"]');

    if (!name.value.trim()) {
      setFieldError('registerName', 'Ingresa tu nombre completo.');
      valid = false;
    } else {
      setFieldError('registerName', '');
    }

    if (!email.checkValidity()) {
      setFieldError('registerEmail', 'Ingresa un correo electrónico válido.');
      valid = false;
    } else {
      setFieldError('registerEmail', '');
    }

    if (!password.checkValidity()) {
      setFieldError('registerPassword', 'La contraseña debe tener al menos 6 caracteres.');
      valid = false;
    } else {
      setFieldError('registerPassword', '');
    }

    if (!confirm.value || confirm.value !== password.value) {
      setFieldError('registerPasswordConfirm', 'Las contraseñas no coinciden.');
      valid = false;
    } else {
      setFieldError('registerPasswordConfirm', '');
    }

    if (!terms.checked) {
      setFieldError('registerTerms', 'Debes aceptar los términos y condiciones.');
      valid = false;
    } else {
      setFieldError('registerTerms', '');
    }

    if (!valid) return;

    authMessage.textContent = `¡Cuenta creada! Enviamos un correo de confirmación a ${email.value}.`;
    authMessage.className = 'auth-modal__message is-success';
    registerForm.reset();
    setTimeout(closeAuthModal, 1800);
  });

  /* ------------------------------------------------------------------
     INTERSECTION OBSERVER: REVEAL AL HACER SCROLL
  ------------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll('.fade-up, .fade-left, .fade-right');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

})();
