/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const { getDefaultConfig } = require('metro-config');

const extraNodeModules = {
    crypto: require.resolve('react-native-crypto'),
    randombytes: require.resolve('react-native-randombytes'),
    fs: require.resolve('react-native-level-fs'),
    http: require.resolve('@tradle/react-native-http'),
    https: require.resolve('https-browserify'),
    process: require.resolve('process/browser.js'),
    stream: require.resolve('stream-browserify'),
    tls: require.resolve('tls-browserify'),
    net: require.resolve('react-native-tcp'),
    util: require.resolve('util'),
    punycode: require.resolve('punycode/'),
    url: require.resolve('react-native-url'),
    querystring: require.resolve('querystring-es3'),
    zlib: require.resolve('browserify-zlib'),
    path: require.resolve('path-browserify'),
    console: require.resolve('console-browserify'),
    constants: require.resolve('constants-browserify'),
    dns: require.resolve('dns.js'),
    domain: require.resolve('domain-browser'),
    os: require.resolve('react-native-os'),
    dgram: require.resolve('react-native-udp'),
    timers: require.resolve('timers-browserify'),
    tty: require.resolve('tty-browserify'),
    vm: require.resolve('vm-browserify'),
};

module.exports = (async () => {
    const {
        resolver: { sourceExts },
    } = await getDefaultConfig();
    return {
        transformer: {
            babelTransformerPath: require.resolve('react-native-stylus-transformer'),
        },
        resolver: {
            extraNodeModules: extraNodeModules,
            sourceExts: [...sourceExts, 'styl'],
        },
    };
})();
