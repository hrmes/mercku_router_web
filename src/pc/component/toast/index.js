import Vue from 'vue';
import Toast from './index.vue';

const toast = (
  text = '',
  duration = 3000,
  type = 'error',
  parentEl = '.router-view'
) => {
  const Construtor = Vue.extend(Toast);
  const instance = new Construtor({
    data: {
      text,
      duration,
      type
    }
  }).$mount();
  instance.visible = true;
  document.querySelector(parentEl).appendChild(instance.$el);
};

export default toast;
