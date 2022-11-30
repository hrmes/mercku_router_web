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
  padding: 10px 0;
  .tab {
    position: relative;
    font-size: 14px;
    font-weight: 600;
    padding: 7px 10px;
    cursor: pointer;
    border-radius: 5px;
    transition: background 0.3s ease-out;
    &:hover {
      background: var(--tab-hover-background-color);
    }
    &.selected {
      color: var(--tab-selected-color);
    }
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      right: -10px;
      transform: translateY(-40%);
      display: inline-block;
      width: 1px;
      height: 12px;
      cursor: default;
      border: 0.5px solid transparent;
      border-left-color: #d8d8d8;
    }
    margin-right: 20px;
    &:last-child {
      margin: 0;
      &::after {
        display: none;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .tabs {
    padding: 0;
    justify-content: space-between;
    .tab {
      // flex: 1;
      font-size: 14px;
      min-width: initial;
      margin: 0;
      padding: 7px 5px;
      text-align: center;
      &:hover {
        background: none;
      }
      &::after {
        right: -20%;
      }
    }
  }
}
</style>
