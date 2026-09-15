/* ─────────────────────────────────────
   Eirintelligence Global — Global JavaScript
   ───────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Nav: active link highlight ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Nav: scroll shadow ── */
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  /* ── Mobile hamburger ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('mobile-open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!nav.contains(e.target)) {
        navLinks.classList.remove('mobile-open');
        hamburger.classList.remove('open');
      }
    });
  }

  /* ── Scroll-reveal animation ── */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity 0.55s ease ${i * 0.06}s, transform 0.55s ease ${i * 0.06}s`;
      io.observe(el);
    });

    // Inject .revealed styles once
    const style = document.createElement('style');
    style.textContent = `.revealed { opacity: 1 !important; transform: none !important; }`;
    document.head.appendChild(style);
  }

  /* ── Contact form ──
     NOTE: point FORM_ENDPOINT at your own form backend (e.g. a Formspree
     endpoint created for eirintelligence.com) before launch. Until then,
     submissions fall back to opening the visitor's email client. */
  const FORM_ENDPOINT = ''; // e.g. 'https://formspree.io/f/xxxxxxx'
  const CONTACT_EMAIL = 'kennethwhelan@eirintelligence.com';

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const data = new FormData(form);

      if (!FORM_ENDPOINT) {
        const subject = encodeURIComponent(`[${data.get('topic') || 'Enquiry'}] from ${data.get('first_name') || ''} ${data.get('last_name') || ''}`);
        const body = encodeURIComponent(
          `Name: ${data.get('first_name') || ''} ${data.get('last_name') || ''}\n` +
          `Email: ${data.get('email') || ''}\n` +
          `Company: ${data.get('organisation') || ''}\n` +
          `Topic: ${data.get('topic') || ''}\n\n${data.get('message') || ''}`
        );
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Sending…';

      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: data
        });
        const json = await res.json();
        if (json.ok) {
          form.style.display = 'none';
          const success = document.getElementById('formSuccess');
          if (success) success.style.display = 'block';
        } else {
          throw new Error('Submission failed');
        }
      } catch {
        btn.disabled = false;
        btn.innerHTML = 'Send Message <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>';
        alert(`Something went wrong. Please try again or email us directly at ${CONTACT_EMAIL}`);
      }
    });
  }

  /* ── Product filter tabs ── */
  const filterBtns = document.querySelectorAll('[data-filter]');
  const filterItems = document.querySelectorAll('[data-category]');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.dataset.filter;
        filterItems.forEach(item => {
          if (cat === 'all' || item.dataset.category === cat) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

});
