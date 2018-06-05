<template>
  <div class="reboot-model-contanier">
    <div class='shadow'></div>
    <div class='progress-wrapper'>
      <div class="progress">
        <div class="progress-bar progress-bar-info progress-bar-striped active" :style='this.styles'>
          <!-- <div class="progress-value">100%</div> -->
        </div>
      </div>
    </div>
    <div class="note">重启中,请等待...{{during}}s</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      during: 60,
      width: '0%'
    };
  },
  props: ['percent'],
  computed: {
    styles() {
      return {
        width: `${this.width}`
      };
    }
  },
  mounted() {
    const timer = setInterval(() => {
      this.during -= 1;

      if (this.during === 0) {
        clearTimeout(timer);
      }
    }, 1000);
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
    opacity: 0.5;
  }
  .note {
    margin-top: 20px;
    font-size: 18px;
    color: #ffffff;
    font-weight: 100;
  }
}
.progress-wrapper {
  width: 300px;
  z-index: 2001;
  .progress-bar.active {
    animation: reverse progress-bar-stripes 0.4s linear infinite,
      animate-positive 2s;
  }

  .progress .progress-bar {
    border-radius: 20px;
    position: relative;
    animation: animate-positive 2s;
  }

  .progress.active .progress-bar,
  .progress-bar.active {
    -webkit-animation: progress-bar-stripes 2s linear infinite;
    -o-animation: progress-bar-stripes 2s linear infinite;
    animation: progress-bar-stripes 2s linear infinite;
  }

  .progress-bar-info {
    background-color: #00d061;
  }
  .progress-striped .progress-bar,
  .progress-bar-striped {
    background-image: -webkit-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent
    );
    background-image: -o-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent
    );
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent
    );
    -webkit-background-size: 40px 40px;
    background-size: 40px 40px;
  }
  .progress-bar {
    float: left;
    width: 0;
    height: 100%;
    font-size: 12px;
    line-height: 20px;
    color: #fff;
    text-align: center;
    background-color: #00d061;
    -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
    -webkit-transition: width 0.6s ease;
    -o-transition: width 0.6s ease;
    transition: width 0.6s ease;
  }

  @keyframes progress-bar-stripes {
    from {
      background-position: 40px 0;
    }

    to {
      background-position: 0 0;
    }
  }

  @-o-keyframes progress-bar-stripes {
    from {
      background-position: 40px 0;
    }

    to {
      background-position: 0 0;
    }
  }

  .progress .progress-value:after {
    content: '';
    border-top: 10px solid #191919;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    position: absolute;
    bottom: -6px;
    left: 26%;
  }

  :before,
  :after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .progress {
    height: 10px;
    background: #ffffff;
    // padding: 2px;
    overflow: visible;
    border-radius: 20px;
  }

  .progress .progress-bar {
    border-radius: 20px;
    position: relative;
    animation: animate-positive 2s;
  }

  .progress .progress-value {
    display: block;
    padding: 3px 7px;
    font-size: 13px;
    color: #fff;
    border-radius: 4px;
    background: #191919;
    border: 1px solid #000;
    position: absolute;
    top: -40px;
    right: -10px;
  }

  .progress .progress-value:after {
    content: '';
    border-top: 10px solid #191919;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    position: absolute;
    bottom: -6px;
    left: 26%;
  }

  .progress-bar.active {
    animation: reverse progress-bar-stripes 0.4s linear infinite,
      animate-positive 2s;
  }

  @-webkit-keyframes animate-positive {
    0% {
      width: 0;
    }
  }

  @keyframes animate-positive {
    0% {
      width: 0;
    }
  }
}
</style>
