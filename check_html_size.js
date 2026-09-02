const fs = require('fs');
const html = fs.readFileSync('temp_html_sync.txt', 'utf8');
console.log('HTML size:', html.length);
console.log('Script tags:', html.split('<script').length - 1);
const inlineScripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/g) || [];
console.log('Total inline script size:', inlineScripts.reduce((a, b) => a + b.length, 0));

const nextDataMatch = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
if (nextDataMatch) {
  console.log('__NEXT_DATA__ size:', nextDataMatch[0].length);
} else {
  // App router doesn't use __NEXT_DATA__, it uses self.__next_f
  const nextFMatch = html.match(/self\.__next_f\.push/g) || [];
  console.log('self.__next_f elements:', nextFMatch.length);
}
