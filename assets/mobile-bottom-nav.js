(function () {
  if (document.querySelector('.mbottom-nav')) {
    return;
  }

  function syncActiveState(nav) {
    var items = Array.from(nav.querySelectorAll('[data-mobile-bottom-item]'));
    var currentHash = (window.location.hash || '').toLowerCase();
    var currentPath = (window.location.pathname || '/').toLowerCase();
    var isBonusPage = currentPath.endsWith('/bonusy.html') || currentPath.endsWith('/bonusy');
    var targetHash = currentHash === '#top-casina' ? '#top-casina' : (currentHash === '#casina' ? '#casina' : '#home');

    items.forEach(function (item) {
      item.classList.remove('active');
    });

    var targetItem = items.find(function (item) {
      var href = (item.getAttribute('href') || '').toLowerCase();

      if (isBonusPage) {
        return href.endsWith('/bonusy.html');
      }

      return href === targetHash;
    });

    if (targetItem) {
      targetItem.classList.add('active');
    }
  }

  var nav = document.createElement('nav');
  nav.className = 'mbottom-nav lg:hidden';
  nav.setAttribute('aria-label', 'Spodní mobilní navigace');

  nav.innerHTML = [
    '<div class="mbottom-nav__inner">',
    '  <a href="/index.html#home" class="mbottom-nav__item active" data-mobile-bottom-item>',
    '    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"></path><path d="M6.5 10.8V20h11V10.8"></path></svg>',
    '    <span class="mbottom-nav__label">Domů</span>',
    '  </a>',
    '  <a href="/index.html#casina" class="mbottom-nav__item" data-mobile-bottom-item>',
    '    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2"></rect><path d="M7.2 14.2V9.8M10 14.2V9.8M13.2 14.2V9.8M16.4 14.2V9.8"></path><path d="M7.2 17h9.4"></path></svg>',
    '    <span class="mbottom-nav__label">Casina</span>',
    '  </a>',
    '  <a href="/bonusy.html" class="mbottom-nav__item" data-mobile-bottom-item>',
    '    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.8 19.3 12 12 20.2 4.7 12 12 3.8z"></path><path d="M12 3.8v16.4M4.7 12h14.6"></path></svg>',
    '    <span class="mbottom-nav__label">Bonusy</span>',
    '  </a>',
    '  <a href="/index.html#top-casina" class="mbottom-nav__item" data-mobile-bottom-item>',
    '    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.2 14.2 8.8l5.1.7-3.7 3.5.9 5.1-4.5-2.4-4.5 2.4.9-5.1-3.7-3.5 5.1-.7z"></path></svg>',
    '    <span class="mbottom-nav__label">TOP Casina</span>',
    '  </a>',
    '  <a href="/index.html" class="mbottom-nav__item" data-mobile-bottom-item data-mobile-bottom-menu>',
    '    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>',
    '    <span class="mbottom-nav__label">Menu</span>',
    '  </a>',
    '</div>'
  ].join('');

  document.body.appendChild(nav);

  syncActiveState(nav);
  window.addEventListener('hashchange', function () {
    syncActiveState(nav);
  });

  nav.querySelectorAll('[data-mobile-bottom-item]').forEach(function (item) {
    item.addEventListener('click', function () {
      if (item.hasAttribute('data-mobile-bottom-menu')) {
        return;
      }

      nav.querySelectorAll('[data-mobile-bottom-item]').forEach(function (navItem) {
        navItem.classList.remove('active');
      });

      item.classList.add('active');
    });
  });
})();
