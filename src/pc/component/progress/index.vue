<template>
    <div class='progress-wrapper'>
        <div class="progress" :style='styles'></div>
    </div>
</template>
<script>
export default {
  props: ['width'],
  computed: {
    styles() {
      console.log(this.width);
      return {
        width: `${this.width}px`
      };
    }
  }
};
</script>
</script>
<style lang="scss" type="text/scss" scoped>
.progress-wrapper {
  position: relative;
  width: 300px;
  height: 10px;
  border-radius: 10px;
  background: white;
  overflow: hidden;
  box-sizing: border-box;
  .progress {
    position: absolute;
    // width: 200px;
    height: 10px;
    background: #00d061;
    z-index: 1;
    transition: width 0.1ms linear 0s;
  }
}
</style>
