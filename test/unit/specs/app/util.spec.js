// import util, { isIphone, ipRexp } from '../../../src/util/util';
import { ipRexp } from '../../../../src/app/util/util';

describe('util.js', () => {
  it('is ip', () => {
    expect(ipRexp('10.70.107.1')).to.be.true;
  });
  it('is not ip', () => {
    expect(ipRexp('')).to.be.false;
  });
  it('is not ip', () => {
    expect(ipRexp('255.255.255.256')).to.be.false;
  });
});
