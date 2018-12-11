<template>
  <div class="reboot-model-contanier">
    <div class='shadow'></div>
    <div class='progress-wrapper'>
      <div class="progress">
        <div class="progress-bar" :style='styles'>
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
      default: 60
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
      styles: {
        width: 0
      },
      countdown: this.during
    };
  },
  mounted() {
    this.setOverflow();
    this.createTiemr();
  },
  methods: {
    createTiemr() {
      const average = 100 / this.during;
      this.timer = setInterval(() => {
        this.countdown -= 1;
        this.percent += average;
        this.styles.width = `${this.percent}%`;
        if (!this.countdown) clearTimeout(this.timer);
      }, 1000);
    },
    setOverflow() {
      document.body.style.overflow = 'hidden';
    },
    restoryOverflow() {
      document.body.style.overflow = 'auto';
    }
  },
  beforeDestroy() {
    this.restoryOverflow();
    clearTimeout(this.timer);
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
  // background: #000;
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
    background: #000;
    opacity: 0.8;
  }
  .note {
    margin-top: 20px;
    font-size: 18px;
    color: #ffffff !important;
  }
}
.progress {
  height: 10px;
  background: #ffffff;
  border-radius: 50px;
}
.progress-wrapper {
  width: 300px;
  z-index: 2001;
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
@media screen and (max-width: 768px) {
  .progress-wrapper {
    width: 80% !important;
  }
}
</style>
