const fetch = require('node-fetch');
fetch('https://vapshopdubai.shipon.tech/?cachebuster=14')
  .then(r => r.text())
  .then(html => {
    const headEnd = html.indexOf('</head>');
    const head = html.substring(0, headEnd);
    const stylesheets = head.match(/<link[^>]+rel=\"stylesheet\"[^>]*>/g) || [];
    console.log(stylesheets.join('\n'));
    console.log('Total inline styles:', head.match(/<style[^>]*>/g)?.length);
  });
