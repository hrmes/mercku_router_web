<template>
  <header class="header customized"
          :class="{
            'is-position-nav':isLoginPage||isWlanPage,
            'is-not-position-nav':!isLoginPage && !isWlanPage,
            'open':mobileNavVisible,
            'i18n-open':mobileI18nVisible
          }">
    <div class="logo-wrap"
         :class="currentTheme">
      <a v-if="website && isLoginPage"
         class="offical"
         target="_blank"
         :href="website.url">
        <img src="../../assets/images/icon/ic_web_home.png"
             alt="">
        <span>{{website.text}}</span>
      </a>
      <div v-else
           @click.stop="forward2Page('/dashboard')"
           class="logo-wrap__logo"
           :class="{'is-wlan-page':isWlanPage}"></div>
    </div>

    <template v-if="isMobile">
      <div class="nav-wrap nav-wrap--mobile"
           v-show="mobileNavVisible">
        <ul class="nav reset-ul">
          <li class="nav-item"
              :class="{'selected':menu.selected}"
              :key="menu.key"
              v-for="menu in list"
              @click="showMobileMenu(menu)">
            <div class="nav-item-content">
              <i class="el-menu-item__icon iconfont"
                 :class="menu.selected? menu.selectedIcon : menu.icon"></i>
              <div class="nav-item__text">{{$t(menu.text)}}</div>
              <span v-if="menu.children.length"
                    class="mobile-trangle"></span>
              <i v-if="!menu.children.length"
                 class="is-checked"></i>
            </div>
            <transition name="nav-item-child__animation"
                        v-on:before-enter="beforeEnter"
                        v-on:enter="enter"
                        v-on:leave="leave">
              <ul v-if="menu.children.length"
                  class="nav-item-child reset-ul"
                  v-show="menu.selected">
                <li class="nav-child__text"
                    :key="child.key"
                    @click.stop="jumpMobile(child)"
                    v-for="child in menu.children"
                    :class="{'selected':$route.name.includes(child.name),'disabled':child.disabled}">
                  {{$t(child.text)}}
                  <i v-if="$route.name.includes(child.name)"
                     class="is-checked"></i>
                </li>
              </ul>
            </transition>
          </li>
          <li v-if="!isWirelessBridge"
              class="nav-item nav-item__exit add-node">
            <div class="nav-item-content"
                 @click.stop="forward2Page('/mesh/add')">
              <button class="btn">
                <span class="add-icon"></span>
                {{$t('trans0194')}}
              </button>
            </div>
          </li>
          <li class="nav-item nav-item__exit">
            <div class="nav-item-content"
                 @click="exit()">
              <div class="nav-item__text">{{$t('trans0021')}}</div>
            </div>

          </li>
        </ul>
      </div>
      <div class="right-wrap">
        <div class="small-device">
          <span @click="setMobileLangVisible()"
                class="menu-icon language"
                :class="[$i18n.locale]">
            <i class="iconfont a-ic_languages_moblie"></i>
          </span>
          <ul class="i18n-mobile reset-ul"
              v-show="mobileI18nVisible">
            <li :key="lang.value"
                v-for="lang in Languages"
                :class="{'selected':$i18n.locale === lang.value}"
                @click="selectMobileLang(lang)">
              {{lang.text}}
              <i v-if="$i18n.locale === lang.value"
                 class="is-checked"></i>
            </li>
          </ul>

          <span v-if="navVisible"
                @click="trigerMobileNav()"
                class="menu-icon menu">
            <i class="iconfont ic_more_moblie"></i>
          </span>
        </div>
      </div>
    </template>
    <div class="nav-wrap nav-wrap--laptop"
         v-else>
      <ul class="nav reset-ul"
          v-if="navVisible">
        <li class="nav-item"
            :key="menu.key"
            v-for="menu in list"
            :class="{'selected':menu.selected}">
          <div class="nav-item-content"
               @click.stop="jump(menu)"
               :data-title="$t(menu.text)">
            <i class="el-menu-item__icon iconfont"
               :class="menu.selected? menu.selectedIcon : menu.icon"></i>
          </div>
        </li>
        <li class="nav-item nav-item__add-node">
          <div class="nav-item-content"
               :data-title="$t('trans0194')">
            <button class="btn btn-small"
                    :class="{'disabled':isWirelessBridge}"
                    @click.stop="jumpAddNode">
              <span class="add-icon"></span>
            </button>
          </div>
        </li>
      </ul>
    </div>

    <!-- theme change modal -->
    <m-modal class="theme-change-modal"
             :type="isMobile?'confirm':'info'"
             :visible.sync='ThemechangeVisiable'>
      <m-modal-header>
        <div class="theme-change-header">
          <span>{{$t('trans1119')}}</span>
          <div class="theme-change-header__close-btn"
               @click.stop="() => (ThemechangeVisiable = false)">
            <i class="iconfont ic_close"></i>
          </div>
        </div>
      </m-modal-header>
      <m-modal-body>
        <div class="theme-change-body">
          <div class="theme-option"
               @click="clickHandler('light')">
            <m-checkbox v-if="isMobile"
                        class="checkbox static"
                        :rect="false"
                        v-model="themeOptions.light.ischecked"></m-checkbox>
            <img :src="require('base/assets/images/common/img_theme_light.png')" />
            <span class="label">{{$t('trans1122')}}</span>
            <m-checkbox v-if="!isMobile"
                        class="checkbox"
                        :rect="false"
                        v-model="themeOptions.light.ischecked"></m-checkbox>
          </div>
          <div class="theme-option"
               @click="clickHandler('dark')">
            <m-checkbox v-if="isMobile"
                        class="checkbox static"
                        :rect="false"
                        v-model="themeOptions.dark.ischecked"></m-checkbox>
            <img :src="require('base/assets/images/common/img_theme_dark.png')" />
            <span class="label">{{$t('trans1123')}}</span>
            <m-checkbox v-if="!isMobile"
                        class="checkbox"
                        :rect="false"
                        v-model="themeOptions.dark.ischecked"></m-checkbox>
          </div>
          <div class="theme-option"
               @click="clickHandler('auto')">
            <m-checkbox v-if="isMobile"
                        class="checkbox static"
                        :rect="false"
                        v-model="themeOptions.auto.ischecked"></m-checkbox>
            <img :src="require('base/assets/images/common/img_theme_auto.png')" />
            <span class="label">{{$t('trans1121')}}</span>
            <m-checkbox v-if="!isMobile"
                        class="checkbox"
                        :rect="false"
                        v-model="themeOptions.auto.ischecked"></m-checkbox>
          </div>
        </div>
      </m-modal-body>
      <m-modal-footer class="theme-change-footer">
        <button class="btn btn-dialog-confirm"
                @click="changeThemeMode">{{$t('trans0081')}}</button>
      </m-modal-footer>
    </m-modal>
  </header>
</template>
<script>
import Velocity from 'velocity-animate';
import languageMixin from 'base/mixins/language';
import { RouterMode } from 'base/util/constant';

export default {
  mixins: [languageMixin],
  props: {
    navVisible: {
      type: Boolean,
      default: true
    },
    isLoginPage: {
      type: Boolean,
      default: false
    },
    isWlanPage: {
      type: Boolean,
      default: false
    },
    navs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      mobileI18nVisible: false,
      showPopup: false,
      // Languages: Languages.filter(l => l.show),
      list: [],
      mobileNavVisible: false,
      ThemechangeVisiable: false,
      themeOptions: {
        light: { ischecked: false },
        dark: { ischecked: false },
        auto: { ischecked: true }
      },
      selectedTheme: 'light',
      isDarkMode: false
    };
  },
  mounted() {
    this.$i18n.locale = this.language.value;
    if (window.addEventListener) {
      document.body.addEventListener('click', this.close);
    } else if (window.attachEvent) {
      document.body.attachEvent('click', this.close);
    }
    this.list = this.getList();
    this.checkTheme();
  },
  computed: {
    language() {
      return this.getDefaultLanguage();
    },
    website() {
      return process.env.CUSTOMER_CONFIG.website;
    },
    needMoveToRight() {
      return (
        this.$route.path.includes('wlan') ||
        this.$route.path.includes('unconnect')
      );
    },
    isMobile() {
      return this.$store.state.isMobile;
    },
    currentTheme() {
      return this.$store.state.theme;
    },
    isWirelessBridge() {
      return RouterMode.wirelessBridge === this.$store.state.mode;
    }
  },
  watch: {
    $route() {
      this.list = this.getList();
    },
    menus() {
      this.list = this.getList();
    },
    currentTheme: {
      handler(nv) {
        if (nv === 'dark') {
          this.isDarkMode = true;
        } else {
          this.isDarkMode = false;
        }
      },
      immediate: true
    }
  },
  methods: {
    forward2Page(target) {
      if (this.navVisible) {
        this.$router.push({ path: target });
      }
      if (this.mobileI18nVisible) {
        this.mobileI18nVisible = false;
      }
      if (this.mobileNavVisible) {
        this.mobileNavVisible = false;
      }
    },
    beforeEnter(el) {
      el.style.height = 0;
    },
    enter(el, done) {
      setTimeout(() => {
        const height = el.childElementCount * 60;
        Velocity(el, { height: `${height}px` }, { complete: done });
      });
    },
    leave(el, done) {
      setTimeout(() => {
        Velocity(el, { height: 0 }, { complete: done });
      });
    },
    showMobileMenu(menu) {
      // 如果点击的是修改主题，则仅展示切换主题的modal，但不进行选中状态的变化
      if (menu.key === this.list.length - 1) {
        this.jumpMobile(menu);
        return;
      }
      // 让菜单所有的选中状态变为false
      this.list.forEach(l => {
        if (l !== menu) {
          l.selected = false;
        }
      });
      // 如果点击的菜单没有子菜单，就直接进行页面跳转，同时不反转选中状态
      if (!menu.children.length) {
        this.jumpMobile(menu);
        menu.selected = true;
        return;
      }
      menu.selected = !menu.selected;
    },
    jump(menu) {
      // 如果点击的是header的最后一项，则为修改主题，不进行页面跳转，弹出修改主题modal
      if (menu.key === this.list.length - 1) {
        const current = localStorage.getItem('theme');
        Object.keys(this.themeOptions).forEach(key => {
          this.themeOptions[key].ischecked = false;
        });
        this.themeOptions[current].ischecked = true;
        this.ThemechangeVisiable = true;
      } else {
        this.$router.push({ path: menu.url });
      }
    },
    jumpMobile(menu) {
      if (menu.key === this.list.length - 1) {
        const current = localStorage.getItem('theme');
        Object.keys(this.themeOptions).forEach(key => {
          this.themeOptions[key].ischecked = false;
        });
        this.themeOptions[current].ischecked = true;
        this.ThemechangeVisiable = true;
      } else if (!menu.disabled) {
        this.$router.push({ path: menu.url });
        this.mobileNavVisible = !this.mobileNavVisible;
      }
    },
    trigerMobileNav() {
      this.mobileNavVisible = !this.mobileNavVisible;
      this.mobileI18nVisible = false;
    },
    getList() {
      const list = this.navs.map((m, index) => {
        m.key = index;
        if (m.children.length) {
          let selected = false;
          const children = m.children.map((mm, ii) => {
            mm.index = ii;
            if (this.$route.path.includes(mm.url)) {
              selected = true;
            }
            return { ...mm, children };
          });
          return { ...m, selected, showChild: false };
        }
        const selected = this.$route.path.includes(m.url);
        return { ...m, selected, showChild: false };
      });
      return list;
    },
    close() {
      this.showPopup = false;
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
    clickHandler(mode) {
      this.selectedTheme = mode;
      Object.keys(this.themeOptions).forEach(key => {
        if (key === mode) {
          this.themeOptions[key].ischecked = true;
        } else {
          this.themeOptions[key].ischecked = false;
        }
      });
    },
    checkTheme() {
      const theme = localStorage.getItem('theme');
      if (!theme || theme === undefined) {
        localStorage.setItem('theme', 'light');
        this.$store.state.theme = 'light';
        this.themeOptions.light.ischecked = true;
      } else {
        this.$store.state.theme = theme;
        Object.keys(this.themeOptions).forEach(key => {
          this.themeOptions[key].ischecked = false;
        });
        this.themeOptions[theme].ischecked = true;
      }
      console.log('11', localStorage.getItem('theme'));
      document
        .querySelector('html')
        .setAttribute('class', localStorage.getItem('theme'));
    },
    changeThemeMode() {
      localStorage.setItem('theme', this.selectedTheme);
      this.$store.state.theme = this.selectedTheme;
      document
        .querySelector('html')
        .setAttribute('class', this.selectedTheme);
      console.log('22', this.selectedTheme);

      this.ThemechangeVisiable = false;
      if (this.mobileNavVisible) {
        this.mobileNavVisible = false;
      }
    },
    jumpAddNode() {
      if (this.isWirelessBridge) return;
      this.$router.push('/mesh/add');
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
.theme-change-modal {
  .theme-change-header {
    position: relative;
    .theme-change-header__close-btn {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--button_close-bgc);
      cursor: pointer;
      .iconfont {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
        &::before {
          transform: scale(0.5);
        }
      }
    }
  }
  .theme-change-body {
    display: flex;
    .theme-option {
      position: relative;
      width: 120px;
      height: 194px;
      aspect-ratio: 60/97;
      margin: 0 10px;
      border-radius: 10px;
      cursor: pointer;
      text-align: center;
      outline: 3px solid transparent;
      transition: outline 0.3s ease-out;
      &:hover {
        outline-color: var(--primary-color);
      }
      > img {
        width: 100%;
      }
      .label {
        color: var(--text-defult-color);
      }
      .checkbox {
        position: absolute;
        top: 7px;
        right: 7px;
      }
    }
  }
  .btn-dialog-confirm {
    width: 240px;
  }
}
.header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 65px;
  padding: 0 30px;
  color: var(--text_default-color);
  .logo-wrap {
    width: 185px;
    height: 30px;
    .offical {
      color: var(--header_official-color);
      text-decoration: none;
      display: flex;
      align-items: center;
      font-size: 14px;
      line-height: 1;
      &:hover {
        text-decoration: underline;
        color: var(--header_official_hover-color);
      }
      img {
        width: 12px;
        margin-right: 5px;
      }
    }
    .logo-wrap__logo {
      width: 100%;
      height: 100%;
      cursor: pointer;
      &.is-wlan-page {
        cursor: default;
      }
    }
  }
  .nav-wrap {
    height: 100%;
    .nav {
      display: flex;
      height: 100%;
      .nav-item {
        position: relative;
        height: 100%;
        list-style: none;
        display: flex;
        align-items: center;
        cursor: pointer;
        margin-right: 40px;
        .nav-item-content {
          display: flex;
          position: relative;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: background 0.3s linear;
          &:hover {
            background: var(--header_nav_hover-bgc);
          }
          .iconfont {
            font-size: 24px;
            color: var(--header_nav_iconfont-color);
          }
          .nav-item__text {
            height: 100%;
            display: flex;
            align-items: center;
            margin-left: 20px;
            color: #fff;
          }
        }
        .nav-item-child {
          display: none;
          width: 280px;
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 6px;
          box-shadow: var(--select_popup-shadow);
          background-color: var(--header_popup-bgc);
          &.show {
            display: block;
          }
        }
        @media screen and (max-width: 1440px) {
          margin-right: 30px;
        }
        &.nav-item__add-node {
          .nav-item-content {
            width: 60px;
            .btn-small {
              width: 60px;
              height: 32px;
              min-width: auto;
              padding: 0;
            }
            &:hover {
              background: transparent;
            }
          }
        }
        &.selected {
          position: relative;
          .nav-item-content {
            &:hover {
              background: none;
            }
          }
          .iconfont {
            background-image: var(--header_selected-bgc);
            -webkit-background-clip: text; /* Safari/Chrome */
            background-clip: text;
            color: transparent;
            text-shadow: 0 3px 8px rgba(242, 46, 73, 0.3);
          }
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  &.is-position-nav {
    position: absolute;
    top: 20px;
    left: 0;
    height: fit-content;
    background: transparent;
    padding: 0 30px;
    z-index: 999;
    .logo-wrap {
      img {
        filter: var(--img-brightness);
      }
    }
  }
  .add-icon {
    position: relative;
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 5px;
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      display: block;
      height: 2.5px;
      border-radius: 2px;
      width: 15px;
      background-color: #fff;
      transform: translate(-50%, -50%) rotate(0deg);
    }
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      display: block;
      height: 2.5px;
      border-radius: 2px;
      width: 15px;
      background-color: #fff;
      transform: translate(-50%, -50%) rotate(90deg);
    }
  }
}
@media screen and (max-width: 768px) {
  .theme-change-modal {
    .theme-change-body {
      flex-direction: column;
      .theme-option {
        flex: 1;
        width: 100%;
        aspect-ratio: unset;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        margin-left: 20px;
        img {
          width: 50px;
          height: 80px;
          margin-left: 10px;
          margin-right: 20px;
        }
        .checkbox {
          &.static {
            width: fit-content;
            top: 50%;
            left: -10px;
            transform: translate(-50%, -50%);
          }
        }
        &:last-child {
          margin-bottom: 0;
        }
        &:hover {
          outline-color: transparent;
        }
      }
    }
    .theme-change-footer {
      padding-top: 20px;
    }
  }
  .header {
    z-index: 999;
    position: fixed;
    left: 0;
    top: 0;
    padding: 0 20px;
    .logo-wrap {
      display: block;
      position: absolute;
      width: 60px;
      height: 20px;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      padding: 0;
    }
    .nav-wrap {
      position: fixed;
      top: 65px;
      left: 0;
      width: 100%;
      height: calc(100% - 65px);
      background: var(--header-bgc);
      color: var(--header-color);
      .nav {
        flex-direction: column;
        height: auto;
        .nav-item {
          width: 100%;
          margin: 0;
          height: auto;
          flex-direction: column;
          align-items: center;
          .nav-item-content {
            justify-content: flex-start;
            align-items: center;
            position: relative;
            width: 85%;
            &:hover {
              background: transparent;
            }
            .nav-item__text {
              color: var(--header_mobile_navitem-color);
              line-height: 1;
              padding: 0;
              font-size: 16px;
              font-weight: 600;
            }
            .mobile-trangle {
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 0;
              height: 0;
              border-left: 6px solid var(--text_default-color);
              border-right: 0px solid transparent;
              border-top: 5px solid transparent;
              border-bottom: 5px solid transparent;
              transform-origin: top top;
              transition: all 0.3s;
              font-size: 10px;
            }
            .is-checked {
              display: none;
              position: absolute;
              top: 50%;
              right: -6px;
              transform: translateY(-50%);
            }
          }
          .nav-item-child {
            position: static;
            display: block;
            background: var(--mobile_header_popup-bgc);
            box-shadow: none;
            width: 100%;
            &.nav-item-child__animation-leave-active {
              overflow: hidden;
            }
            &.nav-item-child__animation-enter-active {
              overflow: hidden;
            }
            .nav-child__text {
              display: flex;
              justify-content: space-between;
              align-items: center;
              list-style: none;
              height: 60px;
              padding: 0 23px 0 74px;
              color: var(--text_default-color);
              background: var(--header_popup-bgc);
              cursor: not-allowed;
              &.disabled {
                color: var(--header_popup_item_disabled-color);
                &:active,
                &:hover {
                  color: var(--header_popup_item_disabled-color);
                  background: var(--header_popup-bgc);
                }
              }
              &.selected {
                color: var(--mobile_menu_selected-color);
              }
            }
          }
          &.nav-item__exit {
            display: block;
            max-width: 340px;
            margin: 0 auto 30px;
            .nav-item-content {
              height: 48px;
              justify-content: center;
              background-color: var(--logout_btn-bgc) !important;
              box-shadow: var(--logout_btn-boxshadow);
              border-radius: 22px;
              margin: 0 auto;
              > .nav-item__text {
                margin: 0;
              }
            }
          }
          &.add-node {
            margin: 30px auto;
            .btn {
              font-weight: 500;
            }
          }
          &.selected {
            .iconfont {
              background-image: var(--header_selected-bgc);
              -webkit-background-clip: text; /* Safari/Chrome */
              background-clip: text;
              color: transparent;
              text-shadow: 0 3px 8px rgba(242, 46, 73, 0.3);
            }
            .nav-item-content {
              .nav-item__text {
                color: var(--mobile_menu_selected-color);
              }
              & .is-checked {
                display: inline-flex;
              }
              & .mobile-trangle {
                transform: translateY(-50%) rotate(90deg);
              }
            }
          }
        }
      }
      &.nav-wrap--mobile {
        display: block;
        overflow: auto;
      }
    }
    .right-wrap {
      .small-device {
        display: block;
        position: absolute;
        right: 20px;
        top: 20px;
        .i18n-mobile {
          position: fixed;
          top: 65px;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--header-bgc);
          color: var(--text_default-color);
          padding: 0 30px;
          z-index: 999;
          font-size: 16px;
          li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0;
            list-style: none;
            font-weight: 600;
            &.selected {
              color: var(--mobile_menu_selected-color);
              .is-checked {
                &::after {
                  border-color: var(--mobile_menu_selected-color);
                }
              }
            }
            &:first-child {
              border: 0;
            }
          }
        }
        .menu-icon {
          display: inline-block;
          width: 20px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          .iconfont {
            font-size: 20px;
          }
          &.menu {
            margin-left: 35px;
          }
        }
      }
    }
    &.is-position-nav {
      top: 0;
      height: 65px;
    }
    &.is-not-position-nav {
      background-color: var(--header-bgc);
    }
    &.open,
    &.i18n-open {
      border-radius: 0;
    }
  }
}
</style>
