<script>
export default {
  bind(el, bind) {
    const keyCode = bind.value || 13;
    function documentHandler(e) {
      const mask = document.querySelector('.mask-layer');

      if (e.keyCode === keyCode) {
        !mask && el.click();
      }
    }
    el.__vueClickDocument__ = documentHandler;
    document.addEventListener('keydown', documentHandler);
  },
  unbind(el) {
    document.removeEventListener('keydown', el.__vueClickDocument__);
    delete el.__vueClickDocument__;
  }
};
</script>
