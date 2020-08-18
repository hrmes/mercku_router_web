<template>
  <div class="select-container">
    <label for="">{{ label }}</label>
    <div class="select"
         @click.stop="open()">
      <input class="select-text"
             :value="selected.text"
             readonly
             :title="selected.text"
             @blur="closeSelectPopup" />
      <div class="icon-container">
        <span class="icon"
              :class="{ open: opened, close: !opened }"></span>
      </div>
      <transition name="select">
        <ul class="select-popup"
            v-show="this.opened">
          <li :class="{ selected: selected === option }"
              :key="option.value"
              @click.stop="select(option)"
              v-for="option in options"
              :title="option.text">
            {{ option.text }}
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script>
import scrollTo from '../utils/scroll-to';

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
    },
    height: {
      type: Number
    }
  },
  data() {
    return {
      selected: this.getOptionByValue(this.value),
      opened: false
    };
  },
  watch: {
    value(val) {
      this.selected = this.getOptionByValue(val);
    }
  },
  mounted() {
    this.attachEvent();
  },
  methods: {
    closeSelectPopup() {
      // this.opened = false;
    },
    getOptionByValue(val) {
      const option = this.options.filter(o => o.value === val)[0] || {
        text: val
      };
      return option;
    },
    scrollToSelect() {
      this.$nextTick(() => {
        const popupEl = this.$el.querySelector('.select-popup');
        const selectEl = popupEl.querySelector('li.selected');
        if (selectEl) {
          const popupHeight = popupEl.clientHeight;
          const elHeight = selectEl.clientHeight;
          // 滚动到正中间的位置
          scrollTo(
            popupEl,
            0,
            selectEl.offsetTop - popupHeight / 2 + elHeight / 2
          );
        }
      });
    },
    attachEvent() {
      if (window.addEventListener) {
        document.body.addEventListener('click', this.close);
      } else if (window.attachEvent) {
        document.body.attachEvent('click', this.close);
      }
    },
    detachEvent() {
      if (window.addEventListener) {
        document.body.removeEventListener('click', this.close);
      } else if (window.attachEvent) {
        document.body.detachEvent('click', this.close);
      }
    },
    select(option) {
      this.selected = option;
      this.opened = false;
      this.$emit('input', this.selected.value);
      if (this.value !== this.selected.value) {
        this.change();
      }
    },
    change() {
      this.$emit('change', this.selected.value, this.value);
    },
    open() {
      this.opened = !this.opened;
      if (this.opened) {
        this.scrollToSelect();
      }
    },
    close() {
      this.opened = false;
    }
  },
  beforeDestroy() {
    this.detachEvent();
  }
};
</script>
<style lang="scss" scoped>
.select-container {
  width: 340px;
  .select {
    height: 48px;
    width: 100%;
    border-radius: 4px;
    outline: 0;
    border: 1px solid $select-input-border-color;
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
    font-weight: bold;
    color: $select-label-color;
  }

  cursor: pointer;
  .select-popup {
    position: absolute;
    z-index: 888;
    left: -1px;
    right: -1px;
    top: 52px;
    max-height: 300px;
    background: $select-popup-background-color;
    border-radius: 5px;
    border: 1px solid $select-popup-border-color;
    overflow: auto;
    li {
      list-style: none;
      padding: 17px 10px;
      line-height: 1;
      cursor: pointer;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;

      &:active {
        background: $select-item-active-background-color;
        color: $select-item-active-color;
      }
      &:hover {
        background: $select-item-hover-background-color;
        color: $select-item-hover-color;
      }
      &.selected {
        color: $select-item-selected-color;
      }
    }
  }
  .icon-container {
    position: absolute;
    right: 0;
    top: 0;
    text-align: center;
    height: 46px;
    width: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon {
      width: 12px;
      height: 6px;
      display: inline-block;
      background: url(../../assets/images/icon/ic_input_box_pull_down.png)
        no-repeat center;
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
    .select {
      height: 48px;
    }
    .icon-container {
      height: 48px;
    }
    .select-popup {
      top: 52px;
      li {
        padding: 17px 10px;
      }
    }
  }
}
</style>
