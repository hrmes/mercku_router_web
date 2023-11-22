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
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    position: relative;
    font-size: 14px;
    padding: 7px 30px;
    cursor: pointer;
    border-radius: 5px;
    color: var(--text_default-color);
    background: var(--logout_btn-bgc);
    border-radius: 20px;
    box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2);
    transition: background 0.3s ease-in-out;
    .iconfont {
      color: var(--tab-icon-color);
    }
    &.selected {
      color: #fff;
      background-image: var(--button-bgc);
      box-shadow: var(--button-boxshadow);
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
    padding: 0 20px;
    margin: 0 0 15px;
    justify-content: space-between;
    .tab {
      flex: 1;
      font-size: 14px;
      min-width: initial;
      margin-right: 10px;
      padding: 7px 0;
      text-align: center;
      &:last-child {
        margin: 0;
      }
    }
  }
}
@media screen and (max-width: 280px) {
  .tabs {
    padding: 0;
    margin: 0 0 15px;
    justify-content: space-between;
    .tab {
      flex: 1;
      font-size: 13px;
      min-width: initial;
      margin-right: 3px;
      padding: 7px 0;
      text-align: center;
      &:last-child {
        margin: 0;
      }
    }
  }
}
</style>
