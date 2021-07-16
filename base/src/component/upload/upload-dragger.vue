<template>
  <div class="dragger"
       @dragover.prevent="handleDragOver"
       @drop.prevent="handleDrop">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    uploadLoading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleDragOver() {},
    handleDrop(e) {
      if (this.uploadLoading) {
        return;
      }
      this.isDragOver = false;
      const { files } = e.dataTransfer;
      this.$emit('file', files);
    }
  }
};
</script>

<style lang="scss">
.dragger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 513px;
  height: 188px;
  border-radius: 8px;
  border: dashed 1px #999999;
  position: relative;
}
</style>
