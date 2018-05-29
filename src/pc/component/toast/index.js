import Vue from 'vue';
import Toast from './index.vue';

const toast = (options) => {
  const opt = {
    ...{
      text: 'toast1',
      duration: 3000,
      type: 'success'
    },
    ...options
  };

  const Construtor = Vue.extend(Toast);
  this.instance = new Construtor({
    data: opt
  }).$mount();
  this.instance.visible = true;
  document.body.appendChild(this.instance.$el);
};

export default toast;
