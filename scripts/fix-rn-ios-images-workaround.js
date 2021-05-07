console.log('[-] Fixing iOS RN Images workaround...');
const fs = require('fs');

const MAIN_FILE_PATH = __dirname + '/../node_modules/react-native/Libraries/Image/RCTUIImageViewAnimated.m';

fs.readFile(MAIN_FILE_PATH, 'utf8', function(err, data) {
    const formatted = data.replace(
        /layer.contents[ ]*=[ ]*\(__bridge id\)_currentFrame.CGImage;/g,
        'layer.contents = (__bridge id)_currentFrame.CGImage;}else{[super displayLayer:layer];'
    );

    fs.writeFile(MAIN_FILE_PATH, formatted, 'utf8', function(err) {
        if (err) return console.log(err);
        else console.log('[+] Fixed iOS RN Images workaround...');
    });
});
