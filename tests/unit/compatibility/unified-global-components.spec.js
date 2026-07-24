/* eslint-env mocha */
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

describe('unified global component registry', () => {
  it('registers radio cards required by SFP and fan, but omits unused widgets', () => {
    const source = fs.readFileSync(
      path.resolve(process.cwd(), 'unified/src/app/register-components.js'),
      'utf8'
    );

    expect(source).to.include('component/radioCardGroup');
    expect(source).to.include("Vue.component('m-radio-card-group'");

    [
      'component/progress',
      'component/scanUpperSelect',
      "Vue.component('m-progress'",
      "Vue.component('m-scan-upper-select'",
    ].forEach((unusedReference) => {
      expect(source).not.to.include(unusedReference);
    });
  });
});
