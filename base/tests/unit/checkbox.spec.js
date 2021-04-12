import { mount } from '@vue/test-utils';
import { expect } from 'chai';
import checkbox from '../../src/component/checkbox/index.vue';

describe('checkbox.vue', () => {
  let wrapper;
  let vnode;

  afterEach(() => {
    vnode.$destroy && vnode.$destroy();
    vnode.$el && vnode.$el.parentNode && vnode.$el.parentNode.removeChild(vnode.$el);
  });

  it('checked status is right', () => {
    wrapper = mount(checkbox, {
      propsData: {
        value: true,
        text: 'checkbox'
      }
    });
    vnode = wrapper.vm;

    expect(Array.from(vnode.$el.querySelector('.box').classList).indexOf('checked')).to.not.eql(-1);
  });

  it('text is right', () => {
    wrapper = mount(checkbox, {
      propsData: {
        value: false,
        text: 'checkbox'
      }
    });
    vnode = wrapper.vm;
    expect(vnode.$el.querySelector('.text').textContent).eql('checkbox');
  });

  it('initial data is right', () => {
    wrapper = mount(checkbox, {
      propsData: {
        value: true,
        text: 'checkbox'
      }
    });
    vnode = wrapper.vm;
    expect(vnode.checked).to.be.true;
  });

  it('check methods is right', done => {
    wrapper = mount(checkbox, {
      propsData: {
        value: true,
        text: 'checkbox'
      }
    });
    vnode = wrapper.vm;
    vnode.check();
    expect(vnode.checked).to.be.false;
    vnode.$nextTick(() => {
      expect(Array.from(vnode.$el.querySelector('.box').classList).indexOf('checked')).to.eql(-1);
      done();
    });
  });

  it('watch methods is right', done => {
    wrapper = mount(checkbox, {
      propsData: {
        value: false,
        text: 'checkbox'
      }
    });
    vnode = wrapper.vm;
    wrapper.setProps({ value: true });
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.checked).to.be.true;
      expect(
        Array.from(wrapper.vm.$el.querySelector('.box').classList).indexOf('checked')
      ).to.not.eql(-1);
      done();
    });
  });
});
