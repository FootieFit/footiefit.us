/* Footie Fit v2 — main.js */

// Mobile nav toggle
(function () {
  const btn = document.getElementById('mobileToggle');
  const nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.classList.toggle('active', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
    nav.setAttribute('aria-hidden', !isOpen);
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'true');
    });
  });
})();

// Header scroll behavior — add subtle background on scroll
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 60) {
          header.style.background = 'rgba(0, 0, 0, 0.97)';
        } else {
          header.style.background = 'rgba(0, 0, 0, 0.92)';
        }
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// Contact form — submit via Web3Forms then show confirmation
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const formData = new FormData(form);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        btn.textContent = 'Message Sent!';
        btn.style.background = '#1e4d30';
        btn.style.cursor = 'default';
        form.reset();
      } else {
        btn.textContent = 'Error — Try Again';
        btn.disabled = false;
      }
    })
    .catch(() => {
      btn.textContent = 'Error — Try Again';
      btn.disabled = false;
    });
  });
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
