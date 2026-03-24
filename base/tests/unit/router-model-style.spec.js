import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

describe('router-model style', () => {
  it('maps GA630 dashboard images explicitly', () => {
    const stylePath = path.resolve(
      process.cwd(),
      'base/src/style/router-model.scss'
    );
    const styleContent = fs.readFileSync(stylePath, 'utf8');

    expect(styleContent).to.include('&.GA630');
    expect(styleContent).to.include('dashboard/m6s/img_black.png');
    expect(styleContent).to.include('dashboard/m6s/img_white.png');
  });
});
