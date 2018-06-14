import Vue from 'vue';
import LoadingComponent from './loading.vue';

const defaultOptions = {
  template: ''
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
          template: opt.template
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
      this.instance.$el.addEventListener('transitionend', () => {
        self.instance.restoryOverflow();
        self.instance.$el.parentNode.removeChild(self.instance.$el);
        self.instance = null;
      });
    }
  }
};

export default Loading;
