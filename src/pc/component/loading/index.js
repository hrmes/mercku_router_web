import Vue from 'vue';
import LoadingComponent from './loading.vue';


const defaultOptions = {
  template: '加载中'
};

const Loading = {
  instance: null,
  open(options) {
    const opt = { ...defaultOptions,
      options
    };
    if (!this.instance) {
      const Construtor = Vue.extend(LoadingComponent);
      this.instance = new Construtor({
        el: document.createElement('div'),
        propsData: {
          template: opt.template
        }
      });
      document.body.appendChild(this.instance.$el);
    }
  },
  close() {
    if (this.instance) {
      this.instance.$el.remove();
    }
  }
};

export default Loading;
