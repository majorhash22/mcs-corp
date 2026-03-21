/* ================================================ */
/* MALINAY CLEANING SERVICES — script.js            */
/* ================================================ */

/* ===== WORKS CAROUSEL ===== */
const beforeImages = document.querySelectorAll('.before-track img');
const afterImages  = document.querySelectorAll('.after-track img');

if (beforeImages.length && afterImages.length) {
  const worksNext = document.getElementById('worksNext');
  const worksPrev = document.getElementById('worksPrev');
  const worksDotsContainer = document.getElementById('worksDots');
  let worksIndex = 0;

  // Build dots
  beforeImages.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => { worksIndex = i; updateWorks(); });
    worksDotsContainer.appendChild(dot);
  });

  const worksDots = Array.from(worksDotsContainer.children);

  function updateWorks() {
    beforeImages.forEach(img => img.classList.remove('active'));
    afterImages.forEach(img  => img.classList.remove('active'));
    worksDots.forEach(dot    => dot.classList.remove('active'));
    beforeImages[worksIndex].classList.add('active');
    afterImages[worksIndex].classList.add('active');
    worksDots[worksIndex].classList.add('active');
  }

  worksNext.addEventListener('click', () => {
    worksIndex = (worksIndex + 1) % beforeImages.length;
    updateWorks();
  });

  worksPrev.addEventListener('click', () => {
    worksIndex = (worksIndex - 1 + beforeImages.length) % beforeImages.length;
    updateWorks();
  });

  // Touch / swipe support
  let touchStartX = 0;
  const worksCarousel = document.querySelector('.works-carousel');
  worksCarousel.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  worksCarousel.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      worksIndex = diff > 0
        ? (worksIndex + 1) % beforeImages.length
        : (worksIndex - 1 + beforeImages.length) % beforeImages.length;
      updateWorks();
    }
  }, { passive: true });

  updateWorks();
}

/* ===== FADE IN ON SCROLL ===== */
const faders = document.querySelectorAll('.fade-in');

if (faders.length) {
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  faders.forEach(fader => appearOnScroll.observe(fader));
}

/* ===== SERVICES CAROUSEL ===== */
const track = document.querySelector('.carousel-track');

if (track) {
  const items         = Array.from(track.children);
  const nextButton    = document.getElementById('next');
  const prevButton    = document.getElementById('prev');
  const dotsContainer = document.querySelector('.carousel-dots');
  let index = 0;

  items.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dotsContainer.appendChild(dot);
    dot.addEventListener('click', () => { index = i; updateCarousel(); });
  });

  const dots = Array.from(dotsContainer.children);

  function updateCarousel() {
    items.forEach(item => item.classList.remove('active'));
    dots.forEach(dot  => dot.classList.remove('active'));
    items[index].classList.add('active');
    dots[index].classList.add('active');

    const carouselWidth = track.parentElement.offsetWidth;
    const trackWidth    = track.scrollWidth;
    const itemWidth     = items[index].offsetWidth;

    let offset = items[index].offsetLeft - (carouselWidth - itemWidth) / 2;
    if (offset < 0) offset = 0;
    const maxOffset = trackWidth - carouselWidth;
    if (offset > maxOffset) offset = maxOffset;

    track.style.transform = `translateX(-${offset}px)`;
  }

  nextButton.addEventListener('click', () => {
    index = (index + 1) % items.length;
    updateCarousel();
  });

  prevButton.addEventListener('click', () => {
    index = (index - 1 + items.length) % items.length;
    updateCarousel();
  });

  setInterval(() => {
    index = (index + 1) % items.length;
    updateCarousel();
  }, 5000);

  updateCarousel();
}

/* ===== TESTIMONIALS CAROUSEL ===== */
const tTrack = document.getElementById('testimonialsTrack');

if (tTrack) {
  const tCards         = Array.from(tTrack.children);
  const tDotsContainer = document.getElementById('testimonialDots');
  const tPrev          = document.getElementById('testimonialPrev');
  const tNext          = document.getElementById('testimonialNext');
  let tIndex = 0;

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w <= 768)  return 1;
    if (w <= 1024) return 2;
    return 3;
  }

  function buildDots() {
    tDotsContainer.innerHTML = '';
    const count = Math.max(1, tCards.length - getVisibleCount() + 1);
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => { tIndex = i; updateTestimonials(); });
      tDotsContainer.appendChild(dot);
    }
  }

  function updateTestimonials() {
    const visibleCount = getVisibleCount();
    const maxIndex     = Math.max(0, tCards.length - visibleCount);
    if (tIndex > maxIndex) tIndex = maxIndex;
    if (tIndex < 0)        tIndex = 0;

    const cardWidth = tCards[0].offsetWidth + 30;
    tTrack.style.transform = `translateX(-${tIndex * cardWidth}px)`;

    const dots = tDotsContainer.querySelectorAll('span');
    dots.forEach((d, i) => d.classList.toggle('active', i === tIndex));
  }

  tNext.addEventListener('click', () => {
    const maxIndex = Math.max(0, tCards.length - getVisibleCount());
    tIndex = tIndex >= maxIndex ? 0 : tIndex + 1;
    updateTestimonials();
  });

  tPrev.addEventListener('click', () => {
    const maxIndex = Math.max(0, tCards.length - getVisibleCount());
    tIndex = tIndex <= 0 ? maxIndex : tIndex - 1;
    updateTestimonials();
  });

  window.addEventListener('resize', () => { buildDots(); updateTestimonials(); });

  buildDots();
  updateTestimonials();
}

/* ===== EXPLORE SERVICES — card fade-in ===== */
const serviceCards = document.querySelectorAll('.service-detail-card');

if (serviceCards.length) {
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  serviceCards.forEach(card => cardObserver.observe(card));
}

/* ---- Blob sweep + Bubble rise on section titles ---- */
(function () {

  // ── Shared SVG filter for organic blob edges ──
  (function injectFilter() {
    if (document.getElementById('blob-filter')) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.cssText = 'position:absolute;pointer-events:none;';
    svg.innerHTML = `
      <defs>
        <filter id="blob-filter" x="-20%" y="-40%" width="140%" height="180%"
                color-interpolation-filters="sRGB">
          <feTurbulence type="turbulence" baseFrequency="0.012 0.020"
                        numOctaves="3" seed="8" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise"
                             scale="22" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>`;
    document.body.appendChild(svg);
  })();

  // ── Blob definitions ──
  const BLOB_DEFS = [
    { wF: 2.8, hF: 0.90, vy:  0,  alpha: 0.20, del: '0.00s', dur: '1.6s' },
    { wF: 1.6, hF: 0.70, vy: -6,  alpha: 0.15, del: '0.18s', dur: '1.5s' },
    { wF: 3.4, hF: 1.05, vy:  4,  alpha: 0.13, del: '0.34s', dur: '1.7s' },
    { wF: 2.0, hF: 0.80, vy: -4,  alpha: 0.17, del: '0.50s', dur: '1.55s'},
    { wF: 2.6, hF: 0.95, vy:  2,  alpha: 0.12, del: '0.66s', dur: '1.65s'},
  ];

  // ── Bubble definitions (fraction-based, same as before) ──
  const BUBBLE_DEFS = [
    { sz: 28, xF: 0.00, x2F: 0.02, yPx: -100, del: '0.00s', dur: '1.8s' },
    { sz: 16, xF: 0.06, x2F: 0.04, yPx: -120, del: '0.12s', dur: '1.5s' },
    { sz: 22, xF: 0.13, x2F: 0.15, yPx: -105, del: '0.06s', dur: '1.7s' },
    { sz: 12, xF: 0.20, x2F: 0.18, yPx: -130, del: '0.20s', dur: '1.4s' },
    { sz: 30, xF: 0.28, x2F: 0.30, yPx:  -95, del: '0.03s', dur: '1.9s' },
    { sz: 18, xF: 0.36, x2F: 0.34, yPx: -115, del: '0.15s', dur: '1.6s' },
    { sz: 24, xF: 0.44, x2F: 0.46, yPx: -110, del: '0.09s', dur: '1.8s' },
    { sz: 14, xF: 0.52, x2F: 0.50, yPx: -125, del: '0.25s', dur: '1.5s' },
    { sz: 20, xF: 0.60, x2F: 0.62, yPx:  -90, del: '0.18s', dur: '1.7s' },
    { sz: 10, xF: 0.68, x2F: 0.66, yPx: -118, del: '0.30s', dur: '1.3s' },
    { sz: 26, xF: 0.76, x2F: 0.78, yPx: -100, del: '0.07s', dur: '1.9s' },
    { sz: 15, xF: 0.85, x2F: 0.83, yPx: -112, del: '0.22s', dur: '1.5s' },
  ];

  function buildAnimations(banner) {
    const titleEl = banner.querySelector('.section-title') || banner;
    banner.style.position = 'relative';

    // Two separate wraps — blobs on the title, bubbles below it
    const blobWrap   = document.createElement('div');
    blobWrap.className = 'blob-wrap';
    banner.appendChild(blobWrap);

    const bubbleWrap = document.createElement('div');
    bubbleWrap.className = 'bubble-wrap';
    banner.appendChild(bubbleWrap);

    function animate() {
      blobWrap.innerHTML   = '';
      bubbleWrap.innerHTML = '';

      const bRect   = banner.getBoundingClientRect();
      const tRect   = titleEl.getBoundingClientRect();
      const H       = tRect.height;
      const offsetX = tRect.left - bRect.left;
      const offsetY = tRect.top  - bRect.top;

      // ── Blob wrap covers the title row ──
      blobWrap.style.cssText = `
        position:absolute;
        left:${offsetX}px;
        top:${offsetY}px;
        width:${tRect.width}px;
        height:${H}px;
        overflow:hidden;
        pointer-events:none;
        z-index:10;
        border-radius:4px;
      `;

      BLOB_DEFS.forEach(({ wF, hF, vy, alpha, del, dur }) => {
        const blob = document.createElement('div');
        blob.className = 'blob';
        blob.style.cssText = `
          width:${Math.round(wF * H)}px;
          height:${Math.round(hF * H)}px;
          --alpha:${alpha};
          --vy:${vy}px;
          --del:${del};
          --dur:${dur};
        `;
        blobWrap.appendChild(blob);
      });

      // ── Bubble wrap anchored at bottom-left of title ──
      const anchorX = offsetX;
      const anchorY = offsetY + H;

      const isMobile  = window.innerWidth < 600;
      const zone      = isMobile ? Math.min(tRect.width, 260) : Math.min(tRect.width, 520);
      const sizeScale = isMobile ? 0.65 : 1;

      bubbleWrap.style.cssText = `
        position:absolute;
        left:${anchorX}px;
        top:${anchorY}px;
        width:0; height:0;
        overflow:visible;
        pointer-events:none;
        z-index:10;
      `;

      BUBBLE_DEFS.forEach(({ sz, xF, x2F, yPx, del, dur }) => {
        const size = Math.round(sz * sizeScale);
        const xPx  = Math.round(xF  * zone);
        const x2Px = Math.round(x2F * zone);
        const b = document.createElement('div');
        b.className = 'bubble';
        b.style.cssText = `
          width:${size}px;
          height:${size}px;
          left:${-size/2}px;
          top:${-size/2}px;
          --x:${xPx}px;
          --x2:${x2Px}px;
          --y:${yPx}px;
          --del:${del};
          --dur:${dur};
        `;
        bubbleWrap.appendChild(b);
      });

      setTimeout(() => { blobWrap.innerHTML = ''; },   2500);
      setTimeout(() => { bubbleWrap.innerHTML = ''; }, 2200);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(animate, 1100);
          observer.unobserve(banner);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(banner);
  }

  document.querySelectorAll('.section-banner').forEach(buildAnimations);
})();
