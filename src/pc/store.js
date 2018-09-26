import Vue from 'vue';

class Store {
  constructor(Vue, options) {
    const bus = new Vue({
      data: {
        state: options.state
      }
    });
    this.install(Vue, bus);
  }
  install(Vue, bus) {
    Vue.mixin({
      beforeCreate() {
        if (this.$options.store) {
          Vue.prototype.$store = bus;
        }
      }
    });
  }
}
const store = new Store(Vue, {
  state: {
    limits: {}
  }
});

export default store;
