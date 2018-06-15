<template>
  <div class="select-container" @click.stop="open()">
    <label for="">{{label}}</label>
    <div class="select">
      <div class="">{{selected.text}}</div>
      <div class="icon-container">
        <span class="icon" :class="{'open':opened,'close':!opened}"></span>
      </div>
      <transition name="select">
        <ul class="select-popup" v-show="this.opened">
          <li :key="option.value" @click.stop="select(option)" v-for="option in options">{{option.text}}</li>
        </ul>
      </transition>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    value: {},
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selected: this.options.filter(o => o.value === this.value)[0],
      opened: false
    };
  },
  watch: {
    value(val) {
      this.selected = this.options.filter(o => o.value === val)[0];
    }
  },
  mounted() {
    if (window.addEventListener) {
      document.body.addEventListener('click', this.close);
    } else if (window.attachEvent) {
      document.body.attachEvent('click', this.close);
    }
  },
  methods: {
    addEvent() {},
    select(option) {
      this.selected = option;
      this.opened = false;
      this.$emit('input', this.selected.value);
    },
    open() {
      this.opened = !this.opened;
    },
    close() {
      this.opened = false;
    }
  },
  beforeDestroy() {
    if (window.addEventListener) {
      document.body.removeEventListener('click', this.close);
    } else if (window.attachEvent) {
      document.body.detachEvent('click', this.close);
    }
  }
};
</script>
<style lang="scss" scoped>
.select-container {
  .select {
    height: 48px;
    width: 100%;
    border-radius: 4px;
    outline: 0;
    border: 1px solid #e1e1e1;
    font-size: 14px;
    padding: 10px;
    line-height: 26px;
    position: relative;
    padding-right: 50px;
  }
  label {
    display: block;
    margin-bottom: 10px;
    font-size: 14px;
  }

  cursor: pointer;
  .select-popup {
    width: 100%;
    position: absolute;
    z-index: 999;
    left: 0;
    top: 48px;
    background: #f1f1f1;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    max-height: 200px;
    border: 1px solid #e1e1e1;
    overflow: hidden;
    li {
      list-style: none;
      padding: 10px;
      cursor: pointer;
      &:active {
        background: #fff;
      }
      &:hover {
        background: #fff;
      }
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
      background: url(../../assets/images/ic_input_box_pull_down.png) no-repeat
        center;
      background-size: 100%;
      transition: transform 0.2s linear;
      &.open {
        transform: rotate(180deg);
      }
      &.close {
        transform: rotate(0);
      }
    }
  }
}
</style>
