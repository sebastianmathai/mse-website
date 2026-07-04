const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const backToTop = document.querySelector('.back-to-top');
const darkToggle = document.querySelector('.dark-toggle');

function initSiteConfig() {
  const config = window.SITE_CONFIG || {};

  document.querySelectorAll('[data-config-text]').forEach((element) => {
    const value = config[element.dataset.configText];
    if (value) element.textContent = value;
  });

  document.querySelectorAll('[data-config-html]').forEach((element) => {
    const value = config[element.dataset.configHtml];
    if (value) element.innerHTML = value;
  });

  document.querySelectorAll('[data-config-href]').forEach((element) => {
    const value = config[element.dataset.configHref];
    if (value) element.setAttribute('href', value);
  });

  document.querySelectorAll('[data-config-address]').forEach((element) => {
    if (Array.isArray(config.addressLines)) {
      element.innerHTML = config.addressLines.join('<br>');
    }
  });
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('mse-theme', theme);
  if (darkToggle) darkToggle.setAttribute('aria-pressed', String(theme === 'dark'));
}

function initNavigation() {
  navToggle?.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-menu a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

function initTheme() {
  const saved = localStorage.getItem('mse-theme');
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  setTheme(saved || preferred);
  darkToggle?.addEventListener('click', () => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });
}

function initBackToTop() {
  window.addEventListener('scroll', () => {
    backToTop?.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = Number(counter.dataset.counter);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 60));
      const tick = () => {
        current = Math.min(target, current + step);
        counter.textContent = `${current}+`;
        if (current < target) requestAnimationFrame(tick);
      };
      tick();
      obs.unobserve(counter);
    });
  }, { threshold: 0.35 });
  counters.forEach((counter) => observer.observe(counter));
}

function initReveal() {
  const items = document.querySelectorAll('.reveal:not(.is-visible)');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((item) => observer.observe(item));
}

function initGalleryModal() {
  const modal = document.querySelector('[data-gallery-modal]');
  if (!modal) return;
  const modalImage = modal.querySelector('img');
  const close = modal.querySelector('button');

  document.querySelectorAll('[data-gallery-image]').forEach((image) => {
    image.addEventListener('click', () => {
      modalImage.src = image.src;
      modalImage.alt = image.alt;
      modal.classList.add('open');
    });
  });

  close.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.classList.remove('open');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') modal.classList.remove('open');
  });
}

function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const params = new URLSearchParams(window.location.search);
  const product = params.get('product');
  if (product) form.message.value = `I would like to enquire about ${product}.`;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = ['name', 'phone', 'email', 'message'];
    let valid = true;

    fields.forEach((name) => {
      const field = form.elements[name];
      const error = form.querySelector(`[data-error="${name}"]`);
      let message = '';
      if (!field.value.trim()) message = 'This field is required.';
      if (name === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        message = 'Enter a valid email address.';
      }
      if (name === 'phone' && field.value && !/^[0-9+\-\s()]{7,}$/.test(field.value)) {
        message = 'Enter a valid phone number.';
      }
      error.textContent = message;
      field.setAttribute('aria-invalid', String(Boolean(message)));
      if (message) valid = false;
    });

    const status = form.querySelector('[data-form-status]');
    status.textContent = valid ? 'Thank you. Your enquiry is ready to send to Morning Star Enterprises.' : 'Please correct the highlighted fields.';
    status.className = valid ? 'form-status success' : 'form-status';
    if (valid) form.reset();
  });
}

window.initReveal = initReveal;

document.addEventListener('DOMContentLoaded', () => {
  initSiteConfig();
  initNavigation();
  initTheme();
  initBackToTop();
  initCounters();
  initReveal();
  initGalleryModal();
  initContactForm();
});
