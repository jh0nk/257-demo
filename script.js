/* ============================================================
   257VIP — Script
   Smooth scroll, reveal animations, tabs, filters, FAQ, nav
   ============================================================ */

// --- Lenis Smooth Scroll ---
let lenis;
try {
  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
} catch (e) {
  console.log('Lenis not loaded, using native scroll');
}

// --- AOS Init ---
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
});

// --- Nav scroll effect ---
const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 60);
  lastScroll = y;
});

// --- Mobile nav toggle ---
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// --- Package Tabs ---
const pkgTabs = document.querySelectorAll('.pkg-tab');
const pkgContents = document.querySelectorAll('.pkg-content');

pkgTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    pkgTabs.forEach(t => t.classList.remove('active'));
    pkgContents.forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`tab-${target}`).classList.add('active');
  });
});

// --- Fleet Filter ---
const filterBtns = document.querySelectorAll('.filter-btn');
const fleetCards = document.querySelectorAll('.fleet-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    fleetCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity 0.4s, transform 0.4s';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// --- FAQ Accordion ---
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const wasOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

    // Toggle current
    if (!wasOpen) item.classList.add('open');
  });
});

// --- Contact Form (demo) ---
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = '已送出！我們會盡快與您聯繫';
  btn.style.background = 'oklch(0.55 0.12 145)';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 3000);
});

// --- Stat counter animation ---
const observerOptions = {
  threshold: 0.5,
  rootMargin: '0px',
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStats();
      statsObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

function animateStats() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const text = el.textContent;
    const match = text.match(/[\d,]+/);
    if (!match) return;

    const target = parseInt(match[0].replace(/,/g, ''));
    const suffix = text.replace(match[0], '');

    anime({
      targets: { val: 0 },
      val: target,
      duration: 1800,
      easing: 'easeOutExpo',
      update: (anim) => {
        const current = Math.floor(anim.animations[0].currentValue);
        el.textContent = current.toLocaleString() + suffix;
      },
    });
  });
}

// --- Smooth anchor scroll with Lenis ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      if (lenis) {
        lenis.scrollTo(target, { offset: -80 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});
