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
      document.body.classList.add('body--is-loading');
    }
  },
  close() {
    if (this.instance) {
      this.instance.visible = false;
      let { instance } = this;
      this.instance = null;
      instance.$el.addEventListener('transitionend', () => {
        if (instance) {
          instance.$el.parentNode.removeChild(instance.$el);
          instance = null;
          document.body.classList.remove('body--is-loading');
        }
      });
      // fix ie bug
      const timer = setTimeout(() => {
        if (instance) {
          instance.$el.parentNode.removeChild(instance.$el);
          instance = null;
          document.body.classList.remove('body--is-loading');
        }
        clearTimeout(timer);
      }, 500);
    }
  }
};

export default Loading;
