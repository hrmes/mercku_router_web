<template>
  <div class="footer"
       :class="{
        'is-position-nav':isLoginPage||isWlanPage,
        'is-not-position-nav':!isLoginPage && !isWlanPage,}">
    <div class="footer__left"
         v-if="!isMobile">
      <div class="footer__left-menu logout"
           v-if="navVisible"
           @click="exit()">
        <span class="icon"></span>
        {{$t('trans0021')}}
      </div>
      <div class="footer__left-menu lang"
           @mouseenter="setLangPopupVisible(true)"
           @mouseleave="setLangPopupVisible(false)">
        <span class="icon"></span>
        <div class="lang-selector"
             :class="{'open':showPopup}">
          <div class="current">
            <span class="current-text">{{language.text}}</span>
          </div>
          <transition name="popup">
            <ul class="popup reset-ul"
                v-show="showPopup">
              <li :key="lang.value"
                  v-for="lang in Languages"
                  :class="{'selected':$i18n.locale === lang.value}"
                  @click="selectLang(lang)">
                {{lang.text}}
                <i v-if="$i18n.locale === lang.value"
                   class="is-checked"></i>
              </li>
            </ul>
          </transition>
        </div>
      </div>
    </div>
    <div class="footer__right">
      <div class="footer__right__policy-container">
        <span class="copy">{{ copyright }}</span>
        <span class="policy-text"
              @click.stop="showPolicy()">
          {{$t('trans0139')}}
        </span>
        <img class="power-by"
             v-if="isShowPowerBy"
             :src="require('base/assets/images/common/img-power-by.png')" />
      </div>

      <div class="footer__right__QR-container"
           v-if="!isLoginPage && !isMobile">
        <img src="../../assets/images/icon/ic_qr_small.png" />
        <div class="jump-app-info">
          <div class="icon mercku">
            <img :src="require('base/assets/images/customer/mercku/ic_launcher.png')" />
          </div>
          <div class="text-container">{{$t('trans1118')}}</div>
          <div class="icon qr">
            <img :src="require('base/assets/images/customer/mercku/qr.png')" />
          </div>
        </div>
      </div>
    </div>

    <m-modal :visible.sync="policyVisiable">
      <m-modal-header>
        <div class="dialog-title">{{ $t('trans0139') }}</div>
      </m-modal-header>
      <m-modal-body>
        <div class="dialog-content">
          <div style="height:100%;padding:20px 0;font-size:0;"
               v-html="policy"></div>
        </div>
      </m-modal-body>
      <m-modal-footer>
        <div class="button-container">
          <button class="btn btn-dialog-confirm"
                  @click="closePolicyDialog()">
            {{ $t('trans0024') }}
          </button>
        </div>
      </m-modal-footer>
    </m-modal>
  </div>
</template>
<script>
import languageMixin from 'base/mixins/language';

const MerckuCustomerId = '0001';
export default {
  mixins: [languageMixin],
  props: {
    navVisible: {
      type: Boolean,
      default: false
    },
    isLoginPage: {
      type: Boolean,
      default: false
    },
    isWlanPage: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return { policyVisiable: false };
  },
  methods: {
    showPolicy() {
      if (process.env.CUSTOMER_CONFIG.policy) {
        window.open(process.env.CUSTOMER_CONFIG.policy);
      } else {
        this.policyVisiable = true;
      }
    },
    closePolicyDialog() {
      this.policyVisiable = false;
    },
    exit() {
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0323'),
        callback: {
          ok: () => {
            this.$http.loginout().then(() => {
              this.mobileNavVisible = false;
              this.$router.replace({ path: '/login' });
            });
          }
        }
      });
    },
  },
  computed: {
    policy() {
      return require('./policy-en.html');
    },
    copyright() {
      const copyright = this.$t('trans0276');
      const now = new Date();
      /*
        兼容以前的翻译中的固定年份写法
        如果没有%d，则不产生替换，也是正确的
        缺点是本地时间不准，这里得到的年份也是错的
      */
      return copyright
        .replace('%d', now.getFullYear())
        .replace('%s', process.env.CUSTOMER_CONFIG.title);
    },
    isMobile() {
      return this.$store.state.isMobile;
    },
    isShowPowerBy() {
      return process.env.CUSTOMER_CONFIG.id !== MerckuCustomerId;
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog-content {
  width: 600px;
  max-height: 400px;
  overflow: auto;
  padding-right: 10px;
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background-color: var(--scrollbar_wrap_track-color);
    // border-radius: 100px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar_wrap_thumb-color);
    border-radius: 100px;
    &:hover {
      opacity: 0.5;
    }
  }
}
.footer {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 5;
  width: 100%;
  color: var(--common_gery-color);
  padding: 0 30px;
  &.is-position-nav {
    position: absolute;
    bottom: 20px;
    left: 0;
    background: transparent;
  }
  &.is-not-position-nav {
    height: 60px;
    align-items: center;
  }
  .footer__right,
  .footer__left {
    display: flex;
    align-items: center;
  }
  .footer__left-menu {
    display: flex;
    align-items: center;
    color: var(--footer_menu_text-color);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    > span {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-right: 3px;
    }
    &.lang {
      .lang-selector {
        height: 100%;
        cursor: pointer;
        position: relative;
        &.open {
          &::before {
            content: '';
            display: block;
            position: absolute;
            top: -10px;
            left: -20px;
            height: 10px;
            width: calc(100% + 20px);
            background: transparent;
          }
        }
        .current {
          height: 100%;
          display: flex;
          align-items: center;
        }
        .popup {
          position: absolute;
          top: -10px;
          left: -20px;
          transform: translateY(-100%);
          width: 150px;
          margin-bottom: 30px;
          border-radius: 2px;
          box-shadow: 4px -2px 15px 5px var(--footer_popup_shadow-color);
          background-color: var(--select_popup-bgc);
          padding: 10px 0;
          opacity: 1;
          border-radius: 10px;
          &.popup-enter-active {
            transition: opacity 0.2s ease-in;
          }
          &.popup-enter {
            opacity: 0;
          }
          &.popup-leave-active {
            transition: opacity 0.2s ease-out;
            opacity: 0;
          }
          li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            list-style: none;
            line-height: 38px;
            padding: 0 30px;
            &:hover {
              background: var(--select_item_hover-bgc);
              color: var(--select_item_hover-color);
            }
            &:last-child {
              margin-bottom: 0;
            }
            &.selected {
              color: var(--select_item_selected-color);
              .is-checked {
                &::after {
                  border-color: var(--select_item_selected-color);
                }
              }
            }
          }
        }
      }
      > span {
        background: url(../../assets/images/icon/ic_lang.png) center no-repeat;
        background-size: contain;
      }
      &:hover {
        .current-text {
          color: var(--header_navitem_hover-color);
        }
      }
    }
    &.logout {
      position: relative;
      margin-right: 15px;
      > span {
        background: url(../../assets/images/icon/ic_logout.png) center no-repeat;
        background-size: contain;
      }
      &:hover {
        color: var(--header_navitem_hover-color);
      }
    }
  }
  .footer__right__policy-container {
    font-size: 12px;
    > span {
      user-select: none;
    }
    .policy-text {
      text-decoration: underline;
      margin-left: 5px;
      cursor: pointer;
      &:hover {
        color: var(--text_default-color);
      }
    }
    .power-by {
      width: 150px;
      height: 15px;
      vertical-align: sub;
      margin-left: 10px;
    }
  }
  .footer__right__QR-container {
    position: relative;
    margin-left: 20px;
    cursor: pointer;
    > img {
      width: 22px;
      height: 22px;
    }
    .jump-app-info {
      display: none;
      position: absolute;
      top: -10px;
      right: -10px;
      transform: translateY(-100%);
      justify-content: space-between;
      align-items: center;
      align-self: flex-end;
      margin-top: calc(7%);
      margin-right: calc(2%);
      width: 210px;
      padding: 10px 10px 10px 20px;
      border-radius: 10px;
      background: var(--dashboard_app-bgc);
      box-shadow: -6px -5px 10px 0 var(--footer-popup-shadow-color);
      .text-container {
        color: var(--text_default-color);
        width: 95px;
        // height: 40px;
      }
      .icon {
        width: 70px;
        height: 70px;
        img {
          width: 100%;
          height: 100%;
        }
        &.mercku {
          display: none;
        }
        &.qr {
          display: block;
        }
      }
      &::after {
        content: '';
        position: absolute;
        bottom: 1px;
        right: 14px;
        transform: translateY(100%);
        width: 0px;
        height: 0px;
        border: 7px solid transparent;
        border-top: 7px solid var(--dashboard_app-bgc);
        z-index: inherit;
      }
    }
    &:hover {
      > img {
        filter: var(--fotter_qr_img-filter);
      }
      .jump-app-info {
        display: flex;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .dialog-content {
    width: 100%;
  }
  .footer {
    &.is-position-nav,
    &.is-not-position-nav {
      padding: 10px;
      justify-content: center;
      height: 60px;
      position: static;
    }
    .footer__right__policy-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      .copy,
      .policy-text {
        margin-left: 0;
        text-align: center;
      }
      .power-by {
        margin-left: 5px;
      }
    }
  }
}
@media screen and (max-width: 320px) {
  .dialog-content {
    width: 100%;
  }
  .footer {
    &.is-position-nav,
    &.is-not-position-nav {
      padding: 10px 0;
      justify-content: center;
      height: fit-content;
      position: static;
      .copy {
        text-align: center;
      }
    }
  }
}
</style>
