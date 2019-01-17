import { mount } from '@vue/test-utils';
import { expect } from 'chai';
import Switch from '../../src/component/switch/index.vue';

describe('switch component', () => {
  let wrapper;
  let vnode;
  afterEach(() => {
    vnode.$destroy && vnode.$destroy();
    vnode.$el && vnode.$el.parentNode && vnode.$el.parentNode.removeChild(vnode.$el);
  });

  it('check default props', done => {
    wrapper = mount(Switch);
    vnode = wrapper.vm;
    wrapper.setProps({ value: true });
    vnode.$nextTick(() => {
      expect(vnode.checked).to.be.true;
      done();
    });
  });
  it('check mehods is right', done => {
    wrapper = mount(
      {
        template: '<m-switch ref="sw" v-model="check" />',
        components: { 'm-switch': Switch }
      },
      {
        data() {
          return { check: false };
        }
      }
    );
    wrapper.vm.$refs.sw.change();
    expect(vnode.checked).to.be.true;
    vnode.$nextTick(() => {
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
    vnode = wrapper.vm;
    wrapper.setProps({
      value: true,
      disabled: true
    });
    wrapper.vm.$nextTick(() => {
      expect(vnode.checked).to.be.true;
      expect(vnode.disabledValue).to.eql(true);
      done();
    });
  });
});
