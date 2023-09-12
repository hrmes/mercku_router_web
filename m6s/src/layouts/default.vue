<template>
  <router-view class="default">
  </router-view>
</template>

<style lang="scss">
.default {
  min-width: 1280px;
}
@media screen and (max-width: 768px) {
  .default {
    min-width: auto;
  }
}
</style>
