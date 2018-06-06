import {
  mount
}
from '@vue/test-utils';
import Progress from '../../../../src/pc/component/progress/index.vue';

describe('progress component', () => {
  const wrapper = mount(Progress);
  const vm = wrapper.vm;
  it('progress default data', (done) => {
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
  it('progress timer', (done) => {
    wrapper.setData({
      during: 0,
      percent: 80,
    });
    vm.$nextTick(() => {
      expect(vm.timer).to.eql(null);
      console.log(vm.$el.querySelector('.progress-wrapper').offsetWidth);
      done();
    });
  });
});
