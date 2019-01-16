import { expect } from 'chai';
import toast from '../../src/component/toast/index';

describe('toast', () => {
  it('toast is open', () => {
    toast('toast', 100, 'error', 'body');
    expect(document.body.querySelector('.toast-container')).to.be.exist;
  });
  it('toast is close', done => {
    toast('toast', 100, 'error', 'body');
    setTimeout(() => {
      expect(document.body.querySelector('.toast-container')).to.be.not.exist;
      done();
    }, 1000);
  });
});
