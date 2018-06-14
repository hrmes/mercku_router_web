<template>
  <div class="app-container" :class="{'has-menu':!hasMenu}">
    <mercku-header :hasExit="hasExit" class="header" :class="{'has-menu':hasMenu}"></mercku-header>
    <slot>

    </slot>
    <policy :class="{'fix-bottom':hasMenu}" class="policy" />
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
