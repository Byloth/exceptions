module.exports = {
  root: true,
  extends: ["@byloth/eslint-config-typescript"],
  overrides: [{
    files: [".eslintrc.cjs"],
    rules: { "indent": ["error", 2, { SwitchCase: 1 }] }
  }]
};
