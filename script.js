// Handle Call Click - Redirect to phone on mobile, contact page on desktop
function handleCallClick(event) {
  const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (!isMobile) {
    // On desktop, redirect to contact page
    event.preventDefault();
    window.location.href = 'contact.html';
  }
  // On mobile, let the tel: link handle it naturally
}

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
  let scrollTimeout;
  let lastScrollY = 0;
  
  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
    scrollTimeout = requestAnimationFrame(() => {
      if (lastScrollY > 50) {
        navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        navbar.style.padding = '0.8rem 5%';
      } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
        navbar.style.padding = '1rem 5%';
      }
    });
  }, { passive: true });

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
});
