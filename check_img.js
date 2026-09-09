const fetch = require('node-fetch');
fetch('https://vapshopdubai.shipon.tech/?cachebuster=12')
  .then(r => r.text())
  .then(html => {
    const match = html.match(/<img[^>]+alt=\"MYLE[^>]+>/g);
    if (match) console.log(match.join('\n'));
    else console.log('no match');
  });
