import Vue from 'vue';

class Store {
  constructor(_Vue, state) {
    const bus = new _Vue({
      data: state
    });
    this.install(Vue, bus);
  }

  install(_Vue, bus) {
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.store) {
          Vue.prototype.$store = bus;
        }
      }
    });
  }
}
const store = new Store(Vue, {
  mode: null,
  role: sessionStorage.getItem('role'),
  modules: {
    limits: {},
    portfw: {},
    rsvdip: {},
    vpn: {}
  }
});

export default store;
