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
      linear-gradient(104deg, #d6001c, #ee1d4f 42%, #ff6734) !important;
  }
}
</style>
