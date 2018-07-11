<template>
  <div class="reboot-model-contanier">
    <div class='shadow'></div>
    <div class='progress-wrapper'>
      <div class="progress">
        <div class="progress-bar" :style='styles'>
        </div>
      </div>
    </div>
    <div class="note">{{label}}{{during}}s</div>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      during: 60,
      percent: 0,
      timer: null,
      styles: {
        width: 0
      }
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
        this.during -= 1;
        this.percent += average;
        this.styles.width = `${this.percent}%`;
        console.log('percent is:', this.percent);
        if (!this.during) clearTimeout(this.timer);
      }, 1000);
    },
    setOverflow() {
      this.bodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    },
    restoryOverflow() {
      document.body.style.overflow = this.bodyOverflow || 'auto';
    }
  },
  beforeDestroy() {
    this.restoryOverflow();
    clearTimeout(this.timer);
  }
};
</script>
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
    font-weight: 100;
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
    -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
    transition: width 1s ease;
  }
}
@media screen and (max-width: 768px) {
  .progress-wrapper {
    width: 80% !important;
  }
}
</style>
