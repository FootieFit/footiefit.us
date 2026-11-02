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

// Analytics helper: sends a GA4 event if the Google tag is loaded. Never send names, emails, or phone numbers.
function ffTrack(name, params) {
  try {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  } catch (err) { /* analytics must never break the page */ }
}

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
        const subjectEl = form.querySelector('input[name="subject"]');
        const trainingEl = form.querySelector('[name="training"]');
        ffTrack('generate_lead', {
          form_name: subjectEl ? subjectEl.value : 'Contact form',
          training_interest: trainingEl && trainingEl.value ? trainingEl.value : '(none)',
          page_path: window.location.pathname
        });
        // Meta Pixel lead event (no personal info sent)
        try { if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: 'SAS Free Trial' }); } catch (err) {}
        form.reset();
        const successEl = form.parentElement.querySelector('.form-success');
        if (successEl) {
          form.hidden = true;
          successEl.hidden = false;
        } else {
          btn.textContent = 'Message Sent!';
          btn.style.background = '#1e4d30';
          btn.style.cursor = 'default';
        }
      } else {
        ffTrack('form_error', { page_path: window.location.pathname, reason: 'web3forms_rejected' });
        btn.textContent = 'Error — Try Again';
        btn.disabled = false;
      }
    })
    .catch(() => {
      ffTrack('form_error', { page_path: window.location.pathname, reason: 'network' });
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

// Track booking/contact button clicks (jumps to the on-page form) and email/phone link clicks
document.addEventListener('click', function (e) {
  const link = e.target.closest ? e.target.closest('a') : null;
  if (!link) return;
  const href = link.getAttribute('href') || '';
  const label = (link.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
  if (href === '#book' || href === '#contact') {
    ffTrack('cta_click', { cta_text: label, cta_target: href, page_path: window.location.pathname });
  } else if (href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) {
    ffTrack('contact_click', { method: href.indexOf('tel:') === 0 ? 'phone' : 'email', page_path: window.location.pathname });
  }
}, true);
