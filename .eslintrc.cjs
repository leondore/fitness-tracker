module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:prettier/recommended',
    'plugin:vuejs-accessibility/recommended',
  ],
  plugins: ['vuejs-accessibility'],
  rules: {},
};
