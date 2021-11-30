module.exports = {
    presets: ['module:metro-react-native-babel-preset', 'module:react-native-env-json'],
    plugins: [
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-export-namespace-from',
        [
            require.resolve('babel-plugin-module-resolver'),
            {
                alias: {
                    '@src': './src',
                },
            },
        ],
    ],
};
