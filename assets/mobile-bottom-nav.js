(function () {
  if (document.querySelector('.mbottom-nav') || document.querySelector('.mbottom-shared-nav')) {
    return;
  }

  var nav = document.createElement('nav');
  nav.className = 'mbottom-shared-nav';
  nav.setAttribute('aria-label', 'Spodni mobilni navigace');

  nav.innerHTML = [
    '<div class="mbottom-shared-nav__inner">',
    '  <a href="/index.html" class="mbottom-shared-nav__item" data-mobile-shared-item="home">',
    '    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"></path><path d="M5.5 9.8V21h13V9.8"></path></svg>',
    '    <span>Domu</span>',
    '  </a>',
    '  <a href="/index.html#casina" class="mbottom-shared-nav__item" data-mobile-shared-item="casina">',
    '    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2"></rect><path d="M7.2 14.2V9.8M10 14.2V9.8M13.2 14.2V9.8M16.4 14.2V9.8"></path><path d="M7.2 17h9.4"></path></svg>',
    '    <span>Casina</span>',
    '  </a>',
    '  <a href="/bonusy.html" class="mbottom-shared-nav__item" data-mobile-shared-item="bonusy">',
    '    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.8 19.3 12 12 20.2 4.7 12 12 3.8z"></path><path d="M12 3.8v16.4M4.7 12h14.6"></path></svg>',
    '    <span>Bonusy</span>',
    '  </a>',
    '  <a href="/index.html#casina" class="mbottom-shared-nav__item" data-mobile-shared-item="top">',
    '    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.2 14.2 8.8l5.1.7-3.7 3.5.9 5.1-4.5-2.4-4.5 2.4.9-5.1-3.7-3.5 5.1-.7z"></path></svg>',
    '    <span>TOP</span>',
    '  </a>',
    '  <a href="/kontakt.html" class="mbottom-shared-nav__item" data-mobile-shared-item="menu">',
    '    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>',
    '    <span>Menu</span>',
    '  </a>',
    '</div>'
  ].join('');

  document.body.appendChild(nav);
  document.body.classList.add('mbottom-shared-enabled');

  var path = window.location.pathname.toLowerCase();
  var active = 'menu';

  if (path === '/' || path.endsWith('/index.html')) {
    active = 'home';
  } else if (path.endsWith('/bonusy.html')) {
    active = 'bonusy';
  } else if (path.indexOf('/recenze/') !== -1) {
    active = 'top';
  }

  var activeItem = nav.querySelector('[data-mobile-shared-item="' + active + '"]');
  if (activeItem) {
    activeItem.classList.add('is-active');
  }
})();
