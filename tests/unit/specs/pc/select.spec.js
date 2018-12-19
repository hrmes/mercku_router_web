import { mount } from '@vue/test-utils';
import select from '../../../../src/pc/component/select/index.vue';

describe('select', () => {
  let wrapper;
  const options = [
    {
      value: 1,
      text: '1'
    },
    {
      value: 2,
      text: '2'
    }
  ];
  afterEach(() => {
    wrapper.vm.$destroy && wrapper.vm.$destroy();
  });
  it('default', done => {
    wrapper = mount(select);

    wrapper.vm.$nextTick(() => {
      const lis = wrapper.vm.$el.querySelectorAll('.select-popup li');
      expect(lis.length).to.eql(0);

      done();
    });
  });
  it('has options', done => {
    wrapper = mount(select, {
      propsData: {
        options,
        value: 2,
        label: 'select'
      }
    });

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.value).to.eql(2);
      expect(wrapper.vm.$el.querySelector('label').textContent).to.eql(
        'select'
      );
      const lis = wrapper.vm.$el.querySelectorAll('.select-popup li');
      expect(lis.length).to.eql(2);
      expect(lis[0].textContent).to.eql('1');
      expect(lis[1].textContent).to.eql('2');
      done();
    });
  });

  it('change value', done => {
    wrapper = mount(select, {
      propsData: {
        options,
        value: 2,
        label: 'select'
      }
    });

    expect(wrapper.vm.value).to.eql(2);

    wrapper.setProps({
      value: 1
    });
    expect(wrapper.vm.value).to.eql(1);
    expect(wrapper.vm.selected).to.eql(options[0]);
    done();
  });

  it('select method', done => {
    wrapper = mount(select, {
      propsData: {
        options,
        value: 2,
        label: 'select'
      }
    });

    wrapper.vm.select(options[0]);
    expect(wrapper.vm.opened).to.be.false;
    expect(wrapper.vm.selected).to.eql(options[0]);
    done();
  });
  it('open method', done => {
    wrapper = mount(select, {
      propsData: {
        options,
        value: 2,
        label: 'select'
      }
    });

    wrapper.vm.open();
    expect(wrapper.vm.opened).to.be.true;
    wrapper.vm.open();
    expect(wrapper.vm.opened).to.be.false;
    done();
  });
  it('close method', done => {
    wrapper = mount(select, {
      propsData: {
        options,
        value: 2,
        label: 'select'
      }
    });

    wrapper.vm.close();
    expect(wrapper.vm.opened).to.be.false;
    done();
  });
});
