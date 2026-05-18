/* ============================================================
   PRINSER LIMITED — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAVBAR ---- */
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  const updateNavbar = () => {
    if (!navbar) return;
    const isLight = navbar.classList.contains('light-nav');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
      if (isLight) navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu?.classList.toggle('open');
  });

  /* Mobile dropdown toggles */
  dropdowns.forEach(dd => {
    const link = dd.querySelector('.nav-link');
    link?.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        dd.classList.toggle('open');
      }
    });
  });

  /* Close nav on link click */
  navMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('open');
      }
    });
  });

  /* ---- BACK TO TOP ---- */
  const backTop = document.querySelector('.back-to-top');
  window.addEventListener('scroll', () => {
    backTop?.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---- SCROLL REVEAL ---- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => revealObs.observe(el));
  }

  /* ---- STATS COUNTER ---- */
  const stats = document.querySelectorAll('.stat-number[data-target]');
  if (stats.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();
        const update = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
        counterObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    stats.forEach(el => counterObs.observe(el));
  }

  /* ---- CONTACT FORM ---- */
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    const origText = btn.innerHTML;
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><circle cx="12" cy="12" r="10"/></svg> Sending...';
    btn.disabled = true;

    /* Compose WhatsApp message from form */
    const name = contactForm.querySelector('[name="name"]')?.value || '';
    const phone = contactForm.querySelector('[name="phone"]')?.value || '';
    const service = contactForm.querySelector('[name="service"]')?.value || '';
    const message = contactForm.querySelector('[name="message"]')?.value || '';
    const waText = encodeURIComponent(`Hello Prinser Limited!\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}`);

    setTimeout(() => {
      btn.innerHTML = origText;
      btn.disabled = false;
      showNotification('Message sent! We will contact you shortly.', 'success');
      contactForm.reset();
      /* Open WhatsApp with form data */
      window.open(`https://wa.me/254724844305?text=${waText}`, '_blank');
    }, 1200);
  });

  /* ---- NOTIFICATION ---- */
  function showNotification(msg, type = 'success') {
    let notif = document.querySelector('.notification');
    if (!notif) {
      notif = document.createElement('div');
      notif.className = 'notification';
      document.body.appendChild(notif);
    }
    notif.className = `notification ${type}`;
    notif.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        ${type === 'success'
          ? '<polyline points="20 6 9 17 4 12"/>'
          : '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'}
      </svg>
      ${msg}`;
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 4000);
  }

  /* ---- QUOTE FORM ---- */
  const quoteForm = document.getElementById('quoteForm');
  quoteForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = quoteForm.querySelector('[name="name"]')?.value || '';
    const phone = quoteForm.querySelector('[name="phone"]')?.value || '';
    const service = quoteForm.querySelector('[name="service"]')?.value || '';
    const details = quoteForm.querySelector('[name="details"]')?.value || '';
    const waText = encodeURIComponent(`Hello! I need a quote.\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nDetails: ${details}`);
    window.open(`https://wa.me/254724844305?text=${waText}`, '_blank');
    showNotification('Redirecting to WhatsApp...', 'success');
    quoteForm.reset();
  });

  /* ---- PRODUCT FILTER ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      productCards.forEach(card => {
        const show = cat === 'all' || card.dataset.category === cat;
        card.style.display = show ? '' : 'none';
        if (show) {
          card.style.animation = 'fadeInUp 0.35s ease forwards';
        }
      });
    });
  });

  /* ---- SMOOTH SCROLL for anchors ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 75;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 10;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- LAZY IMAGES ---- */
  const lazyImgs = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window && lazyImgs.length) {
    const imgObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imgObs.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    lazyImgs.forEach(img => imgObs.observe(img));
  }

  /* ---- ACTIVE NAV LINK ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

});

/* Spin animation for loading states */
const style = document.createElement('style');
style.textContent = `
  .spin { animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);
