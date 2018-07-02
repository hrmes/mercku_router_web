<template>
  <div class="app-container">
    <div class="flex-wrap" :class="{'has-menu':!hasMenu}">
      <mercku-header :hasExit="hasExit" class="header" :class="{'has-menu':hasMenu}"></mercku-header>
      <slot></slot>
      <policy :locale="$i18n.locale" :class="{'fix-bottom':hasMenu}" class="policy" />
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
    hasMenu() {
      return (
        this.$route.path.includes('login') ||
        this.$route.path.includes('wlan') ||
        this.$route.path.includes('disappear')
      );
    },
    hasExit() {
      return !this.hasMenu;
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
