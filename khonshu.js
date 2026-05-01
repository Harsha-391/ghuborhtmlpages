/* ═══════════════════════════════════════════
   GHUBOR — TOMB OF KHONSHU — INTERACTIONS
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  var products = [
    {
      name: 'Wraith Hoodie',
      num: 'I',
      price: '\u20B93,499',
      scripture: 'The hood drawn low. Not hiding \u2014 hunting.\n280 GSM brushed fleece.\nDarkness worn willingly.\n\nBeneath the fabric, a prayer\nthat never needed words.',
      tags: ['280 GSM', 'Brushed Fleece', 'Oversized']
    },
    {
      name: 'Bone Tee',
      num: 'II',
      price: '\u20B92,999',
      scripture: 'Wearable scripture. For the silent war.\n280 GSM raw cotton.\nThe armor becomes skin.\n\nBetween struggle and faith\nthere is only the thread\nthat holds the wound shut.',
      tags: ['280 GSM', 'Raw Cotton', 'Oversized']
    },
    {
      name: 'Tomb Jacket',
      num: 'III',
      price: '\u20B95,999',
      scripture: 'A second skeleton.\nRigid. Relentless. Unflinching.\n\nBuilt for nights that never end\nand mornings you must earn.\nThe tomb opens. You walk out wearing it.',
      tags: ['Heavy Canvas', 'Metal Hardware', 'Relaxed']
    }
  ];

  // ── DOM ──
  var slots = document.querySelectorAll('.v-slot');
  var plaqueTitle = document.getElementById('plaque-title');
  var plaqueNum = document.getElementById('plaque-number');
  var plaqueScripture = document.getElementById('plaque-scripture');
  var plaqueTags = document.getElementById('plaque-tags');
  var glyphPrice = document.getElementById('glyph-price');
  var ctaBtn = document.getElementById('cta-acquire');
  var heroVideo = document.getElementById('hero-video');
  var heroFallback = document.getElementById('hero-fallback');
  var catExpand = document.getElementById('cat-expand');
  var catExpandText = document.getElementById('cat-expand-text');
  var catExpandClose = document.getElementById('cat-expand-close');

  var activeIndex = 1;
  var autoInterval = null;

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

  // ── Update plaque ──
  function updatePlaque(idx) {
    var p = products[idx];
    if (!p) return;
    if (plaqueTitle) plaqueTitle.textContent = p.name;
    if (plaqueNum) plaqueNum.textContent = p.num;
    if (plaqueScripture) plaqueScripture.innerHTML = p.scripture.replace(/\n/g, '<br>');
    if (plaqueTags) {
      plaqueTags.innerHTML = p.tags.map(function (t) {
        return '<span class="plaque-tag">' + t + '</span>';
      }).join('');
    }
    if (glyphPrice) glyphPrice.textContent = p.price;
  }

  // ── V-Shape sand drift swap ──
  function driftToFront(targetIdx) {
    if (targetIdx === activeIndex) return;

    var others = [0, 1, 2].filter(function (i) { return i !== targetIdx; });

    slots.forEach(function (slot) {
      var idx = parseInt(slot.dataset.index, 10);

      slot.classList.remove('active', 'pos-left', 'pos-right',
        'v-left', 'v-center', 'v-right');

      if (idx === targetIdx) {
        slot.classList.add('active');
      } else if (idx === others[0]) {
        slot.classList.add('pos-left');
      } else {
        slot.classList.add('pos-right');
      }
    });

    activeIndex = targetIdx;
    updatePlaque(targetIdx);
  }

  // ── Desktop hover ──
  slots.forEach(function (slot) {
    slot.addEventListener('mouseenter', function () {
      if (window.innerWidth >= 768) {
        driftToFront(parseInt(this.dataset.index, 10));
      }
    });
    slot.addEventListener('click', function () {
      driftToFront(parseInt(this.dataset.index, 10));
    });
  });

  // ── Mobile auto-swap (slow dissolve every 4s) ──
  function startAuto() {
    stopAuto();
    autoInterval = setInterval(function () {
      driftToFront((activeIndex + 1) % 3);
    }, 4000);
  }

  function stopAuto() {
    if (autoInterval) { clearInterval(autoInterval); autoInterval = null; }
  }

  function checkMobile() {
    if (window.innerWidth < 768) { startAuto(); } else { stopAuto(); }
  }

  window.addEventListener('resize', checkMobile);
  checkMobile();
  updatePlaque(activeIndex);

  // ── Catalogue image click → expand ──
  var catItems = document.querySelectorAll('.cat-img-wrap');
  catItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.stopPropagation();
      var desc = this.getAttribute('data-desc');
      if (desc && catExpand && catExpandText) {
        catExpandText.textContent = desc;
        catExpand.classList.add('open');
      }
    });
  });

  if (catExpandClose) {
    catExpandClose.addEventListener('click', function () {
      catExpand.classList.remove('open');
    });
  }

  // Close expand on outside click
  document.addEventListener('click', function () {
    if (catExpand) catExpand.classList.remove('open');
  });

  // ── CTA feedback ──
  if (ctaBtn) {
    ctaBtn.addEventListener('click', function () {
      var icon = this.querySelector('.glyph-icon');
      var saved = icon.textContent;
      icon.textContent = '✓';
      this.style.pointerEvents = 'none';
      var btn = this;
      setTimeout(function () {
        icon.textContent = saved;
        btn.style.pointerEvents = '';
      }, 1600);
    });
  }

  // ── Intersection fade-in ──
  var fadeEls = document.querySelectorAll(
    '#product-details, .pillar, .plaque-media, .plaque-body'
  );

  if ('IntersectionObserver' in window) {
    var style = document.createElement('style');
    style.textContent =
      '.khon-fade{opacity:0;transform:translateY(28px);transition:opacity 0.7s ease,transform 0.7s ease}' +
      '.khon-fade.vis{opacity:1;transform:translateY(0)}';
    document.head.appendChild(style);

    fadeEls.forEach(function (el) { el.classList.add('khon-fade'); });

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('vis');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(function (el) { obs.observe(el); });
  }

})();
