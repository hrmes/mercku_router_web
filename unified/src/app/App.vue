<template>
  <BaseAppShell :menus="menus" />
</template>
<script>
import BaseAppShell from 'base/layouts/app-shell.vue';
import { createMenu } from './menu/create-menu';

export default {
  name: 'App',
  components: { BaseAppShell },
  computed: {
    menus() {
      const { runtimeContext } = this.$store.getters;
      if (!runtimeContext) return [];
      return createMenu(
        runtimeContext,
        this.$store.getters.role || '',
        this.$store.getters.mode || ''
      );
    }
  }
};
</script>
