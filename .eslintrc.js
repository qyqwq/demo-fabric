// https://eslint.vuejs.org/user-guide/#faq 常见问题
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    // 'plugin:vue/base',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    '@vue/standard'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // 'vue/script-setup-uses-vars': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/max-attributes-per-line': [2, {
      singleline: 10,
      multiline: 1
    }]

  }
}
