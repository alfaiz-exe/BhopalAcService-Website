document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Dropdown Toggle (Desktop hover is CSS, this is for mobile click)
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownContent = document.querySelector('.dropdown-content');

  if (dropdownToggle && dropdownContent) {
    dropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      dropdownContent.classList.toggle('show');
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!dropdownToggle.contains(e.target) && !dropdownContent.contains(e.target)) {
        dropdownContent.classList.remove('show');
      }
    });
  }

  // Navbar Sticky Effect with Throttling for Performance
  const navbar = document.querySelector('.navbar');
  let isScrolled = false;

  const updateNavbarState = () => {
    if (!navbar) {
      return;
    }

    const shouldBeScrolled = window.scrollY > 50;

    if (shouldBeScrolled !== isScrolled) {
      isScrolled = shouldBeScrolled;
      navbar.classList.toggle('scrolled', shouldBeScrolled);
    }
  };

  window.addEventListener('scroll', updateNavbarState, { passive: true });
  updateNavbarState();

  // Scroll Animation for Elements - Optimized
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all cards and sections
  document.querySelectorAll('.about-card, .service-item, .faq-item, .section').forEach(el => {
    observer.observe(el);
  });

  // Add a smooth scroll behavior for any anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Service worker policy:
  // - Disable and clean up on localhost to avoid stale-cached HTML during development.
  // - Enable on production hosts for caching benefits.
  const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

  if ('serviceWorker' in navigator) {
    if (isLocalhost) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      }).catch(() => {
        // ignore cleanup errors in local dev
      });

      if ('caches' in window) {
        caches.keys().then((keys) => {
          keys.forEach((key) => caches.delete(key));
        }).catch(() => {
          // ignore cache cleanup errors in local dev
        });
      }
    } else {
      navigator.serviceWorker.register('/service-worker.js').catch(() => {
        // swallow registration errors silently
      });
    }
  }
});
