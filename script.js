// Year (guarded — landing page has no #year)
var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

var quotes = [
  { text: '\u201CSIMPLICITY IS A PREREQUISITE FOR RELIABILITY.\u201D', cite: '\u2014 EDSGER W. DIJKSTRA' },
  { text: '\u201CTHE BEST CODE IS NO CODE AT ALL.\u201D', cite: '\u2014 JEFF ATWOOD' },
  { text: '\u201CMAKE IT WORK, MAKE IT RIGHT, MAKE IT FAST.\u201D', cite: '\u2014 KENT BECK' },
  { text: '\u201CSECURITY IS NOT A PRODUCT, BUT A PROCESS.\u201D', cite: '\u2014 BRUCE SCHNEIER' }
];
var q = quotes[Math.floor(Math.random() * quotes.length)];
var qt = document.getElementById('quoteText');
var qc = document.getElementById('quoteCite');
if (qt && qc) { qt.textContent = q.text; qc.textContent = q.cite; }

// Dark mode — toggle injected on every page, preference saved
(function () {
  var root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  var stored = null;
  try { stored = localStorage.getItem('grahana-theme'); } catch (e) {}
  var dark = stored === 'dark';

  var btn = document.createElement('button');
  btn.id = 'themeToggle';
  btn.className = 'theme-toggle';
  btn.type = 'button';

  function render() {
    if (dark) root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    btn.textContent = dark ? '○ light' : '● dark';
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    if (meta) meta.setAttribute('content', dark ? '#0e0e11' : '#ffffff');
  }
  btn.addEventListener('click', function () {
    dark = !dark;
    try { localStorage.setItem('grahana-theme', dark ? 'dark' : 'light'); } catch (e) {}
    render();
  });
  render();
  document.body.appendChild(btn);
})();

// Starry night — falling stars + occasional meteors, dark mode only
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var canvas = document.createElement('canvas');
  canvas.id = 'starfield';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(canvas, document.body.firstChild);
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var STAR = '220,215,235';
  var stars = [], meteors = [];
  var raf = null, last = 0, nextMeteor = 0, running = false;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    canvas.width = Math.floor(window.innerWidth * DPR);
    canvas.height = Math.floor(window.innerHeight * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    seed();
  }
  function seed() {
    var count = Math.max(60, Math.min(150, Math.floor(window.innerWidth * window.innerHeight / 10000)));
    stars = [];
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 0.4 + Math.random() * 1.1,
        a: 0.3 + Math.random() * 0.6,
        sp: 0.6 + Math.random() * 1.8,
        ph: Math.random() * Math.PI * 2,
        vy: 4 + Math.random() * 10,
        vx: (Math.random() - 0.5) * 3
      });
    }
  }
  function spawnMeteor(now) {
    meteors.push({
      x: window.innerWidth * 0.15 + Math.random() * window.innerWidth * 0.75,
      y: Math.random() * window.innerHeight * 0.35,
      vx: -(350 + Math.random() * 350),
      vy: 140 + Math.random() * 160,
      age: 0,
      life: 900 + Math.random() * 400,
      len: 110 + Math.random() * 70
    });
    nextMeteor = now + 2500 + Math.random() * 3500;
  }
  function frame(now) {
    if (!running) return;
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    var t = now / 1000;
    var W = window.innerWidth, H = window.innerHeight;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.y += s.vy * dt;
      s.x += s.vx * dt;
      if (s.y > H + 2) { s.y = -2; s.x = Math.random() * W; }
      if (s.x > W + 2) s.x = -2; else if (s.x < -2) s.x = W + 2;
      var alpha = s.a * (0.6 + 0.4 * Math.sin(t * s.sp + s.ph));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + STAR + ',' + alpha.toFixed(3) + ')';
      ctx.fill();
    }
    if (now >= nextMeteor) spawnMeteor(now);
    meteors = meteors.filter(function (m) { return m.age < m.life; });
    for (var j = 0; j < meteors.length; j++) {
      var m = meteors[j];
      m.age += dt * 1000;
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      var p = Math.min(m.age / m.life, 1);
      var fade = Math.sin(Math.PI * p);
      var mag = Math.sqrt(m.vx * m.vx + m.vy * m.vy);
      var tx = m.x - (m.vx / mag) * m.len;
      var ty = m.y - (m.vy / mag) * m.len;
      var grad = ctx.createLinearGradient(m.x, m.y, tx, ty);
      grad.addColorStop(0, 'rgba(255,255,255,' + (0.95 * fade).toFixed(3) + ')');
      grad.addColorStop(0.25, 'rgba(' + STAR + ',' + (0.7 * fade).toFixed(3) + ')');
      grad.addColorStop(1, 'rgba(' + STAR + ',0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tx, ty);
      ctx.stroke();
    }
    raf = requestAnimationFrame(frame);
  }
  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }
  function start() {
    if (running) return;
    running = true;
    resize();
    last = performance.now();
    nextMeteor = last + 1000;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
  new MutationObserver(function () { isDark() ? start() : stop(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  window.addEventListener('resize', function () { if (running) resize(); });
  if (isDark()) start();
})();
