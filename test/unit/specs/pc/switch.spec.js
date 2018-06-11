import { mount } from '@vue/test-utils';
import Switch from '../../../../src/pc/component/switch/index.vue';

describe('switch component', () => {
  let wrapper;
  let vm;
  afterEach(() => {
    vm.$destroy && vm.$destroy();
    vm.$el && vm.$el.parentNode && vm.$el.parentNode.removeChild(vm.$el);
  });

  it('check default props', done => {
    wrapper = mount(Switch);
    vm = wrapper.vm;
    wrapper.setProps({
      value: true
    });
    vm.$nextTick(() => {
      expect(vm.$el.getAttribute('type')).to.eql('checkbox');
      expect(vm.checked).to.eql(true);
      expect(vm.$el.checked).to.be.true;
      done();
    });
  });
  it('check mehods is right', done => {
    wrapper = mount(
      {
        template: '<m-switch ref="sw" v-model="check" />',
        components: {
          'm-switch': Switch
        }
      },
      {
        data() {
          return {
            check: false
          };
        }
      }
    );
    wrapper.vm.$refs.sw.change();
    expect(vm.checked).to.be.true;
    vm.$nextTick(() => {
      expect(wrapper.vm.$refs.sw.checked).to.be.true;
      done();
    });
  });
  it('change props', done => {
    wrapper = mount(Switch, {
      propsData: {
        value: false,
        disabled: false
      }
    });
    vm = wrapper.vm;
    wrapper.setProps({
      value: true,
      disabled: true
    });
    wrapper.vm.$nextTick(() => {
      expect(vm.checked).to.be.true;
      expect(vm.disabledValue).to.eql(true);
      expect(vm.$el.disabled).to.be.true;
      done();
    });
  });
});
