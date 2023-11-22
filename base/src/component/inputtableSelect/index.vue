<template>
  <div class="select-container">
    <label for="">{{label}}</label>
    <div class="select"
         ref="select"
         v-clickoutside="close">
      <input ref="input"
             class="select-text"
             v-model="selectedText"
             @input="input"
             @focus="focus"
             :placeholder="placeholder" />
      <div ref="clear"
           class="select-text__clear"
           @click="clearInput">
      </div>
      <div class="icon-container"
           @click="handleIconClick">
        <span class="icon"
              :class="{'open':opened,'close':!opened}"></span>
      </div>
      <transition name="select">
        <ul class="select-popup reset-ul"
            v-show="this.opened">
          <template v-if="options.length>0">
            <li :key="option.mac"
                :class="{'selected':selectedObj[identifier] === option[identifier]}"
                @click.stop="select(option)"
                v-for="option in options">
              <div class="main-title">{{option.name}}</div>
              <div class="sub">
                <span>{{$t('trans0188')}}: {{formatMac(option.mac)}}</span>
                <span>{{$t('trans0151')}}: {{option.ip}}</span>
              </div>
            </li>
          </template>
          <template v-else>
            <li class="select-popup__item--empty">
              <p>{{$t('trans0278')}}</p>
            </li>
          </template>

        </ul>
      </transition>
    </div>

  </div>
</template>

<script>
import scrollTo from '../utils/scroll-to';
import { formatMac } from '../../util/util';

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
    },
    identifier: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formatMac,
      selectedText: this.value,
      selectedObj: null,
      opened: false
    };
  },
  watch: {
    value(val) {
      this.selectedText = val;
      if (this.selectedText) {
        this.$refs.clear.classList.add('show');
      } else {
        this.$refs.clear.classList.remove('show');
      }
    }
  },
  mounted() {
    this.selectedObj = this.copyObjectStructure(this.options);
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
          scrollTo(
            popupEl,
            0,
            selectEl.offsetTop - popupHeight / 2 + elHeight / 2
          );
        }
      });
    },
    input() {
      this.$emit('input', this.selectedText);
    },
    select(option) {
      this.selectedObj = option;
      this.selectedText = option.name;
      this.$emit('input', this.selectedText);
      this.$emit('autofill', option);
      this.opened = false;
    },
    close() {
      this.opened = false;
      this.$refs.select.classList.remove('focus');
      this.$refs.clear.classList.remove('show');
    },
    blur() {
      if (this.opened) return;
      this.onBlur && this.onBlur();
      this.$refs.select.classList.remove('focus');
    },
    focus() {
      this.opened = false;
      this.$refs.select.classList.add('focus');
      this.$parent.$emit('focus');
      if (this.selectedText) {
        this.$refs.clear.classList.add('show');
      }
    },
    handleIconClick() {
      this.$refs.clear.classList.remove('show');
      if (this.opened) {
        this.opened = false;
        this.$refs.select.classList.remove('focus');
      } else {
        this.opened = true;
        this.$refs.select.classList.add('focus');
        this.scrollToSelect();
      }
    },
    clearInput() {
      this.selectedText = '';
      this.$emit('input', this.selectedText);
      this.$refs.input.focus();
    },
    copyObjectStructure(obj) {
      if (obj === null || typeof obj !== 'object') {
        return null;
      }
      if (Array.isArray(obj)) {
        return obj.map(item => this.copyObjectStructure(item));
      }
      const newObj = {};
      Object.keys(obj).forEach(key => {
        newObj[key] = this.copyObjectStructure(obj[key]);
      });

      return newObj;
    }
  }
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
      background-color: var(--scrollbar_wrap_track-color);
      // border-radius: 100px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: var(--scrollbar_wrap_thumb-color);
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
    border: 1.5px solid var(--input_border-color);
    font-size: 14px;
    padding: 10px;
    line-height: 26px;
    position: relative;
    padding-right: 75px;
    transition: border 0.3s ease-in-out;
    .select-text {
      height: 100%;
      width: 100%;
      border: none;
      outline: none;
      color: var(--text_default-color);
      background: transparent;
    }
    &.focus {
      border-color: var(--input_focus_border-color);
      .icon-container {
        border-color: var(--input_focus_border-color);
      }
    }
  }
  label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
    font-weight: bold;
    color: var(--input_label-color);
  }
  .select-popup {
    position: absolute;
    z-index: 888;
    left: -1px;
    right: -1px;
    top: 52px;
    max-height: 300px;
    background: var(--select_popup-bgc);
    border-radius: 7px;
    box-shadow: 0 10px 15px 0 rgba(0, 0, 0, 0.12);
    border: 1px solid var(--select_popup_border-color);
    overflow: auto;
    li {
      display: flex;
      flex-direction: column;
      list-style: none;
      padding: 17px 10px;
      line-height: 1;
      cursor: pointer;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      &:active {
        background: var(--select_item_active-bgc);
        color: var(--select_item_active-color);
      }
      &:hover {
        background: var(--select-item-hover-bgc);
        color: var(--select_item_hover-color);
      }
      &.selected {
        position: relative;
        color: var(--select_item_selected-color);
        &::after {
          content: '\e65c';
          font-family: 'iconfont';
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
        }
      }
      &.select-popup__item--empty {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80px;
        &:hover {
          background: var(--select_popup-bgc);
          cursor: default;
        }
      }
    }
    .main-title {
      font-weight: 600;
    }
    .sub {
      display: flex;
      flex-direction: column;
      margin-top: 8px;
      font-size: 12px;
      color: var(--text_gery-color);
      > span {
        &:first-child {
          margin-bottom: 5px;
        }
      }
    }
  }
  .icon-container {
    position: absolute;
    right: 0;
    top: 0;
    text-align: center;
    height: 45px;
    width: 40px;
    transition: border 0.3s ease-in-out;
    border-left: 1.5px solid var(--input_border-color);
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
  .select-text__clear {
    display: none;
    position: absolute;
    top: 50%;
    right: 50px;
    transform: translate(0, -50%);
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: #999;
    &.show {
      display: block;
    }
    &:hover {
      opacity: 0.8;
    }
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 2px;
      height: 10px;
      background: #fff;
      border-radius: 50px;
    }
    &::before {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
    &::after {
      transform: translate(-50%, -50%) rotate(45deg);
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
