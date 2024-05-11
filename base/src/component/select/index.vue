<template>
  <div class="select-container"
       :class="{'disabled':disabled,'focus':opened}"
       v-clickoutside="close">
    <label for="">{{label}}</label>
    <div class="select"
         @click="open()">
      <input v-if="filterable && opened"
             class="select-text filterable"
             v-model="filterText"
             :placeholder="selected.text||$t('trans0321')"
             :disabled="disabled"
             :title="selected.text" />
      <input v-else
             class="select-text"
             :value="selected.text"
             :disabled="disabled"
             readonly
             :title="selected.text" />
      <div class="icon-container">
        <span class="icon"
              :class="{ 'open': opened, 'close': !opened }"></span>
      </div>
      <!-- 过渡样式默认为淡入淡出 -->
      <!-- 如果是上下抽屉样式时，过渡效果切换为上下移动淡入淡出 -->
      <transition :name="isDrawerStyle && isMobile? 'slide-up' : 'fade'">
        <ul key="popup-list"
            class="select-popup reset-ul"
            :class="{'popup-top':popupTop,'drawer':isDrawerStyle}"
            v-show="opened">
          <div v-if="isDrawerStyle"
               class="drawer-header"
               @click.stop="">
            <span class="btn-icon close"
                  v-if="isMobile"
                  @click.stop="()=>opened=false">
              <i class="iconfont  ic_close"></i>
            </span>
          </div>
          <template v-if="filteredOptions.length">
            <li class="select-popup__item"
                :class="{ 'selected': selected === option }"
                :key="option.value"
                @click.stop="select(option)"
                v-for="option in filteredOptions"
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
      <!-- 抽屉样式下拉选项的遮罩 -->
      <transition name="fade">
        <div class="mask"
             v-if="isDrawerStyle && opened"
             key="mask"></div>
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
    // 预处理传入的数据，修改可选项的展示样式
    // 默认传入的option需要展示的就一个内容，如果有多个内容需要展示，需要预处理
    needProcessing: {
      type: Boolean,
      default: false
    },
    // 用以定时下拉框的可选项弹出位置，默认是在下面弹出，true表示在select上方弹出
    popupTop: {
      type: Boolean,
      default: false
    },
    // 用以定义下拉弹出框的样式是否为上下抽屉样式
    // 该样式的目的是用于下拉选项比较多，同时手机端下要尽量多展示可选项的情况
    isDrawerStyle: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      selected: this.getOptionByValue(this.value),
      opened: false,
      filterText: ''
    };
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    },
    filteredOptions() {
      return (this.options.filter(option => String(option.text).toLowerCase()
        .includes(this.filterText.toLowerCase()))) || [];
    }
  },
  watch: {
    value(val) {
      this.selected = this.getOptionByValue(val);
    }
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
          scrollTo(
            popupEl,
            0,
            selectEl.offsetTop - popupHeight / 2 + elHeight / 2
          );
        }
      });
    },
    select(option) {
      this.opened = false;
      this.selected = option;
      this.$emit('input', this.selected.value);
      if (this.value !== this.selected.value) {
        this.change();
      }
      setTimeout(() => {
        this.filterText = ''; // 过渡效果结束后清空 filterText
      }, 320);
    },
    change() {
      this.$emit('change', this.selected.value, this.value);
    },
    open() {
      if (!this.disabled) {
        this.opened = !this.opened;
        if (this.opened) {
          this.scrollToSelect();
        } else {
          setTimeout(() => {
            this.filterText = ''; // 过渡效果结束后清空 filterText
          }, 320);
        }
      }
    },
    close() {
      this.opened = false;
      setTimeout(() => {
        this.filterText = ''; // 过渡效果结束后清空 filterText
      }, 320);
    },
  }
};
</script>
<style lang="scss" scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(100%); /* 初始位置在底部 */
}
.select-container {
  max-width: 340px;
  cursor: pointer;
  .select {
    height: 48px;
    width: 100%;
    border-radius: 10px;
    outline: 0;
    border: 1.5px solid var(--input_border-color);
    font-size: 14px;
    padding: 0 10px;
    position: relative;
    padding-right: 50px;
    transition: all 0.3s ease-in-out;
    background: var(--select-content-background);
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
      color: var(--text_default-color);
      background: transparent;
      cursor: pointer;
      &::-webkit-input-placeholder {
        color: var(--input_placeholder-color);
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
    z-index: 1000;
    left: -1px;
    right: -1px;
    top: 52px;
    max-height: 300px;
    background: var(--select_popup-bgc);
    border-radius: 7px;
    box-shadow: 0 10px 15px 0 rgba(0, 0, 0, 0.12);
    border: 1px solid var(--select_popup_border-color);
    overflow: auto;
    &.popup-top {
      top: -5px;
      transform: translateY(-100%);
    }
    & .select-popup__item {
      list-style: none;
      padding: 17px 10px;
      line-height: 1.2;
      cursor: pointer;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      &:active {
        background: var(--select_item_active-bgc);
        color: var(--select_item_active-color);
      }
      &:hover {
        background: var(--select_item_hover-bgc);
        color: var(--select_item_hover-color);
      }
      &.selected {
        position: relative;
        color: var(--select_item_selected-color);
        .main-title,
        .sub-title {
          color: var(--select_item_selected-color);
        }
        &::after {
          content: '\e6be';
          font-family: 'iconfont';
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
        }
      }
      .main-title {
        color: var(--text_default-color);
        font-weight: 600;
      }
      .sub-title {
        color: var(--dashboard_gery-color);
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
      color: var(--text_default-color);
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
      background: var(--input_disabled-bgc);
      opacity: var(--input_disabled-opacity);
      cursor: not-allowed;
      input {
        background: transparent;
        cursor: not-allowed;
      }
      .icon-container {
        cursor: not-allowed;
      }
      .icon {
        filter: var(--img-disabled-brightness);
      }
    }
  }
  &.focus {
    .select {
      border-color: var(--input_focus_border-color);
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
      &.drawer {
        position: fixed;
        top: 65px;
        max-height: initial;
        height: calc(100% - 65px);
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        .drawer-header {
          position: sticky;
          top: 0;
          left: 0;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          height: 50px;
          padding-right: 10px;
          text-align: right;
          background: var(--select_popup-bgc);
          z-index: 888;
        }
      }
    }
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999;
      background: rgba($color: #000000, $alpha: 0.7);
    }
  }
}
</style>
