/* eslint-env mocha */
const { expect } = require('chai');
const fs = require('fs');

const headerSource = fs.readFileSync(
  'base/src/component/header/header.vue',
  'utf8'
);
const themeSource = fs.readFileSync(
  'unified/src/assets/branding/default/theme-baseline.scss',
  'utf8'
);

describe('Unified customer logo presentation', () => {
  it('allows unified branding to preserve the original logo colors', () => {
    expect(headerSource).to.include('filter: var(--header-logo-filter, var(--img-brightness));');
    expect(themeSource).to.match(/--header-logo-filter:\s*none;/);
  });
});
