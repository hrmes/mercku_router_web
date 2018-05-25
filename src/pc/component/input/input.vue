<template>
  <div class="input-container">
    <input class="input" :type="inputType" :class="{'has-icon':isPwdInput}" />
    <div class="icon-container" v-if="isPwdInput">
      <button class="icon" @click="changePwdStatus()">
        {{showPwd?'隐藏':'显示'}}
      </button>
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
    &.has-icon {
      padding-right: 30px;
    }
  }
  .icon-container {
    position: absolute;
    right: 0;
    top: 0;
    text-align: center;
    width: 30px;

    .icon {
      height: 48px;
    }
  }
}

@media screen and (min-width: 1024px) {
  .input-container {
    width: 350px;
    display: inline-block;
  }
}

@media screen and (max-width: 1023px) {
  .input-container {
    display: block;
    width: 80%;
    margin: 0 auto;
  }
}
</style>
