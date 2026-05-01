/* ═══════════════════════════════════════════
   GHUBOR — FRACTURED REFLECTION — INTERACTIONS
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  var products = [
    {
      name: 'Wraith Hoodie',
      price: '\u20B93,499',
      scripture: 'The hood drawn low. Not hiding \u2014 hunting.\n280 GSM brushed fleece.\nDarkness worn willingly.\n\nThe mirror sees the face you bury.\nThis hoodie wears it for you.',
      tags: ['280 GSM', 'Brushed Fleece', 'Oversized']
    },
    {
      name: 'Bone Tee',
      price: '\u20B92,999',
      scripture: 'Wearable scripture. For the silent war.\n280 GSM raw cotton.\nThe armor becomes skin.\n\nOne face for the world.\nAnother for the mirror.\nThis cloth knows both.',
      tags: ['280 GSM', 'Raw Cotton', 'Oversized']
    },
    {
      name: 'Tomb Jacket',
      price: '\u20B95,999',
      scripture: 'A second skeleton.\nRigid. Relentless. Unflinching.\n\nThe reflection fractures.\nThe jacket holds.\nEvery identity needs a shell.',
      tags: ['Heavy Canvas', 'Metal Hardware', 'Relaxed']
    }
  ];

  // ── DOM ──
  var slots = document.querySelectorAll('.mirror-slot');
  var detailsTitle = document.getElementById('details-title');
  var detailsScripture = document.getElementById('details-scripture');
  var detailsTags = document.getElementById('details-tags');
  var ctaLabel = document.getElementById('cta-label');
  var ctaBtn = document.getElementById('cta-btn');

  var activeIndex = 1;
  var autoInterval = null;

  // ── Update details ──
  function updateDetails(idx) {
    var p = products[idx];
    if (!p) return;
    if (detailsTitle) detailsTitle.textContent = p.name;
    if (detailsScripture) detailsScripture.innerHTML = p.scripture.replace(/\n/g, '<br>');
    if (detailsTags) {
      detailsTags.innerHTML = p.tags.map(function (t) {
        return '<span class="detail-tag">' + t + '</span>';
      }).join('');
    }
    if (ctaLabel) ctaLabel.textContent = 'Acquire \u2014 ' + p.price;
  }

  // ── 3D mirror swing swap ──
  function swingToFront(targetIdx) {
    if (targetIdx === activeIndex) return;

    var others = [0, 1, 2].filter(function (i) { return i !== targetIdx; });

    slots.forEach(function (slot) {
      var idx = parseInt(slot.dataset.index, 10);

      slot.classList.remove('active', 'pos-left', 'pos-right',
        'mirror-left', 'mirror-center', 'mirror-right');

      if (idx === targetIdx) {
        slot.classList.add('active');
      } else if (idx === others[0]) {
        slot.classList.add('pos-left');
      } else {
        slot.classList.add('pos-right');
      }
    });

    activeIndex = targetIdx;
    updateDetails(targetIdx);
  }

  // ── Desktop hover ──
  slots.forEach(function (slot) {
    slot.addEventListener('mouseenter', function () {
      if (window.innerWidth >= 768) {
        swingToFront(parseInt(this.dataset.index, 10));
      }
    });
    slot.addEventListener('click', function () {
      swingToFront(parseInt(this.dataset.index, 10));
    });
  });

  // ── Mobile auto-swap ──
  function startAuto() {
    stopAuto();
    autoInterval = setInterval(function () {
      swingToFront((activeIndex + 1) % 3);
    }, 3500);
  }

  function stopAuto() {
    if (autoInterval) { clearInterval(autoInterval); autoInterval = null; }
  }

  function checkMobile() {
    if (window.innerWidth < 768) { startAuto(); } else { stopAuto(); }
  }

  window.addEventListener('resize', checkMobile);
  checkMobile();
  updateDetails(activeIndex);

  // ── CTA feedback ──
  if (ctaBtn) {
    ctaBtn.addEventListener('click', function () {
      var saved = ctaLabel.textContent;
      ctaLabel.textContent = 'CLAIMED';
      this.style.pointerEvents = 'none';
      var btn = this;
      setTimeout(function () {
        ctaLabel.textContent = saved;
        btn.style.pointerEvents = '';
      }, 1500);
    });
  }

  // ── Intersection fade-in ──
  var fadeEls = document.querySelectorAll(
    '#product-details, .pillar, .details-media, .details-body'
  );

  if ('IntersectionObserver' in window) {
    var style = document.createElement('style');
    style.textContent =
      '.ref-fade{opacity:0;transform:translateY(24px);transition:opacity 0.6s ease,transform 0.6s ease}' +
      '.ref-fade.vis{opacity:1;transform:translateY(0)}';
    document.head.appendChild(style);

    fadeEls.forEach(function (el) { el.classList.add('ref-fade'); });

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
