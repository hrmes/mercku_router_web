<template>
  <header class="header-container"
          :class="{'nav-hide':!navVisible,'open':mobileNavVisible}">
    <div class="logo-wrap">
      <div v-if="logoVisible"
           class="logo-wrap__logo"></div>
      <a v-if="!logoVisible"
         class="offical"
         target="_blank"
         href="https://www.mercku.com">
        <img src="../../assets/images/icon/ic_web_home.png"
             alt="">
        <span>mercku.com</span>
      </a>
    </div>

    <div class="nav-wrap nav-wrap--laptop">
      <ul class="nav"
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
              class="nav-item-child"
              :class="{'show':menu.showChild}">
            <li class="nav-child__text"
                :key="child.key"
                @click.stop="jump(child,menu)"
                v-for="child in menu.children"
                :class="{'selected':$route.name.includes(child.name),'disabled':child.disabled}">
              {{$t(child.text)}}
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
      <ul class="nav">
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
                class="nav-item-child"
                v-show="menu.selected">
              <li class="nav-child__text"
                  :key="child.key"
                  @click.stop="jumpMobile(child,menu)"
                  v-for="child in menu.children"
                  :class="{'selected':$route.name.includes(child.name),'disabled':child.disabled}">
                {{$t(child.text)}}
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
          <ul class="popup"
              v-show="showPopup">
            <li :key="lang.value"
                v-for="lang in Languages"
                @click="selectLang(lang)">{{lang.text}}</li>
          </ul>
        </transition>
      </div>
      <div class="small-device">
        <span @click="changeLang()"
              class="menu-icon language"
              :class="[$i18n.locale]"></span>
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
    text: '简体中文',
    value: 'zh-CN'
  },
  {
    text: 'English',
    value: 'en-US'
  }
];
export default {
  props: {
    navVisible: {
      type: Boolean,
      default: true
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
      showPopup: false,
      Languages,
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
    beforeEnter(el) {
      el.style.height = 0;
    },
    enter(el, done) {
      // debugger;
      const height = el.childElementCount * 38;
      setTimeout(() => {
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
      return Languages.filter(l => l.value === this.$i18n.locale)[0];
    },

    setLangPopupVisible(visible) {
      this.showPopup = visible;
    },

    selectLang(lang) {
      this.changeLanguage(lang.value);
      this.showPopup = false;
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
  background: #333;
  color: #fff;
  padding: 0 10%;
  @media screen and (max-width: 1440px) {
    padding: 0 50px;
  }
  position: relative;
  &.nav-hide {
    background: #fff;
    color: #333;
    padding: 0 50px;
    .right-wrap {
      .lang-selector {
        .drop-trangle {
          &.up {
          }
          &.down {
            &::after {
              border-top-color: #333;
            }
          }
        }
        .popup {
          box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
          background-color: #fff;
          margin-top: 0;
          right: 0;
          top: 50px;
          li {
            list-style: none;
            line-height: 38px;
            padding: 0 30px;
            &:hover {
              background: #fff;
              color: #d6001c;
            }
            &:last-child {
              margin-bottom: 0;
            }
            &.current-lang {
              color: #d6001c;
            }
          }
        }
      }
      .small-device {
        .menu-icon {
          &.language {
            &.zh-CN {
              background: url(../../assets/images/icon/ic_lang_cn_reverse.png)
                no-repeat center;
              background-size: 100%;
            }
            &.en-US {
              background: url(../../assets/images/icon/ic_lang_en_reverse.png)
                no-repeat center;
              background-size: 100%;
            }
          }
        }
      }
    }
  }
  .logo-wrap {
    padding-right: 60px;
    .offical {
      color: #333;
      text-decoration: none;
      display: flex;
      align-items: center;
      font-size: 14px;
      &:hover {
        text-decoration: underline;
        color: #999;
      }
      img {
        width: 12px;
        margin-right: 5px;
      }
    }
    .logo-wrap__logo {
      width: 74px;
      height: 25px;
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
              color: #999;
            }
          }
        }
        &.selected {
          position: relative;
          &::after {
            content: '';
            display: block;
            height: 2px;
            background: #d6001c;
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
            color: #fff;
          }
        }
        .nav-item-child {
          display: none;
          width: 260px;
          position: absolute;
          z-index: 999;
          top: 100%;
          left: 0;
          margin-top: 6px;
          box-shadow: -10px 9px 21px 0 rgba(128, 152, 213, 0.08);
          background-color: #333333;
          padding: 25px 0;
          .nav-child__text {
            color: #fff;
            list-style: none;
            padding: 0 30px;
            line-height: 38px;
            &:hover {
              color: #fff;
              background: rgba(255, 255, 255, 0.2);
            }
            &.disabled {
              color: #999;
              cursor: not-allowed;
              background: #333;
              &:active,
              &:hover {
                color: #999;
              }
            }
            &.selected {
              color: #d6001c;
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
            color: #999;
          }
          .drop-trangle {
            &::after {
              border-top-color: #999;
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
          width: 70px;
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
            border-top: 5px solid #fff;
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
        width: 150px;
        margin-top: 6px;
        background: #fff;
        border-radius: 2px;
        z-index: 999;
        box-shadow: -10px 9px 21px 0 rgba(128, 152, 213, 0.08);
        background-color: #333333;
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
          list-style: none;
          line-height: 38px;
          padding: 0 30px;
          &:hover {
            background: rgba(255, 255, 255, 0.2);
            color: #fff;
          }
          &:last-child {
            margin-bottom: 0;
          }
          &.current-lang {
            color: #d6001c;
          }
        }
      }
    }
    .exit {
      display: inline-block;
      cursor: pointer;
      margin-left: 50px;
      &:hover {
        color: #999;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .header-container {
    height: 65px;
    position: relative;
    &.open {
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
    }
    .nav-wrap {
      position: fixed;
      top: 65px;
      left: 0;
      z-index: 1000;
      width: 100%;
      height: calc(100% - 65px);
      background: #333;
      color: #fff;
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
        border-top: 1px solid #666;
        .nav-item {
          width: 100%;
          margin: 0;
          height: auto;
          flex-direction: column;
          align-items: flex-start;
          border-bottom: 1px solid #666;
          &:hover {
            .nav-item-content {
              .nav-item__text {
                color: #fff;
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
              border-right: 1px solid #fff;
              border-bottom: 1px solid #fff;
              border-left: 0;
              border-top: 0;
              transform: translateY(-50%) rotate(45deg);
              top: 50%;
              right: 0;
              transition: all 0.3s linear;
            }
            .nav-item__text {
              color: #fff;
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
                color: #fff;
              }
            }
          }
          .nav-item-child {
            position: static;
            display: block;
            background: #333;
            box-shadow: none;
            padding: 0;
            &.nav-item-child__animation-leave-active {
              overflow: hidden;
            }
            &.nav-item-child__animation-enter-active {
              overflow: hidden;
            }
            .nav-child__text {
              padding: 0;
              padding-left: 10px;
              color: #fff;
              &.disabled {
                background: #333;
              }
              &:active {
                color: #333;
              }
              &:hover {
                color: #999;
                background: #333;
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
        top: 50%;
        transform: translateY(-50%);
        .menu-icon {
          display: inline-block;
          width: 20px;
          height: 20px;
          &.language {
            &.zh-CN {
              background: url(../../assets/images/icon/ic_lang_cn.png) no-repeat
                center;
              background-size: 100%;
            }
            &.en-US {
              background: url(../../assets/images/icon/ic_lang_en.png) no-repeat
                center;
              background-size: 100%;
            }
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
