<template>
  <transition name="loading">
    <div class="loading-container" v-if="visible">
      <div class="inner">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
          <path d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z" transform="rotate(46.6166 25 25)">
            <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"></animateTransform>
          </path>
        </svg>
        <div v-if="title" class="title">{{title}}</div>
        <div v-html="template"></div>
      </div>
    </div>
  </transition>

</template>
<script>
export default {
  data() {
    return {
      visible: false,
      template: '',
      title: ''
    };
  },
  mounted() {
    this.setOverflow();
  },
  methods: {
    setOverflow() {
      this.bodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    },
    restoryOverflow() {
      document.body.style.overflow = this.bodyOverflow || 'auto';
    }
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
  svg {
    width: 32px;
    height: 32px;
    path {
      fill: #fff;
    }
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
