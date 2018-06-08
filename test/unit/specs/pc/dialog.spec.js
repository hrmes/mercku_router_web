import dialog from '../../../../src/pc/component/dialog/index';

describe('dialog', () => {
  it('check info dialog props and ok method', done => {
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
      vm.ok();

      setTimeout(() => {
        expect(vm.visible).to.be.false;
        expect(document.body.style.overflow).to.eql(overflow);
        done();
      }, 1000);
    }, 300);
  });

  it('check info dialog cancel method', done => {
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
      vm.cancel();
      setTimeout(() => {
        expect(vm.visible).to.be.false;
        expect(document.body.style.overflow).to.eql(overflow);
        done();
      }, 1000);
    }, 300);
  });
});
