import { mount } from '@vue/test-utils';
import checkbox from '../../../../src/pc/component/checkbox/index.vue';

describe('checkbox.vue', () => {
  let wrapper;

  let vm;

  afterEach(() => {
    vm.$destroy && vm.$destroy();
    vm.$el && vm.$el.parentNode && vm.$el.parentNode.removeChild(vm.$el);
  });

  it('checked status is right', () => {
    wrapper = mount(checkbox, {
      propsData: {
        value: true,
        text: 'checkbox'
      }
    });
    vm = wrapper.vm;

    expect(
      Array.from(vm.$el.querySelector('.box').classList).indexOf('checked')
    ).to.not.eql(-1);
  });

  it('text is right', () => {
    wrapper = mount(checkbox, {
      propsData: {
        value: false,
        text: 'checkbox'
      }
    });
    vm = wrapper.vm;
    expect(vm.$el.querySelector('.text').textContent).eql('checkbox');
  });

  it('initial data is right', () => {
    wrapper = mount(checkbox, {
      propsData: {
        value: true,
        text: 'checkbox'
      }
    });
    vm = wrapper.vm;
    expect(vm.checked).to.be.true;
  });

  it('check methods is right', done => {
    wrapper = mount(checkbox, {
      propsData: {
        value: true,
        text: 'checkbox'
      }
    });
    vm = wrapper.vm;
    vm.check();
    expect(vm.checked).to.be.false;
    vm.$nextTick(() => {
      expect(
        Array.from(vm.$el.querySelector('.box').classList).indexOf('checked')
      ).to.eql(-1);
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
    vm = wrapper.vm;
    wrapper.setProps({
      value: true
    });
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.checked).to.be.true;
      expect(
        Array.from(wrapper.vm.$el.querySelector('.box').classList).indexOf(
          'checked'
        )
      ).to.not.eql(-1);
      done();
    });
  });
});
