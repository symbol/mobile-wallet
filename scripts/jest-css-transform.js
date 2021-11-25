const stylus = require('stylus');
const css2rn = require('css-to-react-native-transform').default;

function process(src, filename) {
    try {
        const css = stylus(src)
            .set('filename', filename)
            .render();
        const cssObject = css2rn(css, { parseMediaQueries: true });
        return `module.exports = ${JSON.stringify(cssObject)}`;
    } catch (err) {
        console.log('Error transforming styl: ', err);
        return 'module.exports = {}';
    }
}

module.exports = {
    process,
};
