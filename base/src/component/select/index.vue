<template>
  <div class="select-container"
       :class="{'disabled':disabled,'focus':opened}"
       v-clickoutside="close">
    <label for="">{{label}}</label>
    <div class="select"
         @click="open()">
      <input class="select-text"
             :value="selected.text"
             readonly
             :disabled="disabled"
             :title="selected.text" />
      <div class="icon-container">
        <span class="icon"
              :class="{ 'open': opened, 'close': !opened }"></span>
      </div>
      <transition name="fade">
        <ul class="select-popup reset-ul"
            :class="{'popup-top':popupTop}"
            v-show="opened">
          <template v-if="options.length">
            <li class="select-popup__item"
                :class="{ 'selected': selected === option }"
                :key="option.value"
                @click.stop="select(option)"
                v-for="option in options"
                :title="option.text">
              <div v-if="needProcessing">
                <div class="main-title">{{option.mainTitle}}</div>
                <div class="sub-title">{{option.subTitle}}</div>
              </div>
              <div v-else>
                {{ option.text }}
              </div>
            </li>
          </template>
          <li class="select-popup__item--empty"
              v-else>{{$t('trans0278')}}</li>
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
    },
    disabled: {
      type: Boolean,
      default: false
    },
    needProcessing: {
      type: Boolean,
      default: false
    },
    popupTop: {
      type: Boolean,
      default: false
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
    },
  },
  methods: {
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
          scrollTo(popupEl, 0, selectEl.offsetTop - popupHeight / 2 + elHeight / 2);
        }
      });
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
      if (!this.disabled) {
        this.opened = !this.opened;
        if (this.opened) {
          this.scrollToSelect();
        }
      }
    },
    close() {
      this.opened = false;
    },
  }
};
</script>
<style lang="scss" scoped>
.select-container {
  max-width: 340px;
  cursor: pointer;
  .select {
    height: 48px;
    width: 100%;
    border-radius: 10px;
    outline: 0;
    border: 1.5px solid var(--input-border-color);
    font-size: 14px;
    padding: 0 10px;
    position: relative;
    padding-right: 50px;
    transition: all 0.3s ease-in-out;
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
      color: var(--text-default-color);
      background: transparent;
      cursor: pointer;
      &::-webkit-input-placeholder {
        color: var(--input-placeholder-color);
      }
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
    &.popup-top {
      top: -5px;
      transform: translateY(-100%);
    }
    .select-popup__item {
      list-style: none;
      padding: 17px 10px;
      line-height: 1.2;
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
        .main-title,
        .sub-title {
          color: var(--select-item-selected-color);
        }
        &::after {
          content: '\e65c';
          font-family: 'iconfont';
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
        }
      }
      .main-title {
        color: var(--text-default-color);
        font-weight: 600;
      }
      .sub-title {
        color: var(--dashboard-gery-color);
        font-size: 12px;
        margin-top: 5px;
      }
    }
    .select-popup__item--empty {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 84px;
      font-size: 14px;
      color: var(--text-default-color);
      cursor: default;
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
      filter: var(--img-brightness);
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
  &.disabled {
    .select {
      border: 1.5px solid transparent;
      background: var(--input-disabled-background-color);
      opacity: var(--input-disabled-opacity);
      cursor: not-allowed;
      input {
        background: transparent;
        cursor: not-allowed;
      }
      .icon-container {
        cursor: not-allowed;
      }
    }
  }
  &.focus {
    .select {
      border-color: var(--input-focus-border-color);
    }
  }
}
@media screen and (max-width: 768px) {
  .select-container {
    display: block;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    .select {
      height: 48px;
    }
    .icon-container {
      height: 48px;
    }
    .select-popup {
      top: 52px;
      max-height: 200px;
    }
  }
}
</style>
