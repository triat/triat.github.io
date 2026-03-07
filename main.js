(function () {
  'use strict';

  var currentLang = 'fr';

  // Allowed HTML tags for safe innerHTML replacement (only used where needed)
  var SAFE_TAGS = ['BR', 'SPAN', 'STRONG', 'EM'];

  function sanitizeHTML(str) {
    var template = document.createElement('template');
    template.innerHTML = str;
    var fragment = template.content;
    var walker = document.createTreeWalker(fragment, NodeFilter.SHOW_ELEMENT);
    var nodesToRemove = [];
    while (walker.nextNode()) {
      var node = walker.currentNode;
      if (SAFE_TAGS.indexOf(node.tagName) === -1) {
        nodesToRemove.push(node);
      }
      // Remove all attributes except class and data-* on allowed tags
      var attrs = Array.prototype.slice.call(node.attributes);
      for (var i = 0; i < attrs.length; i++) {
        var name = attrs[i].name;
        if (name !== 'class' && name.indexOf('data-') !== 0) {
          node.removeAttribute(name);
        }
      }
    }
    for (var j = 0; j < nodesToRemove.length; j++) {
      nodesToRemove[j].parentNode.removeChild(nodesToRemove[j]);
    }
    return fragment;
  }

  function needsHTML(str) {
    return /<[a-z][\s\S]*>/i.test(str);
  }

  function toggleLang() {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    document.documentElement.lang = currentLang;

    document.querySelectorAll('.lang-option').forEach(function (el) {
      el.classList.toggle('active', el.dataset.lang === currentLang);
    });

    document.querySelectorAll('[data-' + currentLang + ']').forEach(function (el) {
      var text = el.getAttribute('data-' + currentLang);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else if (needsHTML(text)) {
        // Clear existing content safely, then append sanitized fragment
        while (el.firstChild) {
          el.removeChild(el.firstChild);
        }
        el.appendChild(sanitizeHTML(text));
      } else {
        el.textContent = text;
      }
    });
  }

  // Contact obfuscation — assembled at runtime to defeat scrapers
  function initContact() {
    // Email
    var emailParts = ['tom', '@', 'riat', '.', 'dev'];
    var addr = emailParts.join('');
    var emailLink = document.getElementById('email-link');
    var emailDisplay = document.getElementById('email-display');
    if (emailLink) {
      emailLink.href = 'mailto:' + addr;
    }
    if (emailDisplay) {
      emailDisplay.textContent = addr;
    }

    // WhatsApp — number split to prevent scraping
    var waParts = ['+41', '79', '635', '74', '79'];
    var waLink = document.getElementById('wa-link');
    if (waLink) {
      waLink.href = 'https://wa.me/' + waParts.join('') + '?text=Salut%20Tom%20!';
    }
  }

  // Journey accordion — event delegation instead of inline onclick
  function initJourneyAccordion() {
    document.querySelectorAll('.j-header').forEach(function (header) {
      header.addEventListener('click', function () {
        var item = header.closest('.j-item');
        if (item) {
          item.classList.toggle('open');
        }
      });
    });
  }

  // Language toggle button
  function initLangToggle() {
    var btn = document.getElementById('lang-toggle-btn');
    if (btn) {
      btn.addEventListener('click', toggleLang);
    }
  }

  // Floating CTA — show after scrolling past hero
  function initFloatingCTA() {
    var floatingCta = document.querySelector('.floating-cta');
    var hero = document.querySelector('.hero');
    if (!floatingCta || !hero) return;

    function checkScroll() {
      if (window.scrollY > hero.offsetHeight * 0.6) {
        floatingCta.classList.add('visible');
      } else {
        floatingCta.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  // Init all
  document.querySelector('.lang-option[data-lang="fr"]').classList.add('active');
  initContact();
  initJourneyAccordion();
  initLangToggle();
  initFloatingCTA();
})();
