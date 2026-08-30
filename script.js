// Quote rotation
const quotes = [
  { text: "“SIMPLICITY IS A PREREQUISITE FOR RELIABILITY.”", cite: "— EDSGER W. DIJKSTRA" },
  { text: "“THE BEST CODE IS NO CODE AT ALL.”", cite: "— JEFF ATWOOD" },
  { text: "“MAKE IT WORK, MAKE IT RIGHT, MAKE IT FAST.”", cite: "— KENT BECK" },
  { text: "“SECURITY IS NOT A PRODUCT, BUT A PROCESS.”", cite: "— BRUCE SCHNEIER" },
  { text: "“PERFECTION IS ACHIEVED NOT WHEN THERE IS NOTHING MORE TO ADD, BUT NOTHING LEFT TO TAKE AWAY.”", cite: "— ANTOINE DE SAINT-EXUPÉRY" },
];

const qText = document.getElementById('quoteText');
const qCite = document.getElementById('quoteCite');
if (qText && qCite) {
  const pick = quotes[Math.floor(Math.random() * quotes.length)];
  qText.textContent = pick.text;
  qCite.textContent = pick.cite;
}

// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// Blog data — add/edit posts here
const posts = [
  {
    id: 'failure-first',
    date: '2026-08-10',
    read: '4 MIN',
    title: 'DESIGNING FOR FAILURE FIRST',
    excerpt: 'Why the best systems are boring, predictable, and easy to reason about when everything goes wrong.',
    content: `
      <p>Most systems don't fail because they're too simple. They fail because no one asked what happens when they break.</p>
      <p>Designing for failure first means you start with the bad day: the disk is full, the network is gone, the credential expired at 2am. If your architecture is still legible in that state, you've built something reliable.</p>
      <h2>BORING IS A FEATURE</h2>
      <p>Boring choices — flat files, idempotent handlers, explicit retries — are easier to debug at 3am than clever abstractions. Choose boring until boring stops working.</p>
      <pre><code>// idempotent handler pattern
function handle(event) {
  if (alreadyProcessed(event.id)) return ok();
  return process(event);
}</code></pre>
      <p>Ship the boring version. Then measure. Then optimize only what hurts.</p>
    `
  },
  {
    id: 'minimal-tools',
    date: '2026-07-22',
    read: '3 MIN',
    title: 'MINIMAL TOOLS, MAXIMUM LEVERAGE',
    excerpt: 'A short stack that earns its keep — HTML, CSS, JS and a purple background can go a long way.',
    content: `
      <p>This site is three files. No build step, no framework. The constraint is the point.</p>
      <p>Constraints force clarity. Two colors (<code>#6b4a9e</code> and <code>#DFD9E2</code>), one serif for headlines, one mono for UI, and line-art for texture. Everything else is composition.</p>
      <h2>WHEN TO ADD A TOOL</h2>
      <p>Add a tool only when it removes an entire class of problems. Otherwise it's just weight you carry.</p>
      <p>Start with the platform. Push it further than you think it goes.</p>
    `
  },
  {
    id: 'security-by-default',
    date: '2026-06-14',
    read: '5 MIN',
    title: 'SECURITY BY DEFAULT, NOT BY MEMO',
    excerpt: 'If secure is harder than insecure, humans will route around it every time. Make the safe path the easy path.',
    content: `
      <p>Security memos don't fix systems. Defaults do.</p>
      <p>If the secure way requires extra steps, people will skip it under pressure. The only way to make security stick is to make it the path of least resistance.</p>
      <h2>EXAMPLES THAT WORK</h2>
      <p>Signed builds by default. Encrypted storage by default. Least privilege by default. The insecure option should be the one that requires a flag.</p>
      <pre><code># insecure requires --force
deploy --force --insecure</code></pre>
      <p>Build the pit of success. Then people fall into it naturally.</p>
    `
  }
];

// Render blog list
const blogList = document.getElementById('blogList');
const postView = document.getElementById('postView');
const postMeta = document.getElementById('postMeta');
const postTitle = document.getElementById('postTitle');
const postContent = document.getElementById('postContent');

function renderList() {
  if (!blogList) return;
  blogList.innerHTML = posts.map(p => `
    <article class="blog-item" data-id="${p.id}" tabindex="0" role="link" aria-label="Open post ${p.title}">
      <div class="blog-meta mono">${p.date} • ${p.read}</div>
      <div>
        <h3>${p.title}</h3>
        <p>${p.excerpt}</p>
        <div class="mono read">READ POST ↗</div>
      </div>
    </article>
  `).join('');
  blogList.querySelectorAll('.blog-item').forEach(el => {
    const open = () => openPost(el.dataset.id);
    el.addEventListener('click', open);
    el.addEventListener('keydown', e => { if (e.key === 'Enter') open(); });
  });
}

function openPost(id) {
  const post = posts.find(p => p.id === id);
  if (!post || !postMeta || !postTitle || !postContent || !postView) return;
  // hide main sections for "page" feel but keep nav/footer
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
  document.querySelector('.hero').style.display = 'none';
  postMeta.textContent = `${post.date} • ${post.read}`;
  postTitle.textContent = post.title;
  postContent.innerHTML = post.content;
  postView.classList.remove('hidden');
  history.pushState(null, '', `#post-${id}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closePost() {
  if (!postView) return;
  postView.classList.add('hidden');
  document.querySelectorAll('.section').forEach(s => s.style.display = '');
  document.querySelector('.hero').style.display = '';
  if (location.hash.startsWith('#post-')) history.pushState(null, '', '#blog');
  document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('backToBlog')?.addEventListener('click', e => {
  e.preventDefault();
  closePost();
});

// Handle deep link
function handleHash() {
  const h = location.hash;
  if (h.startsWith('#post-')) {
    const id = h.replace('#post-', '');
    // ensure list rendered
    if (posts.some(p => p.id === id)) openPost(id);
  } else if (postView && !postView.classList.contains('hidden')) {
    // if navigated away from post
    if (!h.startsWith('#post-')) closePost();
  }
}

renderList();
handleHash();
window.addEventListener('hashchange', handleHash);
window.addEventListener('popstate', () => {
  if (!location.hash.startsWith('#post-') && postView && !postView.classList.contains('hidden')) {
    closePost();
  }
});
