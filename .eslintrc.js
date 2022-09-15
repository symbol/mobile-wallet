module.exports = {
    extends: ['plugin:react/recommended', 'plugin:prettier/recommended'],
    plugins: ['react'],
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        jest: true,
        es6: true,
        browser: true,
        node: true,
    },
    rules: {
        'sort-imports': [
            'error',
            {
                ignoreDeclarationSort: true,
            },
        ],
        'no-unused-vars': 'error',
        'react/prop-types': 'off',
    },
};
