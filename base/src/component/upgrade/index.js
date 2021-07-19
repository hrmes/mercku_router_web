import Vue from 'vue';
import upgradeComponent from './upgrade.vue';

const defaultOptions = {
  tip: '',
  title: '',
  timeout: 300
};
const Upgrade = {
  instance: null,
  open(options) {
    const opt = {
      ...defaultOptions,
      ...options
    };
    if (!this.instance) {
      const Construtor = Vue.extend(upgradeComponent);
      this.instance = new Construtor({
        data: {
          tip: opt.tip,
          title: opt.title,
          timeout: opt.timeout
        }
      }).$mount();
      this.instance.visible = true;
      document.body.appendChild(this.instance.$el);
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

export default Upgrade;
