import Vue from 'vue';
import Toast from './index.vue';

let toastInstance = null;
const toast = (
  text = '',
  duration = 2000,
  type = 'error',
  parentEl = '.scrollbar-wrap'
) => {
  if (!toastInstance) {
    const Construtor = Vue.extend(Toast);
    toastInstance = new Construtor({
      data: {
        text,
        duration,
        type
      }
    }).$mount();
    const pEl = document.querySelector(parentEl);
    pEl.appendChild(toastInstance.$el);
    toastInstance.visible = true;
  }
  toastInstance.updateContent({ text, duration, type });
};

export default toast;
