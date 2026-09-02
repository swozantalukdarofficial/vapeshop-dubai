const fs = require('fs');
const html = fs.readFileSync('temp_html_sync.txt', 'utf8');
const start = html.indexOf('data-section-id="index-hero"');
if (start > -1) {
  fs.writeFileSync('hero_full.txt', html.substring(start, start + 4000));
}
