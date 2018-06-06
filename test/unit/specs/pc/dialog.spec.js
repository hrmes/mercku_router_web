import dialog from '../../../../src/pc/component/dialog/index';

describe('dialog', () => {
  it('info', done => {
    dialog.info({
      title: 'title',
      message: 'info',
      callback: {
        ok: () => 'ok',
        cancel: () => 'cancel'
      },
      okText: 'ok',
      cancelText: 'cancel'
    });

    setTimeout(() => {
      const wrapper = document.body.querySelector('.dialog-container');
      expect(wrapper).to.be.exist;
      expect(wrapper.querySelector('.dialog-title').textContent).to.eql(
        'title'
      );
      expect(wrapper.querySelector('.dialog-message').textContent).to.eql(
        'info'
      );
      expect(
        wrapper.querySelector('.dialog-buttons').children[0].textContent
      ).to.eql('cancel');
      expect(
        wrapper.querySelector('.dialog-buttons').children[1].textContent
      ).to.eql('ok');

      const vm = wrapper.__vue__.$parent;
      const overflow = document.body.style.overflow;
      expect(document.body.style.overflow).to.eql('hidden');
      wrapper.addEventListener('transitionend', () => {
        expect(vm.visible).to.be.false;
        expect(document.body.style.overflow).to.eql(overflow);
        done();
      });
      vm.ok();
    }, 300);

    dialog.info({
      title: 'title',
      message: 'info',
      callback: {
        ok: () => 'ok',
        cancel: () => 'cancel'
      },
      okText: 'ok',
      cancelText: 'cancel'
    });

    setTimeout(() => {
      const wrapper = document.body.querySelector('.dialog-container');
      const vm = wrapper.__vue__.$parent;
      const overflow = document.body.style.overflow;
      wrapper.addEventListener('transitionend', () => {
        expect(vm.visible).to.be.false;
        expect(document.body.style.overflow).to.eql(overflow);
        done();
      });
      vm.cancel();
    }, 300);
  });
});
