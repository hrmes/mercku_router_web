const fs = require('fs');
const path = require('path');
const { expect } = require('chai');

describe('model constants', () => {
  it('maps M11R4 to the existing M6s product identity', () => {
    const constantPath = path.resolve(
      process.cwd(),
      'base/src/util/constant.js'
    );
    const constantContent = fs.readFileSync(constantPath, 'utf8');

    expect(constantContent).to.include("ModelIds.M11R4 = 'M6s';");
    expect(constantContent).to.include("M11R4: { 4: 'M6s' }");
    expect(constantContent).to.include("11: { 0: 'M6s', 1: 'M6s', 2: 'M6s_SFP', 4: 'M6s' }");
  });
});
