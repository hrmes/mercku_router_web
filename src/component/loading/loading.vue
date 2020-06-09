<template>
  <transition name="loading">
    <div class="loading-container"
         v-if="visible">
      <img src="../../assets/images/loading-3.gif"
           alt="">
      <!-- <LoadingNew :size="60" /> -->
    </div>
  </transition>

</template>
<script>
import LoadingNew from './loading-new.vue';

export default {
  components: {
    LoadingNew
  },
  data() {
    return {
      visible: false,
      template: '',
      title: ''
    };
  }
};
</script>
<style lang="scss" scoped>
.loading-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 100px;
  }
  .inner-container {
    width: 100%;
    height: 100%;
    position: relative;
  }
  &.loading-enter {
    opacity: 0;
  }
  &.loading-enter-active {
    transition: all 0.3s ease-in;
  }
  &.loading-leave-active {
    opacity: 0;
    transition: all 0.3s ease-out;
  }

  .inner {
    text-align: center;
    color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .title {
      font-size: 24px;
      margin-top: 10px;
      color: #fff;
    }
  }
}
</style>
