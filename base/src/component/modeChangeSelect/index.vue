<template>
  <div class="select-container"
       :class="{'disabled':disabled,'focus':opened}"
       v-clickoutside="close">
    <label>
      {{label}}
      <svg class="refresh-icon"
           :class="{'clickable':isClickable}"
           @click="refreshUpperlist"
           width="20"
           height="20"
           viewBox="0 0 20 20"
           xmlns="http://www.w3.org/2000/svg">
        <path :d="RefreshSVGPath"
              :fill="svgColor"
              fill-rule="nonzero" />
      </svg>
    </label>
    <div class="select">
      <input class="select-text"
             :value="selected.text"
             readonly
             :placeholder="placeholder"
             :title="selected.text"
             @click="open()" />
      <div class="icon-container"
           @click="open()">
        <span class="icon"
              :class="{ 'open': opened, 'close': !opened }"></span>
      </div>
    </div>
    <transition name="select">
      <ul class="select-popup reset-ul"
          :class="{'popup-top':popupTop}"
          v-show="opened">
        <template v-if="loading===LoadingStatus.success && options.length">
          <li class="select-popup__item"
              :class="{ 'selected': selected === option }"
              v-for="(option,index) in options"
              :key="index"
              @click.stop="select(option)"
              :title="option.text">
            <div class="text__container"> {{ option.text }}
            </div>
            <div class="icon__container">
              <span class="band">
                {{option.band}}
              </span>
              <span class="encrypt"
                    v-if="option.security!==EncryptMethod.OPEN && option.security!==EncryptMethod.open"></span>
              <span class="rssi"
                    :class="[option.rssi>GoodRssiValue?RssiStatus.good:RssiStatus.normal]"></span>
            </div>
          </li>
        </template>
        <template v-else>
          <li v-if="loading===LoadingStatus.empty"
              class="select-popup__item--empty">{{$t('trans0278')}}</li>
          <li v-else-if="loading===LoadingStatus.loading"
              class="select-popup__item--loading">
            <m-lottieLoading class="loading"
                             :size="60"></m-lottieLoading>
            {{loadingText}}
          </li>
          <li v-else
              class="select-popup__item--failed"
              @click="rescanApclient">{{loadingText}}</li>
        </template>
      </ul>
    </transition>
  </div>
</template>

<script>
import scrollTo from '../utils/scroll-to';
import { EncryptMethod, RefreshSVGPath } from '../../util/constant';

const RssiStatus = {
  good: 'good',
  normal: 'normal'
};
const LoadingStatus = {
  empty: 0,
  loading: 1,
  failed: 2,
  success: 3,
  default: 4
};
const GoodRssiValue = -66;

export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    bssid: {},
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
      RssiStatus,
      GoodRssiValue,
      LoadingStatus,
      selected: this.getOptionByBssid(this.bssid),
      opened: false
    };
  },
  watch: {
    bssid(val) {
      console.log(val);
      this.selected = this.getOptionByBssid(val);
    }
  },
  computed: {
    isClickable() {
      return this.loading !== LoadingStatus.loading;
    },
    svgColor() {
      return this.isClickable ? '#d6001c' : '#CCC';
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
      this.$emit('input', this.selected.text);
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
        this.opened = true;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.select-container {
  position: relative;
  max-width: 340px;
  .select {
    height: 48px;
    width: 100%;
    border-radius: 4px;
    outline: 0;
    border: 1.5px solid var(--select-input-border-color);
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
    color: var(--select-label-color);
    .refresh-icon {
      position: absolute;
      top: 0;
      right: 5px;
      width: 20px;
      height: 20px;
      cursor: not-allowed;
      &.clickable {
        cursor: pointer;
      }
    }
  }
  .select-popup {
    position: absolute;
    z-index: 888;
    left: -1px;
    right: -1px;
    top: 78px;
    max-height: 300px;
    background: var(--select-popup-background-color);
    border-radius: 5px;
    border: 1px solid var(--select-popup-border-color);
    overflow: auto;
    &.popup-top {
      top: -5px;
      transform: translateY(-100%);
    }
    // @media screen and (max-height: 830px) {
    //   position: static !important;
    //   margin-top: 3px;
    // }
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
      color: var(--text-default-color);
      background: var(--select-popup-background-color);
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
        ::before {
          content: '';
          width: 12px;
          height: 12px;
          background: url(../../assets/images/icon/ic_selected.svg) center
            no-repeat;
          background-size: cover;
          position: absolute;
          top: 52%;
          left: 3px;
          transform: translate(0, -50%);
        }
      }
      .text__container {
        max-width: 200px;
        height: 20px;
        line-height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .icon__container {
        // width: 79px;
        display: flex;
        justify-content: space-between;
        .rssi {
          width: 14px;
          height: 14px;
          &.bad {
            background: url(../../assets/images/icon/ic_wifi_bad.png) no-repeat
              center;
            background-size: 100%;
          }
          &.normal {
            background: url(../../assets/images/icon/ic_wifi_normal.png)
              no-repeat center;
            background-size: 100%;
          }
          &.good {
            background: url(../../assets/images/icon/ic_wifi_good.png) no-repeat
              center;
            background-size: 100%;
          }
        }
        .encrypt {
          width: 10px;
          height: 14px;
          margin-right: 10px;
          background: url(../../assets/images/icon/ic_wifi_lock.svg) no-repeat
            center;
          background-size: 100%;
          filter: var(--img-brightness);
        }
        .band {
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          font-size: 11px;
          font-weight: 500;
          color: var(--text-default-color);
          width: 35px;
          height: 15px;
          margin-right: 10px;
          border-radius: 2px;
          background: var(--common-sub_card-bgc);
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
  &.focus {
    .select {
      border-color: var(--input-focus-border-color);
    }
  }
  &.disabled {
    .select {
      background: var(--select-disabled-background-color);
      opacity: var(--select-disabled-opacity);
      cursor: not-allowed;
      input {
        background: var(--select-disabled-background-color);
        opacity: var(--select-disabled-opacity);
        cursor: not-allowed;
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
      .select-popup__item {
        padding: 17px 10px 17px 20px;
      }
      // .select-popup__item--loading {
      //   height: 150px;
      // }
    }
  }
}
</style>
