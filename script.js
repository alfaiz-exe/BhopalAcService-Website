document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // Fade in page on load for a smoother experience.
  requestAnimationFrame(() => {
    body.classList.add('page-ready');
  });

  // Animate internal page navigation.
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');

    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('tel:') ||
      href.startsWith('mailto:') ||
      href.startsWith('javascript:') ||
      link.target === '_blank' ||
      link.hasAttribute('download') ||
      link.classList.contains('dropdown-toggle')
    ) {
      return;
    }

    link.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }

      const targetUrl = new URL(link.href, window.location.origin);

      if (targetUrl.origin !== window.location.origin) {
        return;
      }

      e.preventDefault();
      body.classList.add('page-exit');

      window.setTimeout(() => {
        window.location.href = targetUrl.href;
      }, 220);
    });
  });

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
  let scrollTicking = false;

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

  const updateScrollProgress = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    document.documentElement.style.setProperty('--scroll-progress', `${Math.min(100, Math.max(0, progress))}%`);
  };

  const handleScroll = () => {
    if (scrollTicking) {
      return;
    }

    scrollTicking = true;
    requestAnimationFrame(() => {
      updateNavbarState();
      updateScrollProgress();
      scrollTicking = false;
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  updateNavbarState();
  updateScrollProgress();

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

  const applyRowStaggerDelays = () => {
    const groups = [
      { container: '.about-grid', item: '.about-card' },
      { container: '.services-grid', item: '.service-item' }
    ];

    groups.forEach(({ container, item }) => {
      document.querySelectorAll(container).forEach(grid => {
        const items = Array.from(grid.querySelectorAll(item));

        if (!items.length) {
          return;
        }

        const columns = Math.max(1, getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length);

        items.forEach((card, index) => {
          const colIndex = index % columns;
          card.style.setProperty('--reveal-delay', `${colIndex * 90}ms`);
        });
      });
    });
  };

  applyRowStaggerDelays();
  window.addEventListener('resize', applyRowStaggerDelays, { passive: true });

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

  // Testimonial slider with autoplay and pause-on-hover/focus.
  const slider = document.querySelector('[data-slider]');

  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.testimonial-card'));
    const dots = Array.from(slider.querySelectorAll('.dot'));
    const prevButton = slider.querySelector('[data-prev]');
    const nextButton = slider.querySelector('[data-next]');
    let activeIndex = slides.findIndex(slide => slide.classList.contains('active'));
    let autoplayId;

    if (activeIndex < 0) {
      activeIndex = 0;
    }

    const renderSlide = (index) => {
      activeIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        const isActive = i === activeIndex;
        slide.classList.toggle('active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
      });
    };

    const startAutoplay = () => {
      if (autoplayId || slides.length < 2) {
        return;
      }

      autoplayId = window.setInterval(() => {
        renderSlide(activeIndex + 1);
      }, 4500);
    };

    const stopAutoplay = () => {
      if (!autoplayId) {
        return;
      }

      window.clearInterval(autoplayId);
      autoplayId = undefined;
    };

    prevButton?.addEventListener('click', () => {
      renderSlide(activeIndex - 1);
    });

    nextButton?.addEventListener('click', () => {
      renderSlide(activeIndex + 1);
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        renderSlide(index);
      });
    });

    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    slider.addEventListener('focusin', stopAutoplay);
    slider.addEventListener('focusout', startAutoplay);

    renderSlide(activeIndex);
    startAutoplay();
  }
});
