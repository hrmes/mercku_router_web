class Store {
  constructor(_Vue, state) {
    const bus = new _Vue({
      data: state
    });
    this.install(_Vue, bus);
  }

  install(_Vue, bus) {
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.store) {
          _Vue.prototype.$store = bus;
        }
      }
    });
  }
}
export default Store;
