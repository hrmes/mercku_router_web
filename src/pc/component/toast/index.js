import Vue from 'vue';
import Toast from './index.vue';

const toast = (text = '', duration = 3000, type = 'error') => {
  const Construtor = Vue.extend(Toast);
  this.instance = new Construtor({
    data: {
      text,
      duration,
      type
    }

  }).$mount();
  this.instance.visible = true;
  document.body.appendChild(this.instance.$el);
};

export default toast;
