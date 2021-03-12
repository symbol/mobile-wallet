console.log('[-] Fixing QR Code workaround...');
const fs = require('fs');

const MAIN_FILE_PATH = __dirname + '/../node_modules/symbol-qr-library/dist/src/QRCode.js';

fs.readFile(MAIN_FILE_PATH, 'utf8', function(err, data) {
    const formatted = data.replace(/require\("qrcode"\)/g, 'require("qrcode/lib")');

    fs.writeFile(MAIN_FILE_PATH, formatted, 'utf8', function(err) {
        if (err) return console.log(err);
        else console.log('[+] Fixed QR Code...');
    });
});

const MODULE_FILE_PATH = __dirname + '/../node_modules/symbol-paper-wallets/node_modules/symbol-qr-library/dist/src/QRCode.js';

if (fs.existsSync(MODULE_FILE_PATH)) {
    fs.readFile(MODULE_FILE_PATH, 'utf8', function(err, data) {
        const formatted = data.replace(/require\("qrcode"\)/g, 'require("qrcode/lib")');

        fs.writeFile(MODULE_FILE_PATH, formatted, 'utf8', function(err) {
            if (err) return console.log(err);
            else console.log('[+] Fixed QR Code under paper-wallets module...');
        });
    });
}
