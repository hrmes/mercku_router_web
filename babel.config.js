/**
 * Root babel config for vue-cli-service commands that run from the repo root:
 * `build:unified`, `dev:unified`, and `test:unit`.
 *
 * Mirrors the legacy per-model configs (m6/babel.config.js etc.) so the same
 * JS syntax is supported across all builds, including optional chaining and
 * nullish coalescing (used by base/src/component/modal/index.vue and the
 * unified source tree).
 *
 * Legacy per-model builds (m6, m6s, …) cd into their own directory before
 * running vue-cli-service, so babel-loader resolves their local
 * babel.config.js instead — this file does not affect them.
 */
module.exports = {
  presets: ['@vue/app'],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
};
