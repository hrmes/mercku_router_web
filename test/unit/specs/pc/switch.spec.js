import {
  mount
}
from '@vue/test-utils';
import Switch from '../../../../src/pc/component/switch/index.vue';

describe('switch component', () => {
  const wrapper = mount(Switch);
  const vm = wrapper.vm;
  it('check default props', (done) => {
    wrapper.setProps({
      value: true,
      disabled: false,
      onChange: (v) => {
        expect(v).to.be.false;
      }
    });
    vm.$nextTick(() => {
      expect(vm.$el.getAttribute('type')).to.eql('checkbox');
      expect(vm.checked).to.eql(true);
      expect(vm.disabledValue).to.eql(false);
      expect(vm.$el.checked).to.be.true;
      expect(vm.$el.disabled).to.be.false;
      done();
    });
  });
  it('change props', () => {
    wrapper.setData({
      checked: true
    });
    vm.$on('input', (v) => {
      expect(v).to.be.true;
    });
  });
});
