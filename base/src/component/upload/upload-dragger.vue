<template>
  <div class="dragger is-drag-over"
       @dragleave="handleDragLeave"
       @dragover="handleDragOver"
       @drop="handleDrop">
    <div class="dragger__wrap"
         v-if="isDragOver">
      {{$t('trans0927')}}
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDragOver: false
    };
  },
  props: {
    uploadLoading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleDragOver(e) {
      e.preventDefault();
      this.isDragOver = true;
    },
    handleDragLeave(e) {
      e.preventDefault();
      this.isDragOver = false;
    },
    handleDrop(e) {
      e.preventDefault();
      this.isDragOver = false;
      if (this.uploadLoading) {
        return;
      }
      this.$parent.initUploadStatus();
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
  .dragger__wrap {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    pointer-events: none;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @media screen and (max-width: 768px) {
    width: 100%;
  }
}
</style>
