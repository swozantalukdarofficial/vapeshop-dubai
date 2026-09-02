const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = path.join(__dirname, '..', 'public', 'payments');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const files = {
  'visa.svg': 'https://raw.githubusercontent.com/aaronfay/pay-icons/master/svg/visa.svg',
  'mastercard.svg': 'https://raw.githubusercontent.com/aaronfay/pay-icons/master/svg/mastercard.svg',
  'apple-pay.svg': 'https://raw.githubusercontent.com/aaronfay/pay-icons/master/svg/apple_pay.svg',
  'google-pay.svg': 'https://raw.githubusercontent.com/aaronfay/pay-icons/master/svg/google_pay.svg',
  'cod.svg': 'https://raw.githubusercontent.com/aaronfay/pay-icons/master/svg/cash.svg',
  'uae-flag.svg': 'https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/ae.svg'
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  for (const [filename, url] of Object.entries(files)) {
    console.log(`Downloading ${filename}...`);
    try {
      await download(url, path.join(dir, filename));
      console.log(`Saved ${filename}`);
    } catch (err) {
      console.error(`Failed ${filename}`, err);
    }
  }
}

main();
