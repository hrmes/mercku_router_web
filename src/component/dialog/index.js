import Vue from 'vue';
import Dialog from './index.vue';

const mergeOptions = (opt1, opt2) => ({
  ...opt1,
  ...opt2
});

const dialog = {
  info(options) {
    const opt = mergeOptions(
      {
        title: '',
        message: 'info',
        callback: {},
        okText: 'ok',
        cancelText: 'cancel'
      },
      options
    );
    const Construtor = Vue.extend(Dialog);
    this.instance = new Construtor({ data: opt }).$mount();
    this.instance.visible = true;
    document.body.appendChild(this.instance.$el);
  },
  confirm(options) {
    const opt = mergeOptions(
      {
        title: '',
        message: 'confirm',
        callback: {},
        okText: 'ok',
        cancelText: 'cancel'
      },
      options
    );
    const Construtor = Vue.extend(Dialog);
    this.instance = new Construtor({ data: opt }).$mount();
    this.instance.visible = true;
    document.body.appendChild(this.instance.$el);
  }
};

export default dialog;
