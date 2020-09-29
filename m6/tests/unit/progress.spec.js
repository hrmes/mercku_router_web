import { mount } from '@vue/test-utils';
import { expect } from 'chai';
import Progress from '../../src/component/progress/index.vue';

describe('progress component', () => {
  let wrapper;
  let vnode;
  afterEach(() => {
    vnode.$destroy && vnode.$destroy();
    vnode.$el && vnode.$el.parentNode && vnode.$el.parentNode.removeChild(vnode.$el);
  });
  it('progress default data', done => {
    wrapper = mount(Progress);
    vnode = wrapper.vm;
    wrapper.setData({
      during: 60,
      percent: 0,
      timer: null,
      styles: { width: 0 }
    });
    vnode.$nextTick(() => {
      expect(vnode.$el.querySelector('.progress-bar').offsetWidth).to.eql(0);
      done();
    });
  });
  it('progress methods', done => {
    wrapper = mount(Progress);
    vnode = wrapper.vm;
    wrapper.setData({
      during: 0,
      percent: 0,
      timer: null
    });
    vnode.createTiemr();
    vnode.$nextTick(() => {
      setTimeout(() => {
        expect(Math.round(vnode.percent) === 1).to.be.true;
      }, 1000);
      done();
    });
  });
});
