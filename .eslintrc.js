module.exports = {
  "extends": [
    "prettier",
    "plugin:prettier/recommended"
  ],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "env": {
    "jest": true
  },
  "rules": {
    "global-require": "off",
    "import/no-unresolved": "off",
    "react/state-in-constructor": "off",
    "react/prefer-stateless-function": "off",
    "react/jsx-curly-newline": "off",
    "react/jsx-indent": "off",
    "react/jsx-no-undef": "warn",
    "react/jsx-indent-props": ["error", 4],
    "react/jsx-closing-bracket-location": "off",
    "react/no-did-mount-set-state": "off",
    "react/require-default-props": "off",
    "react/static-property-placement": "off",
    "react/jsx-props-no-spreading": "off",
    "react/jsx-filename-extension": [
      "error",
      {
        "extensions": [".js", ".jsx"]
      }
    ],
    "indent": ["error", 4, { "SwitchCase": 1 }],
    "react-native/no-unused-styles": 2,
    "react-native/no-inline-styles": 2,
    "object-shorthand": ["error", "consistent"],
    "no-use-before-define": [
      "error",
      {
        "functions": true,
        "classes": true,
        "variables": false
      }
    ]
  }
}
