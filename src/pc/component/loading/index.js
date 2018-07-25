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
      const self = this;
      this.instance.restoryOverflow();
      this.instance.$el.addEventListener('transitionend', () => {
        if (self.instance) {
          self.instance.$el.parentNode.removeChild(self.instance.$el);
          self.instance = null;
        }
      });
      // fix ie bug
      const timer = setTimeout(() => {
        if (self.instance) {
          self.instance.$el.parentNode.removeChild(self.instance.$el);
          self.instance = null;
        }
        clearTimeout(timer);
      }, 500);
    }
  }
};

export default Loading;
