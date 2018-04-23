<template>
  <div>
    <nav-bar :option="option" />
    <div class="policy-container">
      使用协议使用协议使用协议
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      option: {
        left: {
          icon: true,
          text: 'arrow-left',
          click: () => {
            this.$router.replace({ path: '/welcome' });
          }
        },
        center: {
          text: 'trans0139'
        }
      }
    };
  }
};
</script>
<style lang="scss" scoped>
.policy-container {
  padding: 0 0.15rem;
  color: #b6b6b6;
}
</style>
