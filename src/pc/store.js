import Vue from 'vue';

class Store {
  constructor(_Vue, options) {
    const bus = new _Vue({
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
    limits: {},
    portfw: {},
    rsvdip: {},
    vpn: {}
  }
});

export default store;
