<template>
  <div class="time-picker-panel"
       :class="{'open':opened}"
       @click="open">
    <div class="input-wrap">
      <input type="text"
             :placeholder="$t('trans0100')"
             v-model="inputValue"
             readonly>
      <span class="icon-inner">
        <i class="iconfont icon-ic_clock">
        </i>
      </span>
    </div>
    <div class="combox"
         ref="combo"
         v-show="opened">
      <div class="select-wrap">
        <div class="select-inner">
          <div class="select-inner-container"
               ref='h'>
            <ul id='hourList'>
              <li v-for="(v,i) in hs"
                  :key='i'
                  :class="{'selected':time.h===v}"
                  @click.stop="(e)=>select('h',v,e)">{{v}}</li>
            </ul>
          </div>
        </div>
        <div class="select-inner">
          <div class="select-inner-container"
               ref='m'>
            <ul id='minList'>
              <li v-for="(v,i) in ms"
                  :key='i'
                  :class="{'selected':time.m===v}"
                  @click.stop="(e)=>select('m',v,e)">{{v}}</li>
            </ul>
          </div>

        </div>
      </div>
      <div class="button-wrap">
        <button @click.stop="close">{{$t('trans0025')}}</button>
        <button @click.stop="ok">{{$t('trans0024')}}</button>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  props: { value: { type: String } },
  data() {
    return {
      opened: false,
      hs: Array.from(new Array(24)).map((__, v) => this.formatCount(v)),
      ms: Array.from(new Array(60)).map((__, v) => this.formatCount(v)),
      inputValue: this.value,
      time: {
        h: this.value.split(':')[0],
        m: this.value.split(':')[1]
      },
      distance: 0,
      animationTime: 200,
      animationEl: null,
      oldValue: ''
    };
  },
  watch: {
    value(v) {
      this.value = v;
      this.inputValue = this.value;
      this.time = {
        h: v.split(':')[0],
        m: v.split(':')[1]
      };
    },
  },
  computed: {
    hsLength() {
      return this.hs.length - 1;
    },
    msLength() {
      return this.ms.length - 1;
    }
  },
  mounted() {
    if (window.addEventListener) {
      document.body.addEventListener('click', e => {
        if (!this.$el.contains(e.target)) {
          this.close();
        }
      });
    } else if (window.attachEvent) {
      document.body.attachEvent('click', e => {
        if (!this.$el.contains(e.target)) {
          this.close();
        }
      });
    }
    this.addScrollListener('h');
    this.addScrollListener('m');
  },
  beforeDestroy() {
    if (window.addEventListener) {
      document.body.removeEventListener('click', this.close);
    } else if (window.attachEvent) {
      document.body.detachEvent('click', this.close);
    }
    this.removeScrollListener('h');
    this.removeScrollListener('m');
  },
  methods: {
    formatCount(v) {
      return `0${v}`.slice(-2);
    },
    scrollTo(el, x, y) {
      if (el.scrollTo) {
        el.scrollTo(x, y - 72);
      } else {
        el.scrollTop = y;
      }
    },
    ok() {
      this.$emit('input', this.inputValue);
      this.opened = false;
    },
    open() {
      if (!this.opened) {
        this.opened = true;
        this.oldValue = this.inputValue;
        this.$nextTick(() => {
          const hEl = this.$refs.h;
          const mEl = this.$refs.m;
          this.initScroll(hEl);
          this.initScroll(mEl);
        });
      }
    },
    initScroll(el) {
      const sEl = el.querySelector('.selected');
      const cTop = sEl.offsetTop;
      this.scrollTo(el, 0, cTop);
    },
    animateScroll() {
      // if (this.animationEl.scrollTop >= this.distance) {
      //   cancelAnimationFrame(this.animationId);
      //   return;
      // }
      // let scroll = this.animationEl.scrollTop + 5;
      // scroll = scroll > this.distance ? this.distance : scroll;
      // this.scrollTo(this.animationEl, 0, scroll);
      // this.animationId = requestAnimationFrame(this.animateScroll);
      this.scrollTo(this.animationEl, 0, this.distance);
    },
    close() {
      if (!this.opened) {
        return;
      }
      this.inputValue = this.oldValue;
      this.time = {
        h: this.inputValue.split(':')[0],
        m: this.inputValue.split(':')[1]
      };
      this.opened = false;
    },
    selectScroll(e, p) {
      const pEl = this.$refs[p];
      const sEl = e.currentTarget;
      const sTop = sEl.offsetTop;

      this.distance = sTop;
      this.animationEl = pEl;
      this.animationEl.style.scrollBehavior = 'smooth';
      this.animateScroll();
      this.animationEl.style.scrollBehavior = 'auto';
    },
    select(type, v, e) {
      this.selectScroll(e, type);
      this.time[type] = v;
      this.inputValue = `${this.time.h}:${this.time.m}`;
    },
    changeTimeValue(type) {
      const { scrollTop } = this.$refs[type];
      let index = (scrollTop / 36).toFixed(0);
      index = this.formatCount(index);
      this.time[type] = index;
      this.inputValue = `${this.time.h}:${this.time.m}`;
    },
    addScrollListener(type) {
      if (window.addEventListener) {
        this.$refs[type].addEventListener('scroll', () => {
          this.changeTimeValue(type);
        });
      } else if (window.attachEvent) {
        this.$refs[type].attachEvent('onscroll', () => {
          this.changeTimeValue(type);
        });
      }
    },
    removeScrollListener(type) {
      if (window.addEventListener) {
        this.$refs[type].removeEventListener('scroll', () => {
          this.changeTimeValue(type);
        });
      } else if (window.attachEvent) {
        this.$refs[type].detachEvent('onscroll', () => {
          this.changeTimeValue(type);
        });
      }
    }
  }
};
</script>
<style lang='scss' scoped>
::-webkit-scrollbar {
  width: 0px;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}
.time-picker-panel {
  width: 100%;
  min-width: 120px;
  height: 48px;
  border: 1.5px solid var(--time-picker-pannel-border-color);
  position: relative;
  border-radius: 10px;
  padding: 0 10px;
  transition: border 0.3s ease-in-out;
  &.open {
    border-color: var(--input-focus-border-color);
  }
  .combox {
    position: absolute;
    background: var(--time-picker-combox-background-color);
    left: 50%;
    bottom: -4px;
    transform: translate(-50%, 100%);
    display: flex;
    flex-direction: column;
    width: 102%;
    z-index: 1000;
    box-shadow: var(--time-picker-combox-shadow);
    background-clip: padding-box;
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s;
    .select-wrap {
      display: flex;
    }
    .button-wrap {
      border-top: 1px solid var(--time-picker-buttons-border-color);
      button {
        height: 38px;
        width: 50%;
        border: none;
        background: var(--time-picker-button-background-color);
        cursor: pointer;
        outline: none;
        &:hover {
          opacity: 0.7;
        }
        &:first-child {
          color: var(--time-picker-button-cancel-color);
        }
        &:last-child {
          color: var(--time-picker-button-confirm-color);
        }
      }
    }
    .select-inner {
      position: relative;
      flex: 1;
      height: 180px;
      // overflow-y: scroll;
      border-right: 1px solid var(--time-picker-popup-border-color);
      box-sizing: border-box;
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        height: 36px;
        background: var(--primaryColor);
        box-shadow: var(--button-box-shadow);
        // border-top: 1px solid rgba(0, 0, 0, 0.12);
        // border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        pointer-events: none;
        z-index: -1;
      }
      .select-inner-container {
        width: 100%;
        height: 100%;
        overflow: auto;
        scroll-snap-type: y mandatory;
        overscroll-behavior: none;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 72px 0;
      }
      li {
        margin: 0;
        padding: 0;
        text-decoration: none;
        list-style: none;
        text-align: center;
        height: 36px;
        line-height: 36px;
        color: var(--time-picker-li-color);
        cursor: pointer;
        scroll-snap-align: center;
        scroll-snap-stop: always;
        transition: color 0.1s linear;
        // &:hover {
        //   background: var(--time-picker-popup-item-hover-background-color);
        // }
        &.selected {
          color: var(--primaryBackgroundColor);
        }
      }
    }
  }
  .input-wrap {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    input {
      cursor: pointer;
      border: none;
      text-decoration: none;
      outline: none;
      flex: 1;
      padding: 0;
      height: 30px;
      width: 0;
      background: var(--time-picker-input-background-color);
      color: var(--text-default-color);
      &::-webkit-input-placeholder {
        color: var(--input-placeholder-color);
      }
    }
    .icon-inner {
      display: inline-block;
      text-align: center;
      a {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 18px;
          display: block;
        }
      }
    }
  }
}
</style>
