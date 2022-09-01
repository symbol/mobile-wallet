/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const { getDefaultConfig } = require('metro-config');

const extraNodeModules = {
    randombytes: require.resolve('react-native-randombytes'),
    process: require.resolve('process/browser.js'),
    tls: require.resolve('tls-browserify'),
    util: require.resolve('util'),
    punycode: require.resolve('punycode/'),
    url: require.resolve('react-native-url'),
    zlib: require.resolve('browserify-zlib'),
    console: require.resolve('console-browserify'),
    constants: require.resolve('constants-browserify'),
    crypto: require.resolve('react-native-crypto'),
    dns: require.resolve('dns.js'),
    net: require.resolve('react-native-tcp'),
    domain: require.resolve('domain-browser'),
    http: require.resolve('@tradle/react-native-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('react-native-os'),
    path: require.resolve('path-browserify'),
    querystring: require.resolve('querystring-es3'),
    fs: require.resolve('react-native-level-fs'),
    dgram: require.resolve('react-native-udp'),
    stream: require.resolve('stream-browserify'),
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
