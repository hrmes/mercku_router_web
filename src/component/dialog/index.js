import Vue from 'vue';
import Dialog from './index.vue';

// 预留给深拷贝
const mergeOptions = (opt1, opt2) => ({
  ...opt1,
  ...opt2
});

const hasDialog = () => {
  const mask = document.querySelector('.mask-layer');
  if (!mask) {
    return false;
  }
  const cls = Array.from(mask.classList);
  if (cls.includes('dialog-leave-active')) {
    return false;
  }
  return true;
  // dialog-leave-active
};
const dialog = {
  info(options) {
    if (!hasDialog()) {
      const opt = mergeOptions(
        {
          title: '',
          message: 'info',
          callback: {},
          okText: 'ok'
        },
        options
      );
      opt.type = 'info';
      const Construtor = Vue.extend(Dialog);
      this.instance = new Construtor({ data: opt }).$mount();
      this.instance.visible = true;
      document.body.appendChild(this.instance.$el);
    }
  },
  confirm(options) {
    if (!hasDialog()) {
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
      opt.type = 'confirm';
      const Construtor = Vue.extend(Dialog);
      this.instance = new Construtor({ data: opt }).$mount();
      this.instance.visible = true;
      document.body.appendChild(this.instance.$el);
    }
  }
};

export default dialog;
