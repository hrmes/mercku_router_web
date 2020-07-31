import { mount } from '@vue/test-utils';
import { expect } from 'chai';
import input from '../../src/component/input/input.vue';

describe('input', () => {
  let wrapper;

  afterEach(() => {
    wrapper.vm.$destroy && wrapper.vm.$destroy();
  });
  it('default', done => {
    wrapper = mount(input);
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.inputType).to.eql('text');
      done();
    });
  });
  it('value', done => {
    wrapper = mount(input, { propsData: { value: 1 } });
    expect(wrapper.vm.inputValue).to.eql(1);
    wrapper.setProps({ value: 2 });
    expect(wrapper.vm.inputValue).to.eql(2);
    done();
  });
});
