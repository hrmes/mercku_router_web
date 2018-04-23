import { mount } from 'vue-test-utils';
import navBar from '../../../src/component/nav-bar.vue';

describe('nav-bar.vue', () => {
  const wrapper = mount(navBar);
  const vm = wrapper.vm;
  wrapper.setProps({
    onLeftClick: () => {
      console.log('back');
    },
    onRightClick: () => {
      console.log('handle');
    },
    option: {
      left: {
        icon: 'test'
      },
      center: {
        text: 'test'
      },
      right: {
        text: 'test'
      }
    }
  });
  it('has back button and click', () => {
    expect(vm.option.left.icon).to.be.a('string');
    expect(vm.onLeftClick).to.be.a('function');
  });
  it('has center text', () => {
    expect(vm.option.center.text).to.be.a('string');
  });
  it('has right button and click', () => {
    expect(vm.option.right.text).to.be.a('string');
    expect(vm.onRightClick).to.be.a('function');
  });
});
