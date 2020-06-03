<script>
export default {
  bind(el, bind) {
    const keyCode = bind.value || 13;
    function documentHandler(e) {
      const cls = Array.from(document.body.classList);
      if (
        e.keyCode === keyCode &&
        !cls.includes('body--is-loading') &&
        !cls.includes('body--has-mask')
      ) {
        el.click();
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
