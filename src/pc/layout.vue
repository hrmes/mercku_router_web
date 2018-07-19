<template>
  <div class="app-container">
    <div class="flex-wrap" :class="{'has-menu':!menu_hidden}">
      <mercku-header :hasExit="hasExit" class="header" :class="{'has-menu':menu_hidden}"></mercku-header>
      <slot></slot>
      <policy :locale="$i18n.locale" :class="{'fix-bottom':menu_hidden}" class="policy" />
    </div>
  </div>
</template>
<script>
import MerckuHeader from './component/header/header.vue';
import policy from './component/policy/index.vue';

export default {
  components: {
    'mercku-header': MerckuHeader,
    policy
  },
  computed: {
    menu_hidden() {
      return (
        this.$route.path.includes('login') ||
        this.$route.path.includes('wlan') ||
        this.$route.path.includes('unconnect')
      );
    },
    hasExit() {
      return !this.menu_hidden;
    }
  }
};
</script>
<style lang="scss" scoped>
.flex-wrap {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

@media screen and (max-width: 768px) {
  .flex-wrap {
    &.has-menu {
      min-height: calc(100vh - 65px);
    }
  }
}
</style>
