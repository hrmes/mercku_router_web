import toast from '../../../../src/pc/component/toast/index';

describe('toast', () => {
  it('toast is open', () => {
    toast('toast', 100, 'error');
    expect(document.body.querySelector('.toast-container')).to.be.exist;
  });
  it('toast is close', done => {
    toast('toast', 100, 'error');
    setTimeout(() => {
      expect(document.body.querySelector('.toast-container')).to.be.not.exist;
      done();
    }, 500);
  });
});
