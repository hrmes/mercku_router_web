<template>
  <header class="header-container customized"
          :class="{
            'is-login-nav':isLoginPage,
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
            @mouseenter="setChildMenuVisible(menu,true)"
            @mouseleave="setChildMenuVisible(menu,false)"
            v-for="menu in list"
            :class="{'selected':menu.selected,'open':menu.showChild}">
          <div class="nav-item-content">
            <div class="nav-item__text">{{$t(menu.text)}}</div>
          </div>

          <ul v-if="menu.children"
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
          </ul>
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
            @click="showMobileMenu(menu)"
            v-for="menu in list"
            :class="{'selected':menu.selected}">
          <div class="nav-item-content">
            <div class="nav-item__text">{{$t(menu.text)}}</div>
          </div>
          <transition name="nav-item-child__animation"
                      v-on:before-enter="beforeEnter"
                      v-on:enter="enter"
                      v-on:leave="leave">
            <ul v-if="menu.children"
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
        <li class="nav-item nav-item__exit"
            @click="exit()">
          <div class="nav-item-content">
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
                :class="{'down':!showPopup,'up':showPopup}"></span>
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
        const height = el.childElementCount * 38;
        Velocity(el, { height: `${height}px` }, { complete: done });
      });
    },
    leave(el, done) {
      setTimeout(() => {
        Velocity(el, { height: 0 }, { complete: done });
      });
    },
    showMobileMenu(menu) {
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
        this.current = child;
        this.mobileNavVisible = !this.mobileNavVisible;
      }
    },
    trigerMobileNav() {
      this.mobileNavVisible = !this.mobileNavVisible;
      this.mobileI18nVisible = false;
    },
    setChildMenuVisible(menu, visible) {
      menu.showChild = visible;
    },
    jump(menu, parent) {
      if (!menu.disabled) {
        this.list.forEach(l => {
          if (l !== parent) {
            l.selected = false;
          } else {
            l.selected = true;
          }
        });
        this.$router.push({ path: menu.url });
        this.current = menu;
        parent.showChild = false;
      }
    },
    getList() {
      const list = this.navs.map((m, index) => {
        m.key = index;
        if (m.children) {
          let selected = false;
          const children = m.children.map((mm, ii) => {
            mm.index = ii;
            if (this.$route.name.includes(mm.name)) {
              selected = true;
            }
            return { ...mm, children };
          });
          return { ...m, selected, showChild: false };
        }
        const selected = this.$route.name.includes(m.name);
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
  height: 65px;
  align-items: center;
  justify-content: center;
  display: flex;
  background: $header-background-color;
  color: $header-color;
  padding: 0 10%;
  position: relative;
  @media screen and (max-width: 1440px) {
    padding: 0 50px;
  }
  @media screen and (max-width: 768px) {
    padding: 0 20px !important;
  }
  &.is-login-nav {
    background: $header-nav-hide-background-color;
    color: $header-nav-hide-color;
    padding: 0 50px;
    .right-wrap {
      .lang-selector {
        .drop-trangle {
          &:hover {
            .current {
              .current-text {
                color: $header-nav-item-hover-color;
              }
              .drop-trangle {
                &::after {
                  border-top-color: $header-nav-item-hover-color;
                }
              }
            }
          }
          &.down {
            &::after {
              border-top-color: $header-nav-hide-trangle-color;
            }
          }
        }
        .popup {
          box-shadow: 0 2px 8px 0 $header-nav-hide-popup-shadow-color;
          background-color: $header-nav-hide-popup-background-color;
          margin-top: 0;
          right: 0;
          top: 50px;
          li {
            list-style: none;
            line-height: 38px;
            padding: 0 30px;
            &:hover {
              background: $header-nav-hide-popup-item-hover-background-color;
              color: $header-nav-hide-popup-item-hover-color;
            }
            &:last-child {
              margin-bottom: 0;
            }
            &.selected {
              color: $header-nav-hide-popup-item-selected-color;
              .is-checked {
                &::after {
                  border-color: $header-nav-hide-popup-item-checked-color;
                }
              }
            }
          }
        }
      }
      .small-device {
        .i18n-mobile {
          background: $header-nav-hide-i18n-mobile-background-color;
          color: $header-nav-hide-i18n-mobile-color;
          border-color: $header-nav-hide-i18n-mobile-border-color;
          li {
            border-color: $header-nav-hide-i18n-mobile-item-border-color;
            &.selected {
              color: $header-nav-hide-popup-item-selected-color;
              .is-checked {
                &::after {
                  border-color: $header-nav-hide-popup-item-checked-color;
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
          }
        }
      }
    }
  }
  .logo-wrap {
    z-index: 1001;
    padding-right: 60px;
    .offical {
      color: $header-official-color;
      text-decoration: none;
      display: flex;
      align-items: center;
      font-size: 14px;
      line-height: 1;
      &:hover {
        text-decoration: underline;
        color: $header-official-hover-color;
      }
      img {
        width: 12px;
        margin-right: 5px;
      }
    }
    .logo-wrap__logo {
      width: 74px;
      height: 25px;
      cursor: pointer;
    }
  }
  .nav-wrap {
    flex: 1;
    height: 100%;

    &.nav-wrap--laptop {
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
        &.open {
          &::before {
            content: '';
            display: block;
            position: absolute;
            bottom: -6px;
            height: 6px;
            width: 260px;
            left: 0;
            background: transparent;
            z-index: 999;
          }
        }
        @media screen and (max-width: 1440px) {
          margin-right: 50px;
        }
        cursor: pointer;
        position: relative;
        &:hover {
          .nav-item-content {
            .nav-item__text {
              color: $header-nav-item-hover-color;
            }
          }
        }
        &.selected {
          position: relative;
          &::after {
            content: '';
            display: block;
            height: 2px;
            background: $header-nav-item-selected-background-color;
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
        .nav-item-content {
          display: flex;
          .nav-item__text {
            height: 100%;
            display: flex;
            align-items: center;
            color: $header-popup-item-color;
          }
        }
        .nav-item-child {
          display: none;
          width: 280px;
          position: absolute;
          z-index: 999;
          top: 100%;
          left: 0;
          margin-top: 6px;
          box-shadow: -10px 9px 21px 0 $header-popup-shadow-color;
          background-color: $header-popup-background-color;
          padding: 25px 0;
          .nav-child__text {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: $header-popup-item-color;
            list-style: none;
            padding: 0 30px;
            line-height: 38px;
            &:hover {
              color: $header-popup-item-hover-color;
              background: $header-popup-item-hover-background-color;
            }
            &.disabled {
              color: $header-popup-item-disabled-color;
              cursor: not-allowed;
              background: $header-popup-item-disabled-background-color;
              &:active,
              &:hover {
                color: $header-popup-item-disabled-hover-color;
              }
            }
            &.selected {
              color: $header-popup-item-selected-color;
              .is-checked {
                &::after {
                  border-color: $header-popup-item-checked-color;
                }
              }
            }
          }
          &.show {
            display: block;
          }
        }
      }
    }
  }
  .right-wrap {
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    z-index: 1001;
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
            color: $header-nav-item-hover-color;
          }
          .drop-trangle {
            &::after {
              border-top-color: $header-nav-item-hover-color;
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
          z-index: 999;
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
            border-top: 5px solid $header-nav-item-color;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
          }
          transition: transform 0.3s linear;
          &.up {
            transform: rotate(180deg);
          }
          &.down {
            transform: rotate(0);
          }
        }
      }

      .popup {
        position: absolute;
        width: 153px;
        margin-top: 6px;
        border-radius: 2px;
        z-index: 999;
        box-shadow: -10px 9px 21px 0 $header-popup-shadow-color;
        background-color: $header-popup-background-color;
        padding: 25px 0;
        opacity: 1;
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
            background: $header-popup-item-hover-background-color;
            color: $header-popup-item-hover-color;
          }
          &:last-child {
            margin-bottom: 0;
          }
          &.selected {
            color: $header-popup-item-selected-color;
            .is-checked {
              &::after {
                border-color: $header-popup-item-checked-color;
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
        color: $header-nav-item-hover-color;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .header-container {
    height: 65px;
    position: relative;
    &.open,
    &.i18n-open {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
      width: 100%;
    }

    .logo-wrap {
      display: block;
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      padding: 0;
    }
    .nav-wrap {
      position: fixed;
      top: 65px;
      left: 0;
      z-index: 1000;
      width: 100%;
      height: calc(100% - 65px);
      background: $header-background-color;
      color: $header-color;
      &.nav-wrap--laptop {
        display: none;
      }
      &.nav-wrap--mobile {
        display: block;
        overflow: auto;
      }
      .nav {
        padding: 0 30px;
        flex-direction: column;
        height: auto;
        border-top: 1px solid $header-nav-item-border-color;
        .nav-item {
          width: 100%;
          margin: 0;
          height: auto;
          flex-direction: column;
          align-items: flex-start;
          border-bottom: 1px solid $header-nav-item-border-color;
          &:hover {
            .nav-item-content {
              .nav-item__text {
                color: $header-mobile-nav-item-hover-color;
              }
            }
          }
          &.nav-item__exit {
            display: block;
          }
          &.nav-item__exit {
            .nav-item-content {
              &::after {
                display: none;
              }
            }
          }
          .nav-item-content {
            align-items: center;
            position: relative;
            width: 100%;
            &::after {
              position: absolute;
              content: '';
              display: block;
              width: 5px;
              height: 5px;
              border-right: 1px solid $header-mobile-nav-item-color;
              border-bottom: 1px solid $header-mobile-nav-item-color;
              border-left: 0;
              border-top: 0;
              transform: translateY(-50%) rotate(45deg);
              top: 50%;
              right: 0;
              transition: all 0.3s linear;
            }
            .nav-item__text {
              color: $header-mobile-nav-item-color;
              line-height: 1;
              padding: 16px 0;
              font-size: 16px;
            }
          }
          &.selected {
            &::after {
              display: none;
            }
            .nav-item-content {
              &::after {
                transform: translateY(-50%) rotate(225deg);
              }
              .nav-item__text {
                color: $header-mobile-nav-item-color;
              }
            }
          }
          .nav-item-child {
            position: static;
            display: block;
            background: $header-popup-background-color;
            box-shadow: none;
            width: 100%;
            padding: 0;
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
              padding: 0;
              padding-left: 10px;
              color: $header-popup-item-color;
              &.disabled {
                background: $header-popup-item-disabled-background-color;
              }
              &:active {
                color: $header-popup-item-active-color;
              }
              &:hover {
                color: $header-popup-item-disabled-hover-color;
                background: $header-popup-background-color;
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
          background: $header-popup-background-color;
          color: $header-popup-item-color;
          padding: 0 30px;
          z-index: 1000;
          border-top: 1px solid $header-popup-border-color;
          li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0;
            list-style: none;
            border-top: 1px solid $header-nav-item-border-color;
            &.selected {
              color: $header-nav-item-selected-background-color;
              .is-checked {
                &::after {
                  border-color: $header-popup-item-checked-color;
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
          &.language {
            background: url(../../assets/images/icon/ic_languages_white.png)
              no-repeat center;
            background-size: 100%;
          }
          &.menu {
            width: 24px;
            margin-left: 40px;
            background: url(../../assets/images/icon/ic_top_bar_pull_down.png)
              no-repeat center;
            background-size: 100%;
          }
        }
      }
    }
  }
}
</style>
