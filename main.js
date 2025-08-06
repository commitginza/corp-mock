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

/* ==============================================
   KPI カウントアップ改良版
   ============================================== */
document.addEventListener('DOMContentLoaded', () => {
  const nums = document.querySelectorAll('.stat-number');
  if (!nums.length) return;

  nums.forEach(el => {
    const raw = parseFloat(el.textContent.replace(/[^0-9.]/g, ''));
    el.dataset.target = raw;      // 目標値保存
    el.textContent = '0';         // 初期化
  });

  const easeOut = t => 1 - Math.pow(1 - t, 3);   // cubic

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;

      const num   = e.target;
      const unit  = num.nextElementSibling?.classList.contains('unit') ? num.nextElementSibling : null;
      const total = parseFloat(num.dataset.target);
      let start   = null;

      const tick = ts => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1000, 1);   // 1秒
        const val = easeOut(p) * total;
        num.textContent = Number.isInteger(total)
          ? Math.floor(val).toLocaleString()
          : (val).toFixed(1);
        if (p < 1) requestAnimationFrame(tick);
        else if (unit) unit.style.opacity = 1;
      };
      requestAnimationFrame(tick);
      io.unobserve(num);
    });
  }, {threshold: 0.45});

  nums.forEach(el => io.observe(el));
});
