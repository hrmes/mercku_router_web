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
    padding: 20px 0;
    font-weight: bold;
    cursor: pointer;
    position: relative;
    &:hover,
    :active {
      color: #999;
    }
    &.selected {
      &::before {
        content: '';
        display: block;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: #d6001c;
        border-radius: 5px;
      }

      color: #d6001c;
    }
    margin-left: 50px;
    &:first-child {
      margin-left: 0;
    }
  }
}
@media screen and (max-width: 768px) {
  .tabs {
    padding: 0;
    .tab {
      font-size: 14px;
      min-width: initial;
      margin-left: 30px;
      &:hover {
        background: none;
      }
    }
  }
}
</style>
