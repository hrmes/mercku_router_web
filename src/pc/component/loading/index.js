import Vue from 'vue';
import LoadingComponent from './loading.vue';

const defaultOptions = {
  template: '',
  title: ''
};
const Loading = {
  instance: null,
  open(options) {
    const opt = {
      ...defaultOptions,
      ...options
    };
    if (!this.instance) {
      const Construtor = Vue.extend(LoadingComponent);
      this.instance = new Construtor({
        data: {
          template: opt.template,
          title: opt.title
        }
      }).$mount();
      this.instance.visible = true;
      document.body.appendChild(this.instance.$el);
    }
  },
  close() {
    if (this.instance) {
      this.instance.visible = false;
      this.instance.restoryOverflow();
      let instance = this.instance;
      this.instance = null;
      instance.$el.addEventListener('transitionend', () => {
        if (instance) {
          instance.$el.parentNode.removeChild(instance.$el);
          instance = null;
        }
      });
      // fix ie bug
      const timer = setTimeout(() => {
        if (instance) {
          instance.$el.parentNode.removeChild(instance.$el);
          instance = null;
        }
        clearTimeout(timer);
      }, 500);
    }
  }
};

export default Loading;
