module.exports = {
  extends: 'airbnb',
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'max-len': 'off',
    'react/react-in-jsx-scope': 'off', // next.js handles this
    'react/jsx-filename-extension': 'off', // next.js wants .js
    'react/prop-types': 'off', // meh
    'jsx-a11y/label-has-for': [2, { // default config is broken (?)
      required: {
        some: ['nesting', 'id'],
      },
    }],
    'jsx-a11y/label-has-associated-control': [2, { // ditto
      labelComponents: ['label'],
      labelAttributes: ['htmlfor', 'id'],
      controlComponents: ['input'],
      depth: 3,
    }],
    'jsx-a11y/accessible-emoji': 'off', // I only use emojis in addition to text, so this is unnecessary
  },
};
