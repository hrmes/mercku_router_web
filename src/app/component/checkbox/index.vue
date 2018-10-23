<template>
  <transition name="checkbox">
    <div class="checkbox-container">
      <label @click="check()">
        <div class="box" :class="{'checked':checked,'circle-shape':!rect}"></div>
        <div class="text" v-if="text">{{text}}</div>
      </label>
    </div>

  </transition>

</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    text: {
      type: String
    },
    rect: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      checked: this.value
    };
  },
  methods: {
    check() {
      this.checked = !this.checked;
      this.$emit('input', this.checked);
      this.$emit('change', this.checked);
    }
  },
  watch: {
    value(v) {
      this.checked = v;
    }
  }
};
</script>
<style lang="scss">
.checkbox-container {
  text-align: left;
  border-radius: 3px;
  height: 0.18rem;
  display: block;
  label {
    cursor: pointer;
  }
  .box {
    float: left;
    width: 0.16rem;
    height: 0.16rem;
    border: 1px solid rgb(51, 51, 51);
    border-radius: 2px;
    &.circle-shape {
      border-radius: 50%;
    }
    &.checked {
      background: url(../../assets/images/in_chioce@3x.png) no-repeat center;
      border: none;
      background-size: 100%;
      border-radius: none;
      height: 0.18rem;
      width: 0.18rem;
    }
  }
  .text {
    display: inline;
    font-size: 0.13rem;
    color: rgb(51, 51, 51);
    margin-left: 0.05rem;
  }
}
</style>
