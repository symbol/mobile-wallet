console.log('[-] Fixing QR Code workaround...');
const fs = require('fs');

const FILE_PATH = __dirname + '/../node_modules/symbol-qr-library/dist/src/QRCode.js';
console.log(FILE_PATH);
fs.readFile(FILE_PATH, 'utf8', function(err, data) {
    const formatted = data.replace(/require\("qrcode"\)/g, 'require("qrcode/lib")');

    fs.writeFile(FILE_PATH, formatted, 'utf8', function(err) {
        if (err) return console.log(err);
        else console.log('[+] Fixed QR Code...');
    });
});
