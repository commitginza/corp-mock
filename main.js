(() => {
  const targets = document.querySelectorAll('[data-animate]');

  // IntersectionObserver に未対応なら即座に表示
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('active'));
    return;
  }

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // 1回で観測終了
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => io.observe(el));
})();
