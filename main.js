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

/* ============================================
   KPI カウントアップ（Intersection Observer）
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  const nums = document.querySelectorAll('.stat-number[data-count]');
  if (!nums.length) return;

  const ease = n => (--n)*n*n+1;          // cubic easeOut

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el     = entry.target;
      const target = parseFloat(el.dataset.count);
      const unit   = el.nextElementSibling?.classList.contains('unit') ? el.nextElementSibling : null;
      let   start  = null;

      const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / 1000, 1);   // 1s アニメ
        const value = Math.floor(ease(progress) * target);
        el.textContent = value.toLocaleString();
        if (unit && progress === 1) unit.style.opacity = 1;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      observer.unobserve(el);                // 一度だけ
    });
  }, {threshold: 0.4});

  nums.forEach(el => {
    const unit = el.nextElementSibling;
    if (unit) unit.style.opacity = 0;        // カウント完了後にフェードイン
    observer.observe(el);
  });
});
