<template>
  <transition :name="transitionName">
    <router-view class="app-container"></router-view>
  </transition>
</template>
<script>
import 'vant/packages/vant-css/src/base.css';

const childPages = ['/pppoe', '/dhcp', '/static-ip'];
export default {
  data() {
    return {
      transitionName: 'slide-left'
    };
  },
  mounted() {
    this.$http.checkLogin().then(res => res).catch(() => {
      // 用户未登录
      this.$router.returnUrl = window.location.href;
      this.$router.replace({ path: '/login' });
    });
  },
  watch: {
    $route(to, from) {
      console.log(to.path);

      if (to.path === '/wan-hand') {
        if (childPages.includes(from.path)) {
          this.transitionName = 'slide-right';
        }
      } else {
        this.transitionName = 'slide-left';
      }
      console.log(this.transitionName);
    }
  }

};
</script>

<style lang="scss">
html {
  background: rgb(16, 16, 16);
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
    'Lucida Sans Unicode', Geneva, Verdana, sans-serif;

  -moz-user-select: none;
  -webkit-user-select: none;
}

html,
body,
.container {
  color: rgb(182, 182, 182);
  font-size: 0.14rem;
  -moz-user-select: none;
  -webkit-user-select: none;
  background: rgb(16, 16, 16);
}

.app-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: all 0.8s ease;
  box-sizing: border-box;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translateX(100%);
  transform: translateX(100%);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translateX(-100%);
  transform: translateX(-100%);
}

.van-button {
  border-radius: 1rem;
  background: transparent;
  color: rgb(213, 184, 132);
  border-color: rgb(213, 184, 132);
  width: 2rem;
  height: 0.5rem;
}

.van-field {
  background: transparent;
  border-bottom: 0.5px solid rgb(213, 184, 132);
  padding: 5px 10px 5px 0;

  .van-field__control {
    color: rgb(124, 124, 124);
    background: transparent;
  }
}
.van-checkbox .van-icon-success {
  border: 1px solid rgb(213, 184, 132);
  border-radius: 0.02rem;
  color: #000;
}

.van-checkbox__control:checked + .van-icon-success {
  border-color: rgb(213, 184, 132);
  background-color: rgb(213, 184, 132);
  color: rgb(14, 14, 14);
}

.van-button--disabled {
  color: rgb(85, 75, 58);
  border: 1px solid rgb(85, 75, 58);
}

.van-button:active {
  color: rgb(255, 230, 186);
  border: 1px solid rgb(255, 230, 186);
}

.space {
  height: 0.2rem;
}

.i {
  display: inline-block;
  width: 0.2rem;
  height: 0.16rem;
}
.i.i-open {
  background: url(../static/ic_visible.png);
  background-size: 100%;
}
.i.i-close {
  background: url(../static/ic_invisible.png);
  background-size: 100%;
}
.van-dialog {
  width: 2.6rem;
  height: 1.65rem;
  border-radius: 0.1rem;

  .van-dialog__content {
    padding: 0 !important;
    display: table;
    height: 1.05rem;
    vertical-align: middle;
    width: 100%;
    text-align: center;
    font-size: 0.16rem;
    color: rgb(51, 51, 51);

    .van-dialog__message {
      display: table-cell;
      vertical-align: middle;
      margin: 0 auto;
      padding: 0 0.55rem;
      text-align: center;
    }
  }
  .van-button {
    border-radius: 0 !important;
    color: black !important;
    height: 0.6rem !important;
    line-height: 0.6rem !important;
    box-sizing: border-box;

    &:active {
      border: none;
    }
  }
}
</style>

