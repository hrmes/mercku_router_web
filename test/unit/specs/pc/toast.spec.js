import toast from '../../../../src/pc/component/toast/index';

describe('toast', () => {
  it('toast is open', done => {
    toast('toast', 1000, 'error');
    setTimeout(() => {
      const wrapper = document.body.querySelector('.toast-container');
      expect(wrapper).to.be.exist;
      done();
    });
  });
  it('toast is close', done => {
    toast('toast', 100, 'error');
    const wrapper = document.body.querySelector('.toast-container');
    wrapper.addEventListener('transitionend', () => {
      setTimeout(() => {
        expect(document.body.querySelector('.toast-container')).to.be.not.exist;
        done();
      }, 1000);
    });
  });
});
