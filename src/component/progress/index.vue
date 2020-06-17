<template>
  <div v-if="show"
       class="reboot-model-contanier">
    <div class='shadow'></div>
    <div class='progress-wrapper'>
      <div class="progress">
        <div class="progress-bar"
             :style='styles'>
        </div>
      </div>
    </div>
    <div class="note">{{label}}{{countdown}}s</div>
    <p style="color:white">{{description}}</p>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    during: {
      type: Number,
      default: 5
    },
    description: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      percent: 0,
      timer: null,
      styles: { width: 0 },
      countdown: this.during
    };
  },
  mounted() {
    this.createTimer();
  },
  computed: {
    show() {
      return this.countdown > 0;
    }
  },
  methods: {
    createTimer() {
      const average = 100 / this.during;
      document.body.classList.add('body--has-mask');
      this.timer = setInterval(() => {
        if (!this.countdown) {
          this.cleanup();
          return;
        }
        this.countdown -= 1;
        this.percent += average;
        this.styles.width = `${this.percent}%`;
      }, 1000);
    },
    cleanup() {
      clearTimeout(this.timer);
      document.body.classList.remove('body--has-mask');
    }
  },
  beforeDestroy() {
    console.log('before destroy');
    this.cleanup();
  }
};
</script>
<style lang="scss" type="text/scss" scoped>
.reboot-model-contanier {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  flex-direction: column;
  .shadow {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background: $progress-shadow-background-color;
    opacity: $progress-shadow-opacity;
  }

  .progress-wrapper {
    width: 300px;
    z-index: 2001;
    .progress {
      height: 10px;
      background: $progress-background-color;
      border-radius: 50px;
    }
    .progress-bar {
      float: left;
      width: 0;
      height: 100%;
      border-radius: 50px;
      font-size: 12px;
      max-width: 100%;
      line-height: 20px;
      overflow: hidden;
      color: #fff;
      text-align: center;
      background-color: #00d061;
      transition: width 1s ease;
    }
  }
  .note {
    margin-top: 20px;
    font-size: 18px;
    text-align: center;
    color: #ffffff !important;
  }
}

@media screen and (max-width: 768px) {
  .progress-wrapper {
    width: 80% !important;
  }
}
</style>
