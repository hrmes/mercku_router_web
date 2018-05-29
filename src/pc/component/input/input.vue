<template>
  <div class="input-container">
    <input class="input" :type="inputType" :class="{'has-icon':isPwdInput}" />
    <div class="icon-container" v-if="isPwdInput" @click="changePwdStatus()">
      <span class="icon" :class="{'show':!showPwd,'hide':showPwd}"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'text'
    }
  },
  data() {
    return {
      showPwd: false
    };
  },
  methods: {
    changePwdStatus() {
      this.showPwd = !this.showPwd;
    }
  },
  computed: {
    inputType() {
      if (this.type === 'password') {
        if (this.showPwd) {
          return 'text';
        }
        return 'password';
      }
      return 'text';
    },
    isPwdInput() {
      return this.type === 'password';
    }
  }
};
</script>
<style lang="scss" scoped>
.input-container {
  position: relative;
  .input {
    height: 48px;
    width: 100%;
    border-radius: 4px;
    outline: 0;
    border: 1px solid #e1e1e1;
    font-size: 14px;
    &.has-icon {
      padding-right: 30px;
    }
  }
  .icon-container {
    position: absolute;
    right: 0;
    top: 0;
    text-align: center;
    height: 48px;
    width: 50px;
    cursor: pointer;

    .icon {
      width: 20px;
      height: 20px;
      margin-top: 14px;
      display: inline-block;
      &.show {
        background: url(../../assets/images/ic_visible.png) no-repeat center;
      }
      &.hide {
        background: url(../../assets/images/ic_invisible.png) no-repeat center;
      }
    }
  }
}

@media screen and (min-width: 480px) {
  .input-container {
    width: 350px;
    display: inline-block;
  }
}

@media screen and (max-width: 479px) {
  .input-container {
    display: block;
    width: 80%;
    margin: 0 auto;
  }
}
</style>
