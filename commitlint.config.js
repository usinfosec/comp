export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [0, 'always', Infinity], // Disable body line length rule
    'header-max-length': [0, 'always', Infinity],    // Disable header line length rule
  },
}; 