(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealTargets = document.querySelectorAll('.index-card, .post-content > p, .post-content figure, .post-content pre, .post-content blockquote');

  if (!revealTargets.length) return;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  revealTargets.forEach(function (el, index) {
    el.classList.add('reveal-on-scroll');
    el.style.setProperty('--reveal-delay', Math.min(index * 60, 360) + 'ms');
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealTargets.forEach(function (el) {
    observer.observe(el);
  });
})();

(function () {
  var article = document.querySelector('.post-content, .markdown-body');
  if (!article) return;

  var bar = document.createElement('div');
  bar.className = 'reading-progress';
  document.body.appendChild(bar);

  var ticking = false;

  function updateProgress() {
    var rect = article.getBoundingClientRect();
    var articleTop = window.scrollY + rect.top;
    var articleHeight = article.offsetHeight;
    var scrollStart = articleTop - 80;
    var scrollEnd = articleTop + articleHeight - window.innerHeight;
    var total = Math.max(scrollEnd - scrollStart, 1);
    var current = window.scrollY - scrollStart;
    var progress = Math.min(100, Math.max(0, current / total * 100));

    bar.style.width = progress + '%';
    ticking = false;
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateProgress);
  }

  updateProgress();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
})();
