module.exports = {
    extends: [
        'eslint:recommended', 
        'plugin:prettier/recommended'
    ],
    plugins: ['react'],
    parser: 'babel-eslint',
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
                ignoreDeclarationSort: true 
            }
        ],
        'no-unused-vars': [
            'warn',
            {
                varsIgnorePattern: 'React',
            },
        ],
        'no-useless-escape': 'warn',
        'no-empty': 'off',
    },
};
