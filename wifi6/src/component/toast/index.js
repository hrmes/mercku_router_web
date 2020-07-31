import Vue from 'vue';
import Toast from './index.vue';

const toast = (text = '', duration = 3000, type = 'error', parentEl = '.srcollbar-wrap') => {
  const Construtor = Vue.extend(Toast);
  const instance = new Construtor({
    data: {
      text,
      duration,
      type
    }
  }).$mount();
  instance.visible = true;

  const pEl = document.querySelector(parentEl);
  pEl.appendChild(instance.$el);

  const rect = pEl.getBoundingClientRect();

  const left = rect.left + rect.width / 2;

  instance.$el.style.left = `${left}px`;
};

export default toast;
