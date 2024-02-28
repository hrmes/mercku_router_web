<template>
  <div class="qiyou-select-container"
       :class="{'disabled':disabled,'focus':opened}"
       v-clickoutside="close">
    <label>
      {{label}}
    </label>
    <div class="select">
      <input class="select-text"
             v-model="ssid"
             readonly
             :placeholder="placeholder"
             :title="ssid"
             @click="open()" />
      <div class="icon-container"
           @click="open()">
        <span class="icon"
              :class="{ 'open': opened, 'close': !opened }"></span>
      </div>
    </div>
    <transition name="select">
      <div class="select-popup reset-ul"
           :class="{'popup-top':popupTop}"
           v-show="opened">
        <template v-if="loading===LoadingStatus.success && options.length">
          <div class="select-popup_header">
            <span>{{$t('trans1251')}}</span>
            <svg class="refresh-icon"
                 :class="{'clickable':isClickable}"
                 @click.stop="refreshUpperlist"
                 width="20"
                 height="20"
                 viewBox="0 0 20 20"
                 xmlns="http://www.w3.org/2000/svg">
              <path :d="RefreshSVGPath"
                    :fill="svgColor"
                    fill-rule="nonzero" />
            </svg>
          </div>
          <div class="select-popup_content">
            <div class="select-popup__item"
                 :class="{ 'selected': selected === option }"
                 v-for="(option,index) in options"
                 :key="index"
                 @click.stop="select(option)"
                 :title="option.text">
              <span class="band">
                {{option.band}}
              </span>
              <div class="text__container"> {{ option.text }}
              </div>
              <div class="icon__container">
                <span class="encrypt"
                      v-if="option.security!==EncryptMethod.OPEN && option.security!==EncryptMethod.open"></span>
                <span class="rssi"
                      :class="[getRssiIcon(option.rssi)]"></span>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div v-if="loading===LoadingStatus.empty"
               class="select-popup__item--empty">{{$t('trans0278')}}</div>
          <div v-else-if="loading===LoadingStatus.loading"
               class="select-popup__item--loading">
            <m-lottie-loading class="loading"
                              :size="60"></m-lottie-loading>
            {{loadingText}}
          </div>
          <div v-else
               class="select-popup__item--failed"
               @click="rescanApclient">{{loadingText}}</div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
import scrollTo from 'base/component/utils/scroll-to';
import { EncryptMethod, RefreshSVGPath } from 'base/util/constant';

const SignalStrength = {
  good: 'good',
  normal: 'normal',
  bad: 'bad'
};
const LoadingStatus = {
  empty: 0,
  loading: 1,
  failed: 2,
  success: 3,
  default: 4
};

export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    bssid: {},
    ssid: {},
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
    placeholder: {
      type: String
    },
    popupTop: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Number,
      default: 0
    },
    loadingText: {
      type: String,
      default: 'Loading'
    }
  },
  data() {
    return {
      RefreshSVGPath,
      EncryptMethod,
      LoadingStatus,
      selected: this.getOptionByBssid(this.bssid),
      opened: false
    };
  },
  watch: {
    bssid(val) {
      console.log(val);
      this.selected = this.getOptionByBssid(val);
    },
  },
  computed: {
    isClickable() {
      return this.loading !== LoadingStatus.loading;
    },
    svgColor() {
      return this.isClickable ? '#2a74ef' : '#CCC';
    }
  },
  methods: {
    getOptionByBssid(bssid) {
      const option = this.options.filter(o => o.bssid === bssid)[0] || {
        text: ''
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
    rescanApclient() {
      this.$emit('scanApclient');
    },
    select(option) {
      this.selected = option;
      this.opened = false;
      if (this.bssid !== this.selected.bssid) {
        this.change();
      }
    },
    change() {
      this.$emit('change', this.selected, this.bssid);
    },
    open() {
      if (!this.disabled) {
        this.opened = !this.opened;
        if (this.loading === LoadingStatus.default) {
          this.rescanApclient();
        }
        if (this.opened) {
          this.scrollToSelect();
        }
      }
    },
    close() {
      this.opened = false;
    },
    refreshUpperlist() {
      if (this.isClickable) {
        this.rescanApclient();
      }
    },
    getRssiIcon(rssi) {
      let className = SignalStrength.bad;
      const GoodRssiVal = -60;
      const normalRssiVal = -75;
      if (rssi > GoodRssiVal) {
        className = SignalStrength.good;
      } else if (rssi > normalRssiVal) {
        className = SignalStrength.normal;
      }
      return className;
    }
  }
};
</script>
<style lang="scss" scoped>
.qiyou-select-container {
  position: relative;
  width: 270px;
  $img_folder: '../../../../base/src/assets/images';
  .select {
    height: 48px;
    width: 100%;
    border-radius: 10px;
    outline: 0;
    border: 1.5px solid var(--select_input_border-color);
    font-size: 14px;
    padding: 0 10px;
    position: relative;
    padding-right: 50px;
    cursor: pointer;
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
      user-select: none;
      padding: 0;
      cursor: pointer;
      background: transparent;
    }
  }
  label {
    position: relative;
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
    font-weight: bold;
    height: 20px;
    color: var(--input_label-color);
  }
  .select-popup {
    position: absolute;
    z-index: 888;
    left: -1px;
    right: -1px;
    top: 78px;
    max-height: 365px;
    width: 370px;
    background: var(--select_popup-bgc);
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid var(--select_popup_border-color);
    padding-top: 40px;
    .select-popup_header {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 40px;
      border-bottom: 1.5px solid var(--darker_hr-color);
      font-size: 14px;
      font-weight: 500;
      padding: 0 10px 0 20px;
    }
    .select-popup_content {
      max-height: 325px;
      overflow: auto;
    }
    &.popup-top {
      top: 20px;
      transform: translateY(-100%);
    }
    .select-popup__item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      list-style: none;
      padding: 17px 10px 17px 20px;
      line-height: 1;
      user-select: none;
      cursor: pointer;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--text_default-color);
      background: var(--select_popup-bgc);
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
        &::before {
          content: '\e6be';
          color: var(--primary-color);
          font-size: 12px;
          font-family: 'iconfont';
          width: 12px;
          height: 12px;
          position: absolute;
          top: 50%;
          left: 3px;
          transform: translate(0, -50%);
        }
      }
      .band {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 11px;
        font-weight: 500;
        color: var(--text_default-color);
        width: 35px;
        height: 17px;
        margin-right: 8px;
        border-radius: 2px;
        background: var(--darker_hr-color);
      }
      .text__container {
        flex: 1;
        max-width: 250px;
        height: 20px;
        line-height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: pre;
      }
      .icon__container {
        display: flex;
        justify-content: space-between;
        margin-left: 8px;
        .rssi {
          width: 14px;
          height: 14px;
          &.bad {
            background: url(#{$img_folder}/icon/ic_wifi_bad.png) center/100%
              no-repeat;
          }
          &.normal {
            background: url(#{$img_folder}/icon/ic_wifi_normal.png) center/100%
              no-repeat;
          }
          &.good {
            background: url(#{$img_folder}/icon/ic_wifi_good.png) center/100%
              no-repeat;
          }
        }
        .encrypt {
          width: 10px;
          height: 14px;
          margin-right: 10px;
          background: url(#{$img_folder}/icon/ic_wifi_lock.svg) center/100%
            no-repeat;
          filter: var(--img-brightness);
        }
      }
    }
    .select-popup__item--empty,
    .select-popup__item--failed {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 250px;
      font-size: 14px;
      text-align: center;
      margin-top: -40px;
    }
    .select-popup__item--loading {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 250px;
      font-size: 14px;
      margin-top: -40px;
      > .loading {
        position: static;
        width: 100px;
        height: 100px;
        margin-bottom: 10px;
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
      background: url(#{$img_folder}/icon/ic_input_box_pull_down.png)
        center/100% no-repeat;
      transition: transform 0.2s linear;
      &.open {
        transform: rotate(180deg);
      }
      &.close {
        transform: rotate(0);
      }
    }
  }
  &.focus {
    .select {
      border-color: var(--input_focus_border-color);
    }
  }
  &.disabled {
    .select {
      background: var(--select_disabled-bgc);
      opacity: var(--select_disabled-opacity);
      cursor: not-allowed;
      input {
        background: var(--select_disabled-bgc);
        opacity: var(--select_disabled-opacity);
        cursor: not-allowed;
      }
    }
  }
  .refresh-icon {
    right: 5px;
    width: 20px;
    height: 20px;
    cursor: not-allowed;
    &.clickable {
      cursor: pointer;
    }
  }
}
@media screen and (max-width: 768px) {
  .qiyou-select-container {
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
      width: calc(100% + 90px + 10px);
      max-height: 325px;
      .select-popup_content {
        max-height: 285px;
      }
      .select-popup__item {
        padding: 17px 10px 17px 20px;
      }
    }
  }
}
</style>
