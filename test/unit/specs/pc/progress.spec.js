import { mount } from '@vue/test-utils';
import Progress from '../../../../src/pc/component/progress/index.vue';

describe('progress component', () => {
  let wrapper;
  let vm;
  afterEach(() => {
    vm.$destroy && vm.$destroy();
    vm.$el && vm.$el.parentNode && vm.$el.parentNode.removeChild(vm.$el);
  });
  it('progress default data', done => {
    wrapper = mount(Progress);
    vm = wrapper.vm;
    wrapper.setData({
      during: 60,
      percent: 0,
      timer: null,
      styles: {
        width: 0
      }
    });
    vm.$nextTick(() => {
      expect(vm.$el.querySelector('.progress-bar').offsetWidth).to.eql(0);
      done();
    });
  });
  it('progress methods', done => {
    wrapper = mount(Progress);
    vm = wrapper.vm;
    wrapper.setData({
      during: 0,
      percent: 0,
      timer: null
    });
    vm.createTiemr();
    vm.$nextTick(() => {
      setTimeout(() => {
        expect(Math.round(vm.percent) === 1).to.be.true;
      }, 1000);
      // expect(vm.timer).to.eql(null);
      done();
    });
  });
});
