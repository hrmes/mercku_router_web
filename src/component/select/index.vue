<template>
  <div class="select-container">
    <label for="">{{label}}</label>
    <div class="select"
         @click.stop="open()">
      <input class="select-text"
             :value="selected.text"
             readonly
             :title="selected.text">
      <div class="icon-container">
        <span class="icon"
              :class="{'open':opened,'close':!opened}"></span>
      </div>
      <transition name="select">
        <ul class="select-popup"
            v-show="this.opened">
          <li :class="{'selected':selected === option}"
              :key="option.value"
              @click.stop="select(option)"
              v-for="option in options"
              :title="option.text">{{option.text}}</li>
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
      selected: this.options.filter(o => o.value === this.value)[0] || {},
      opened: false
    };
  },
  watch: {
    value(val) {
      [this.selected] = this.options.filter(o => o.value === val);
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
  width: 350px;
  .select {
    height: 36px;
    width: 100%;
    border-radius: 4px;
    outline: 0;
    border: 1px solid #e1e1e1;
    font-size: 14px;
    padding: 0 10px;
    position: relative;
    padding-right: 50px;
    .select-text {
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 100%;
      width: 100%;
      line-height: 34px;
      word-wrap: break-word;
      word-break: break-all;
      outline: none;
      border: none;
      padding: 0;
      cursor: pointer;
    }
  }
  label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
  }

  cursor: pointer;
  .select-popup {
    width: 100%;
    position: absolute;
    z-index: 999;
    left: 0;
    top: 36px;
    background: #fff;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    max-height: 200px;
    border: 1px solid #e1e1e1;
    overflow: auto;
    li {
      list-style: none;
      padding: 10px;
      line-height: 1;
      cursor: pointer;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;

      &:active {
        background: #e7e7e7;
        color: #333;
      }
      &:hover {
        background: #e7e7e7;
        color: #333;
      }
      &.selected {
        color: #d6001c;
      }
    }
  }
  .icon-container {
    position: absolute;
    right: 0;
    top: 0;
    text-align: center;
    height: 36px;
    width: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon {
      width: 12px;
      height: 6px;
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
@media screen and (max-width: 768px) {
  .select-container {
    display: block;
    width: 100%;
    margin: 0 auto;
  }
}
</style>
