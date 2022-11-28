<template>
  <header class="header-container customized"
          :class="{
            'is-login-nav':isLoginPage,
            'is-not-login-nav':!isLoginPage,
            'open':mobileNavVisible,
            'i18n-open':mobileI18nVisible
          }">
    <div class="logo-wrap">
      <div v-if="logoVisible"
           @click="forward2dashboard"
           class="logo-wrap__logo"></div>
      <a v-if="website && !logoVisible"
         class="offical"
         target="_blank"
         :href="website.url">
        <img src="../../assets/images/icon/ic_web_home.png"
             alt="">
        <span>{{website.text}}</span>
      </a>
    </div>

    <div class="nav-wrap nav-wrap--laptop">
      <ul class="nav reset-ul"
          v-if="navVisible">
        <li class="nav-item"
            :key="menu.key"
            v-for="menu in list"
            :class="{'selected':menu.selected}">
          <div class="nav-item-content"
               @click.stop="jump(menu)">
            <i class="el-menu-item__icon iconfont"
               :class="menu.icon"
               :title="$t(`${menu.text}`)"></i>
          </div>

          <!-- <ul v-if="menu.children"
              class="nav-item-child reset-ul"
              :class="{'show':menu.showChild}">
            <li class="nav-child__text"
                :key="child.key"
                @click.stop="jump(child,menu)"
                v-for="child in menu.children"
                :class="{'selected':$route.name === child.name,'disabled':child.disabled}">
              {{$t(child.text)}}
              <i v-if="$route.name === child.name"
                 class="is-checked"></i>
            </li>
          </ul> -->
        </li>
        <li class="nav-item nav-item__exit"
            @click="exit()">
          <div class="nav-item-content">
            <div class="nav-item__text">{{$t('trans0021')}}</div>
          </div>
        </li>
      </ul>
    </div>

    <div class="nav-wrap nav-wrap--mobile"
         v-show="mobileNavVisible">
      <ul class="nav reset-ul">
        <li class="nav-item"
            :key="menu.key"
            v-for="menu in list"
            :class="{'selected':menu.selected}">
          <div class="nav-item-content"
               @click="showMobileMenu(menu)">
            <i class="el-menu-item__icon iconfont"
               :class="menu.icon"></i>
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
                  @click.stop="jumpMobile(child,menu)"
                  v-for="child in menu.children"
                  :class="{'selected':$route.name.includes(child.name),'disabled':child.disabled}">
                {{$t(child.text)}}
                <i v-if="$route.name.includes(child.name)"
                   class="is-checked"></i>
              </li>
            </ul>
          </transition>
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
      <div class="lang-selector"
           :class="{'open':showPopup}"
           @mouseenter="setLangPopupVisible(true)"
           @mouseleave="setLangPopupVisible(false)">
        <div class="current">
          <span class="current-text">{{language.text}}</span>
          <span class="drop-trangle"
                :class="{'right':!showPopup,'down':showPopup}"></span>
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
      <div class="small-device">
        <span @click="setMobleLangVisible()"
              class="menu-icon language"
              :class="[$i18n.locale]"></span>
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
              class="menu-icon menu"></span>
      </div>
      <div v-show="navVisible"
           class="exit"
           @click="exit()">
        {{$t('trans0021')}}
      </div>
    </div>

  </header>
</template>
<script>
import Velocity from 'velocity-animate';

const Languages = [
  {
    text: 'English',
    value: 'en-US',
    show: false
  },
  {
    text: '简体中文',
    value: 'zh-CN',
    show: false
  },
  {
    text: 'Deutsch',
    value: 'de-DE',
    show: false
  },
  {
    text: 'Nederlands',
    value: 'nl-NL',
    show: false
  },
  {
    text: 'Srpski',
    value: 'sr-RS',
    show: false
  },
  {
    text: 'Norsk bokmål',
    value: 'nb-NO',
    show: false
  },
  {
    text: 'Français',
    value: 'fr-FR',
    show: false
  },
  {
    text: 'Español',
    value: 'es-ES',
    show: false
  }
];
const supportLanguage = process.env.CUSTOMER_CONFIG.languages;
if (!supportLanguage) {
  // 早期没有在customer config中定义language，兼容处理
  Languages.forEach(l => {
    l.show = true;
  });
} else {
  supportLanguage.forEach(sl => {
    const language = Languages.filter(l => l.value === sl)[0];
    if (language) {
      language.show = true;
    }
  });
}

export default {
  props: {
    navVisible: {
      type: Boolean,
      default: true
    },
    isLoginPage: {
      type: Boolean,
      default: false
    },
    navs: {
      type: Array,
      default: () => []
    },
    logoVisible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      mobileI18nVisible: false,
      showPopup: false,
      Languages: Languages.filter(l => l.show),
      current: null,
      list: [],
      mobileNavVisible: false
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
  },
  computed: {
    language() {
      return this.getDefaultLanguage();
    },
    website() {
      return process.env.CUSTOMER_CONFIG.website;
    }
  },
  watch: {
    $route() {
      this.list = this.getList();
    },
    menus() {
      this.list = this.getList();
    }
  },
  methods: {
    forward2dashboard() {
      if (this.navVisible) {
        this.$router.push({ path: '/dashboard' });
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
      if (!menu.children.length) {
        this.jumpMobile(menu);
      }
      this.list.forEach(l => {
        if (l !== menu) {
          l.selected = false;
        }
      });
      menu.selected = !menu.selected;
    },
    jumpMobile(child) {
      if (!child.disabled) {
        this.$router.push({ path: child.url });
        // this.current = child;
        this.mobileNavVisible = !this.mobileNavVisible;
      }
    },
    trigerMobileNav() {
      this.mobileNavVisible = !this.mobileNavVisible;
      this.mobileI18nVisible = false;
    },
    // setChildMenuVisible(menu, visible) {
    //   menu.showChild = visible;
    // },
    jump(menu) {
      this.$router.push({ path: menu.url });
      // this.current = menu;
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
    getDefaultLanguage() {
      const language = this.Languages.filter(l => l.value === this.$i18n.locale)[0];
      if (!language) {
        return this.Languages[0];
      }
      return language;
    },

    setLangPopupVisible(visible) {
      this.showPopup = visible;
    },
    setMobleLangVisible() {
      this.mobileI18nVisible = !this.mobileI18nVisible;
      this.mobileNavVisible = false;
      // if (this.mobileI18nVisible) {
      //   this.$el.parentNode.style.paddingTop = '65px';
      // } else {
      //   this.$el.parentNode.style.paddingTop = '0';
      // }
    },
    selectLang(lang) {
      this.changeLanguage(lang.value);
      this.showPopup = false;
    },
    selectMobileLang(lang) {
      this.changeLanguage(lang.value);
      this.mobileI18nVisible = false;
    },
    changeLang() {
      const zh = 'zh-CN';
      const en = 'en-US';
      this.changeLanguage(this.$i18n.locale === en ? zh : en);
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
.header-container {
  width: 100%;
  height: 65px;
  align-items: center;
  justify-content: center;
  display: flex;
  background: var(--header-background-color);
  color: var(--text-default-color);
  padding: 0 10%;
  position: relative;
  @media screen and (max-width: 1440px) {
    padding: 0 50px;
  }
  @media screen and (max-width: 768px) {
    padding: 0 20px !important;
  }
  .logo-wrap {
    width: 185px;
    height: 30px;
    .offical {
      color: var(--header-official-color);
      text-decoration: none;
      display: flex;
      align-items: center;
      font-size: 14px;
      line-height: 1;
      &:hover {
        text-decoration: underline;
        color: var(--header-official-hover-color);
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
    }
  }
  .nav-wrap {
    flex: 1;
    height: 100%;

    &.nav-wrap--laptop {
      margin-left: 100px;
      display: block;
    }
    &.nav-wrap--mobile {
      display: none;
    }
    .nav {
      display: flex;
      height: 100%;
      .nav-item {
        height: 100%;
        list-style: none;
        display: flex;
        align-items: center;
        margin-right: 80px;
        .nav-item-content {
          display: flex;
          .iconfont {
            font-size: 24px;
            color: var(--header-nav-iconfont-color);
          }
          .nav-item__text {
            height: 100%;
            display: flex;
            align-items: center;
            margin-left: 20px;
            color: var(--header-popup-item-color);
          }
        }
        .nav-item-child {
          display: none;
          width: 280px;
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 6px;
          box-shadow: -10px 9px 21px 0 var(--header-popup-shadow-color);
          background-color: var(--header-popup-background-color);
          .nav-child__text {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: var(--header-popup-item-color);
            list-style: none;
            padding: 0 23px 0 74px;
            line-height: 38px;
            &:hover {
              color: var(--header-popup-item-hover-color);
              background: var(--header-popup-item-hover-background-color);
            }
            &.disabled {
              color: var(--header-popup-item-disabled-color);
              cursor: not-allowed;
              background: var(--header-popup-item-disabled-background-color);
              &:active,
              &:hover {
                color: var(--header-popup-item-disabled-hover-color);
              }
            }
            &.selected {
              color: var(--header-popup-item-selected-color);
              .is-checked {
                &::after {
                  border-color: var(--header-popup-item-checked-color);
                }
              }
            }
          }
          &.show {
            display: block;
          }
        }
        @media screen and (max-width: 1440px) {
          margin-right: 50px;
        }
        cursor: pointer;
        position: relative;
        &.selected {
          position: relative;
          .iconfont {
            color: var(--header-nav-iconfont-selected-color);
          }
          &::after {
            content: '';
            display: block;
            height: 2.5px;
            background: var(--header-nav-item-selected-background-color);
            width: 100%;
            bottom: 0;
            left: 0;
            position: absolute;
          }
        }
        &.nav-item__exit {
          display: none;
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .right-wrap {
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    z-index: 999;
    .small-device {
      display: none;
    }
    .lang-selector {
      height: 100%;
      cursor: pointer;
      position: relative;
      &:hover {
        .current {
          .current-text {
            color: var(--header-nav-item-hover-color);
          }
          .drop-trangle {
            &::after {
              border-top-color: var(--header-nav-item-hover-color);
            }
          }
        }
      }
      &.open {
        &::before {
          content: '';
          display: block;
          position: absolute;
          bottom: -6px;
          height: 6px;
          width: 130px;
          left: 0;
          background: transparent;
        }
      }
      .current {
        height: 100%;
        display: flex;
        align-items: center;
        .current-text {
          display: inline-block;
          width: 100px;
          text-align: center;
          height: 21px;
        }
        .drop-trangle {
          display: inline-block;
          width: 10px;
          height: 5px;
          position: relative;
          &:after {
            content: '';
            display: block;
            width: 0;
            height: 0;
            border-top: 5px solid var(--text-default-color);
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
          }
          transition: transform 0.2s linear;
          &.down {
            transform: rotate(0);
          }
          &.right {
            transform: rotate(-90deg);
          }
        }
      }

      .popup {
        position: absolute;
        width: 160px;
        margin-top: 6px;
        border-radius: 2px;
        box-shadow: 0 10px 15px 0 var(--header-popup-shadow-color);
        background-color: var(--header-popup-background-color);
        padding: 25px 0;
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
            background: var(--header-popup-item-hover-background-color);
            color: var(--header-popup-item-hover-color);
          }
          &:last-child {
            margin-bottom: 0;
          }
          &.selected {
            color: var(--header-popup-item-selected-color);
            .is-checked {
              &::after {
                border-color: var(--header-popup-item-checked-color);
              }
            }
          }
        }
      }
    }
    .exit {
      display: inline-block;
      cursor: pointer;
      margin-left: 50px;
      &:hover {
        color: var(--header-nav-item-hover-color);
      }
    }
  }
  &.is-not-login-nav {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  }
  &.is-login-nav {
    height: 80px;
    background: transparent;
    color: var(--header-nav-hide-color);
    padding: 0 50px;
    .logo-wrap {
      height: 14px;
      img {
        filter: var(--img-brightness);
      }
    }
    .right-wrap {
      height: 35px;
      .lang-selector {
        background-color: var(--grey-background-color);
        width: 115px;
        border-radius: 20px;
        .current {
          .current-text {
            width: 88px;
          }
        }
        .drop-trangle {
          &:hover {
            .current {
              .current-text {
                color: var(--header-nav-item-hover-color);
              }
              .drop-trangle {
                &::after {
                  border-top-color: var(--header-nav-item-hover-color);
                }
              }
            }
          }
          &.right {
            &::after {
              border-top-color: var(--header-nav-hide-trangle-color);
            }
          }
        }
        .popup {
          box-shadow: 0 2px 8px 0 var(--header-nav-hide-popup-shadow-color);
          background-color: var(--header-nav-hide-popup-background-color);
          margin-top: 0;
          right: 0;
          top: 40px;
          li {
            list-style: none;
            line-height: 38px;
            padding: 0 30px;
            &:hover {
              background: var(
                --header-nav-hide-popup-item-hover-background-color
              );
              color: var(--text-default-color);
            }
            &:last-child {
              margin-bottom: 0;
            }
            &.selected {
              color: var(--header-nav-hide-popup-item-selected-color);
              .is-checked {
                &::after {
                  border-color: var(--header-nav-hide-popup-item-checked-color);
                }
              }
            }
          }
        }
      }
      .small-device {
        .i18n-mobile {
          background: var(--header-nav-hide-i18n-mobile-background-color);
          color: var(--header-nav-hide-i18n-mobile-color);
          border-color: var(--header-nav-hide-i18n-mobile-border-color);
          li {
            border-color: var(--header-nav-hide-i18n-mobile-item-border-color);
            &.selected {
              color: var(--header-nav-hide-popup-item-selected-color);
              .is-checked {
                &::after {
                  border-color: var(--header-nav-hide-popup-item-checked-color);
                }
              }
            }
          }
        }
        .menu-icon {
          &.language {
            background: url(../../assets/images/icon/ic_languages_black.png)
              no-repeat center;
            background-size: 100%;
            filter: var(--img-brightness);
          }
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .header-container {
    height: 65px;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 999;
    &.open,
    &.i18n-open {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
    }
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
      background: var(--header-background-color);
      color: var(--header-color);
      &.nav-wrap--laptop {
        display: none;
      }
      &.nav-wrap--mobile {
        display: block;
        overflow: auto;
        border-top: 1px solid var(--header-dividing-color);
      }
      .nav {
        flex-direction: column;
        height: auto;
        .nav-item {
          width: 100%;
          margin: 0;
          height: auto;
          flex-direction: column;
          align-items: center;
          &.nav-item__exit {
            display: block;
          }
          &.nav-item__exit {
            .nav-item-content {
              justify-content: center;
              background: var(--logout-btn-bgc);
              border-radius: 5px;
              margin: 30px auto;
              > .nav-item__text {
                margin: 0;
              }
              &::after {
                display: none;
              }
            }
          }
          .nav-item-content {
            align-items: center;
            position: relative;
            width: 85%;
            .nav-item__text {
              color: var(--header-mobile-nav-item-color);
              line-height: 1;
              padding: 16px 0;
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
              border-left: 6px solid var(--text-default-color);
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
          &.selected {
            &::after {
              display: none;
            }
            .nav-item-content {
              & .mobile-trangle {
                transform: translateY(-50%) rotate(90deg);
              }
              .nav-item__text {
                color: var(--header-mobile-nav-item-color);
              }
              & .is-checked {
                display: inline-flex;
              }
            }
          }
          .nav-item-child {
            position: static;
            display: block;
            background: var(--mobile-header-popup-background-color);
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
              height: 60px;
              justify-content: space-between;
              align-items: center;
              color: var(--text-default-color);
              &.disabled {
                background: var(--header-popup-item-disabled-background-color);
              }
            }
          }
        }
      }
    }
    .right-wrap {
      .lang-selector {
        display: none;
      }
      .exit {
        display: none;
      }
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
          background: var(--header-background-color);
          color: var(--text-default-color);
          border-top: 1px solid var(--header-dividing-color);
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
              color: var(--header-nav-item-selected-background-color);
              .is-checked {
                &::after {
                  border-color: var(--header-popup-item-checked-color);
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
          filter: var(--img-brightness);
          &.language {
            background: url(../../assets/images/icon/ic_languages_white.png)
              no-repeat center;
            background-size: 100%;
            width: 20px;
            height: 20px;
          }
          &.menu {
            margin-left: 35px;
            background: url(../../assets/images/icon/ic_top_bar_pull_down.png)
              no-repeat center;
            background-size: 100%;
            width: 19px;
            height: 19px;
          }
        }
      }
    }
    &.is-login-nav {
      height: 65px;
    }
    &.is-not-login-nav {
      border-radius: 0;
    }
  }
}
</style>
