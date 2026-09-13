document.getElementById('year').textContent = new Date().getFullYear();

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
