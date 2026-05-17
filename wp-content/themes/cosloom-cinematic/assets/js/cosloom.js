document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('cosloom-ready');

  const syncScrollState = () => {
    document.documentElement.classList.toggle('cosloom-scrolled', window.scrollY > 18);
  };
  syncScrollState();
  window.addEventListener('scroll', syncScrollState, { passive: true });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const heroMedia = document.querySelector('[data-hero-media]');
  const heroVideo = heroMedia ? heroMedia.querySelector('.hero__video') : null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canUseHeroVideo = heroVideo && !prefersReducedMotion && window.matchMedia('(min-width: 761px)').matches;

  if (canUseHeroVideo) {
    heroVideo.addEventListener('canplay', () => {
      heroMedia.classList.add('is-video-playing');
    }, { once: true });

    heroVideo.play().catch(() => {
      heroMedia.classList.remove('is-video-playing');
    });
  }

  const tabs = Array.from(document.querySelectorAll('.systems-tab'));
  const panels = Array.from(document.querySelectorAll('.system-panel'));
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((item) => {
        item.classList.toggle('is-active', item === tab);
        item.setAttribute('aria-selected', item === tab ? 'true' : 'false');
      });

      panels.forEach((panel) => {
        const isActive = panel.id === tab.getAttribute('aria-controls');
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
      });
    });
  });

  document.querySelectorAll('.quote-form input[type="file"]').forEach((input) => {
    input.addEventListener('change', () => {
      const note = input.closest('.quote-upload-note');
      const status = note ? note.querySelector('[data-file-count]') : null;
      if (status) {
        status.textContent = input.files.length ? `${input.files.length} file${input.files.length === 1 ? '' : 's'} selected` : '';
      }
    });
  });

  document.querySelectorAll('[data-filter-controls]').forEach((controls) => {
    const targetId = controls.getAttribute('data-filter-controls');
    const list = targetId ? document.getElementById(targetId) : null;

    if (!list) {
      return;
    }

    const cards = Array.from(list.querySelectorAll('[data-filter-card]'));
    const empty = list.parentElement ? list.parentElement.querySelector('[data-filter-empty]') : null;

    controls.addEventListener('click', (event) => {
      const button = event.target.closest('[data-filter-value]');

      if (!button) {
        return;
      }

      const value = button.getAttribute('data-filter-value') || 'all';
      let visibleCount = 0;

      controls.querySelectorAll('[data-filter-value]').forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      cards.forEach((card) => {
        const tags = (card.getAttribute('data-tags') || '').split(/\s+/).filter(Boolean);
        const visible = 'all' === value || tags.includes(value);

        card.hidden = !visible;

        if (visible) {
          visibleCount += 1;
        }
      });

      if (empty) {
        empty.hidden = 0 !== visibleCount;
      }
    });
  });
});
