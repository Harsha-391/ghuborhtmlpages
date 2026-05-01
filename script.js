/* ═══════════════════════════════════════════
   GHUBOR — DROP 01 — BONE ASH INTERACTIONS
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Product Data ──
  const products = [
    {
      name: 'Shadow Hoodie',
      price: '₹3,499',
      scripture: 'The hood drawn low. Not hiding — hunting.\n280 GSM brushed fleece.\nDarkness worn willingly.',
      tags: ['280 GSM', 'Brushed Fleece', 'Oversized']
    },
    {
      name: 'Bone Tee',
      price: '₹2,999',
      scripture: 'Wearable scripture. For the silent war.\n280 GSM raw cotton.\nThe armor becomes skin.\n\nNot cloth — covenant.\nEach thread pulled from the marrow\nof something that refused to fall.',
      tags: ['280 GSM', 'Raw Cotton', 'Oversized']
    },
    {
      name: 'Wraith Jacket',
      price: '₹5,999',
      scripture: 'A second skeleton.\nRigid. Relentless. Unflinching.\n\nBuilt for nights that never end\nand mornings you must earn.',
      tags: ['Heavy Canvas', 'Metal Hardware', 'Relaxed']
    }
  ];

  // ── DOM ──
  const slots = document.querySelectorAll('.product-slot');
  const detailsTitle = document.getElementById('details-title');
  const detailsScripture = document.querySelector('.details-scripture');
  const detailsMeta = document.querySelector('.details-meta');
  const ctaButton = document.getElementById('add-to-cart');
  const header = document.getElementById('site-header');
  const heroVideo = document.getElementById('hero-video');
  const heroFallback = document.getElementById('hero-fallback');

  let activeIndex = 1;
  let autoSwapInterval = null;

  // ── Video fallback ──
  if (heroVideo) {
    heroVideo.addEventListener('error', function () {
      heroVideo.style.display = 'none';
      if (heroFallback) heroFallback.style.display = 'block';
    });
    heroVideo.addEventListener('loadeddata', function () {
      if (heroFallback) heroFallback.style.display = 'none';
    });
  }

  // ── Update details panel ──
  function updateDetails(index) {
    var p = products[index];
    if (!p) return;
    if (detailsTitle) detailsTitle.textContent = p.name;
    if (detailsScripture) detailsScripture.innerHTML = p.scripture.replace(/\n/g, '<br>');
    if (detailsMeta) {
      detailsMeta.innerHTML = p.tags.map(function (t) {
        return '<span class="meta-tag">' + t + '</span>';
      }).join('');
    }
    if (ctaButton) {
      var txt = ctaButton.querySelector('.cta-text');
      if (txt) txt.textContent = 'Acquire \u2014 ' + p.price;
    }
  }

  // ── V-Shape instant swap ──
  function swapToFront(targetIndex) {
    if (targetIndex === activeIndex) return;

    // Determine who goes where
    var others = [0, 1, 2].filter(function (i) { return i !== targetIndex; });

    slots.forEach(function (slot) {
      var idx = parseInt(slot.dataset.index, 10);

      // Strip all position classes instantly
      slot.classList.remove('active', 'pos-left', 'pos-right',
        'slot-left', 'slot-center', 'slot-right');

      if (idx === targetIndex) {
        slot.classList.add('active');
      } else if (idx === others[0]) {
        slot.classList.add('pos-left');
      } else {
        slot.classList.add('pos-right');
      }
    });

    activeIndex = targetIndex;
    updateDetails(targetIndex);
  }

  // ── Desktop hover ──
  slots.forEach(function (slot) {
    slot.addEventListener('mouseenter', function () {
      if (window.innerWidth >= 768) {
        swapToFront(parseInt(this.dataset.index, 10));
      }
    });
    slot.addEventListener('click', function () {
      swapToFront(parseInt(this.dataset.index, 10));
    });
  });

  // ── Mobile auto-swap ──
  function startAutoSwap() {
    stopAutoSwap();
    autoSwapInterval = setInterval(function () {
      swapToFront((activeIndex + 1) % 3);
    }, 3000);
  }

  function stopAutoSwap() {
    if (autoSwapInterval) {
      clearInterval(autoSwapInterval);
      autoSwapInterval = null;
    }
  }

  function checkResponsive() {
    if (window.innerWidth < 768) {
      startAutoSwap();
    } else {
      stopAutoSwap();
    }
  }

  window.addEventListener('resize', checkResponsive);
  checkResponsive();
  updateDetails(activeIndex);

  // ── Scroll header ──
  window.addEventListener('scroll', function () {
    if (!header) return;
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // ── Intersection fade-in ──
  var fadeTargets = document.querySelectorAll(
    '#product-details, .pillar, .details-media, .details-text'
  );

  if ('IntersectionObserver' in window) {
    var style = document.createElement('style');
    style.textContent =
      '.fade-in{opacity:0;transform:translateY(24px);transition:opacity 500ms ease,transform 500ms ease}' +
      '.fade-in.visible{opacity:1;transform:translateY(0)}';
    document.head.appendChild(style);

    fadeTargets.forEach(function (el) { el.classList.add('fade-in'); });

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeTargets.forEach(function (el) { obs.observe(el); });
  }

  // ── CTA feedback ──
  if (ctaButton) {
    ctaButton.addEventListener('click', function () {
      var txt = this.querySelector('.cta-text');
      var saved = txt.textContent;
      txt.textContent = 'CLAIMED';
      this.style.pointerEvents = 'none';
      var btn = this;
      setTimeout(function () {
        txt.textContent = saved;
        btn.style.pointerEvents = '';
      }, 1400);
    });
  }

})();
