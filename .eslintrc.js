module.exports = {
    "extends": "airbnb",
  rules: {
        'react/react-in-jsx-scope': 'off', // next.js handles this
        'react/jsx-filename-extension': 'off', // next.js wants .js
        'react/prop-types': 'off', // meh
  }
};