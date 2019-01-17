<script>
export default {
  bind(el, binding) {
    function documentHandler(e) {
      // alert(e.target);
      if (el.contains(e.target)) {
        return false;
      }
      if (binding.expression) {
        binding.value(e);
      }
      return false;
    }
    el.__vueClickOutside__ = documentHandler;
    document.addEventListener('click', documentHandler);
    document.addEventListener('touchstart', documentHandler);
  },
  unbind(el) {
    document.removeEventListener('click', el.__vueClickOutside__);
    document.removeEventListener('touchstart', el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  }
};
</script>
