<template>
  <div class="tabs">
    <slot></slot>
  </div>
</template>
<script>
export default {};
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  padding: 0 20px;
  border-bottom: 1px solid #f1f1f1;
  .tab {
    font-size: 18px;
    padding: 10px 10px;
    min-width: 150px;
    cursor: pointer;
    &:hover,
    &:active {
      background: #f1f1f1;
      color: #999999;
    }
    &.selected {
      border-bottom: 3px solid #d6001c;
      color: #d6001c;
    }
    &:first-child {
      margin-left: 0;
    }
  }
}
</style>
