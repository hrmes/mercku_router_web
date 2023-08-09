<template>
  <div class="select-container">
    <label for="">{{label}}</label>
    <div class="select"
         ref="select"
         v-clickoutside="close"
         @click.stop="focus">
      <input @blur="blur"
             @focus="focus"
             ref="input"
             class="select-text"
             :title="selected"
             v-model="selected"
             @input="input"
             :placeholder="placeholder" />
      <div class="icon-container">
        <span class="icon"
              :class="{'open':opened,'close':!opened}"></span>
      </div>
      <transition name="select">
        <ul class="select-popup reset-ul"
            v-show="this.opened">
          <li :key="option"
              :class="{'selected':selected === option}"
              @click.stop="select(option)"
              v-for="option in options"
              :title="option">{{option}}</li>
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
    value: '',
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selected: this.value,
      opened: false
    };
  },
  watch: {
    value(val) {
      this.selected = val;
    }
  },
  methods: {
    scrollToSelect() {
      this.$nextTick(() => {
        const popupEl = this.$el.querySelector('.select-popup');
        const selectEl = popupEl.querySelector('li.selected');
        if (selectEl) {
          const popupHeight = popupEl.clientHeight;
          const elHeight = selectEl.clientHeight;
          // 滚动到正中间的位置
          scrollTo(popupEl, 0, selectEl.offsetTop - popupHeight / 2 + elHeight / 2);
        }
      });
    },
    input() {
      this.$emit('input', this.selected);
    },
    select(option) {
      this.selected = option;
      this.$emit('input', this.selected);
      this.close();
    },
    close() {
      this.opened = false;
      this.onBlur && this.onBlur();
      this.$refs.select.classList.remove('focus');
      this.$parent.$emit('blur');
    },
    blur() {
      if (this.opened) return;
      this.onBlur && this.onBlur();
      this.$refs.select.classList.remove('focus');
      this.$parent.$emit('blur');
    },
    focus() {
      this.$refs.select.classList.add('focus');
      this.opened = true;
      this.scrollToSelect();
      this.$parent.$emit('focus');
    }
  },
};
</script>
<style lang="scss" scoped>
.select-container {
  width: 340px;
  cursor: pointer;
  @media screen and (min-width: 768px) {
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background-color: var(--scrollbar_wrap-track-color);
      // border-radius: 100px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: var(--scrollbar_wrap-thumb-color);
      border-radius: 100px;
      &:hover {
        opacity: 0.5;
      }
    }
  }
  &.small {
    .select {
      width: 100%;
      height: 36px;
      padding: 2px 10px;
      padding-right: 50px;
      .icon-container {
        height: 100%;
        width: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        .icon {
          margin: 0;
        }
      }
      .select-popup {
        top: 36px;
        li {
          padding: 6px 10px;
        }
      }
    }
  }
  .select {
    height: 48px;
    width: 100%;
    border-radius: 10px;
    outline: 0;
    border: 1.5px solid var(--input-border-color);
    font-size: 14px;
    padding: 10px;
    line-height: 26px;
    position: relative;
    padding-right: 50px;
    transition: border 0.3s ease-in-out;
    .select-text {
      height: 100%;
      width: 100%;
      border: none;
      outline: none;
      color: var(--text-default-color);
      background: transparent;
    }
    &.focus {
      border-color: var(--input-focus-border-color);
    }
  }
  label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
    font-weight: bold;
    color: var(--input-label-color);
  }
  .select-popup {
    position: absolute;
    z-index: 888;
    left: -1px;
    right: -1px;
    top: 52px;
    max-height: 300px;
    background: var(--select-popup-background-color);
    border-radius: 7px;
    box-shadow: 0 10px 15px 0 rgba(0, 0, 0, 0.12);
    border: 1px solid var(--select-popup-border-color);
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
        background: var(--select-item-active-background-color);
        color: var(--select-item-active-color);
      }
      &:hover {
        background: var(--select-item-hover-background-color);
        color: var(--select-item-hover-color);
      }
      &.selected {
        position: relative;
        color: var(--select-item-selected-color);
        &::after {
          content: '\e65c';
          font-family: 'iconfont';
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
        }
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
      width: 12px;
      height: 6px;
      margin-top: 21px;
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
    .select-popup {
      top: 52px;
    }
  }
}
</style>
