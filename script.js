// ===== SLIDER =====
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentSlide = 0;
let sliderInterval;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function startAutoSlide() {
  sliderInterval = setInterval(nextSlide, 5000);
}

function resetAutoSlide() {
  clearInterval(sliderInterval);
  startAutoSlide();
}

if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => { goToSlide(i); resetAutoSlide(); });
});

startAutoSlide();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
}

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== FADE IN ON SCROLL =====
const fadeElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

fadeElements.forEach(el => observer.observe(el));

// ===== ADD FADE-IN CLASS TO SECTIONS =====
document.querySelectorAll('.service-card, .why-card, .about-text, .about-image, .contact-form-wrap, .contact-map').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-submit');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> تم الارسال بنجاح!';
    btn.style.background = '#27ae60';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 85;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== COUNTER ANIMATION (optional stats) =====
function animateCounter(el, target, duration) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

// ===== GALLERY SLIDER =====
const galleryTrack = document.getElementById('galleryTrack');
const galleryPrevBtn = document.getElementById('galleryPrev');
const galleryNextBtn = document.getElementById('galleryNext');
const galleryDotsContainer = document.getElementById('galleryDots');

let galleryCurrentIndex = 0;
let galleryAutoInterval;

function getGallerySlidesPerView() {
  if (window.innerWidth <= 480) return 1;
  if (window.innerWidth <= 768) return 2;
  return 3;
}

const gallerySlideElements = galleryTrack ? Array.from(galleryTrack.querySelectorAll('.gallery-slide')) : [];
const totalGallerySlides = gallerySlideElements.length;

function getMaxGalleryIndex() {
  return Math.max(0, totalGallerySlides - getGallerySlidesPerView());
}

function updateGallerySlideWidths() {
  const perView = getGallerySlidesPerView();
  gallerySlideElements.forEach(slide => {
    slide.style.minWidth = `calc(100% / ${perView})`;
  });
}

function buildGalleryDots() {
  if (!galleryDotsContainer) return;
  galleryDotsContainer.innerHTML = '';
  const maxIndex = getMaxGalleryIndex();
  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement('button');
    dot.classList.add('gallery-dot');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `الصورة ${i + 1}`);
    dot.addEventListener('click', () => {
      galleryGoTo(i);
      resetGalleryAuto();
    });
    galleryDotsContainer.appendChild(dot);
  }
}

function updateGalleryDots() {
  if (!galleryDotsContainer) return;
  const dots = galleryDotsContainer.querySelectorAll('.gallery-dot');
  dots.forEach((dot, i) => dot.classList.toggle('active', i === galleryCurrentIndex));
}

function galleryGoTo(index) {
  const maxIndex = getMaxGalleryIndex();
  galleryCurrentIndex = Math.max(0, Math.min(index, maxIndex));
  const perView = getGallerySlidesPerView();
  const slideWidthPercent = 100 / perView;
  galleryTrack.style.transform = `translateX(-${galleryCurrentIndex * slideWidthPercent}%)`;
  updateGalleryDots();
}

function galleryGoNext() {
  const maxIndex = getMaxGalleryIndex();
  galleryGoTo(galleryCurrentIndex >= maxIndex ? 0 : galleryCurrentIndex + 1);
}

function galleryGoPrev() {
  const maxIndex = getMaxGalleryIndex();
  galleryGoTo(galleryCurrentIndex <= 0 ? maxIndex : galleryCurrentIndex - 1);
}

function startGalleryAuto() {
  galleryAutoInterval = setInterval(galleryGoNext, 3000);
}

function resetGalleryAuto() {
  clearInterval(galleryAutoInterval);
  startGalleryAuto();
}

if (galleryTrack) {
  updateGallerySlideWidths();
  buildGalleryDots();
  startGalleryAuto();

  if (galleryPrevBtn) {
    galleryPrevBtn.addEventListener('click', () => { galleryGoPrev(); resetGalleryAuto(); });
  }
  if (galleryNextBtn) {
    galleryNextBtn.addEventListener('click', () => { galleryGoNext(); resetGalleryAuto(); });
  }

  // Rebuild on resize
  window.addEventListener('resize', () => {
    updateGallerySlideWidths();
    buildGalleryDots();
    galleryGoTo(0);
  });

  // Touch swipe support
  let galleryTouchStartX = 0;
  galleryTrack.addEventListener('touchstart', (e) => {
    galleryTouchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  galleryTrack.addEventListener('touchend', (e) => {
    const diff = galleryTouchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) galleryGoNext();
      else galleryGoPrev();
      resetGalleryAuto();
    }
  });
}

// ===== TOUCH SWIPE FOR SLIDER =====
let touchStartX = 0;
let touchEndX = 0;

const heroSection = document.querySelector('.hero');
if (heroSection) {
  heroSection.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  heroSection.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      nextSlide();
      resetAutoSlide();
    } else if (touchEndX - touchStartX > 50) {
      prevSlide();
      resetAutoSlide();
    }
  });
}
