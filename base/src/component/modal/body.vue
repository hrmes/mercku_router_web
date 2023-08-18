<template>
  <div class="modal-body">
    <slot></slot>
  </div>
</template>
<style lang="scss" scoped>
.modal-body {
  // padding: 30px 30px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  color: var(--text-default-color) !important;
  .btn-default {
    background-image: linear-gradient(
        to right,
        var(--modal-content-background),
        var(--modal-content-background)
      ),
      var(--common-btn_default-bgimg) !important;
  }
  @media screen and (min-width: 768px) {
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background-color: var(--scrollbar_wrap-track-color);
      // border-radius: 100px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: var(--scrollbar_wrap-thumb-color);
      border-radius: 100px;
      &:hover {
        opacity: 0.5;
      }
    }
  }
}
</style>
