<template>
  <div class="time-picker-panel">
    <div class="input-wrap"
         @click="open">
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
        <div class="select-inner"
             ref='h'>
          <ul class="reset-ul">
            <li v-for="(v,i) in hs"
                :key='i'
                @click.stop="(e)=>select('h',v,e)"
                :class="{'selected':time.h===v}">{{v}}</li>
          </ul>
        </div>
        <div class="select-inner"
             ref='m'>
          <ul class="reset-ul">
            <li v-for="(v,i) in ms"
                :key='i'
                @click.stop="(e)=>select('m',v,e)"
                :class="{'selected':time.m===v}">{{v}}</li>
          </ul>
        </div>
      </div>
      <div class="button-wrap">
        <button @click="close">{{$t('trans0025')}}</button>
        <button @click="ok">{{$t('trans0024')}}</button>
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
  },
  beforeDestroy() {
    if (window.addEventListener) {
      document.body.removeEventListener('click', this.close);
    } else if (window.attachEvent) {
      document.body.detachEvent('click', this.close);
    }
  },
  methods: {
    formatCount(v) {
      return `0${v}`.slice(-2);
    },
    scrollTo(el, x, y) {
      if (el.scrollTo) {
        el.scrollTo(x, y);
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
      if (this.animationEl.scrollTop >= this.distance) {
        cancelAnimationFrame(this.animationId);
        return;
      }
      let scroll = this.animationEl.scrollTop + 5;
      scroll = scroll > this.distance ? this.distance : scroll;
      this.scrollTo(this.animationEl, 0, scroll);
      this.animationId = requestAnimationFrame(this.animateScroll);
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
      this.animateScroll();
    },
    select(type, v, e) {
      this.selectScroll(e, type);
      this.time[type] = v;
      this.inputValue = `${this.time.h}:${this.time.m}`;
    }
  }
};
</script>
<style lang='scss' scoped>
.time-picker-panel {
  width: 100%;
  min-width: 120px;
  height: 48px;
  border: 1.5px solid var(--time-picker-pannel-border-color);
  position: relative;
  border-radius: 4px;
  padding: 0 10px;
  .combox {
    position: absolute;
    background: var(--time-picker-combox-background-color);
    left: 50%;
    bottom: -4px;
    transform: translate(-50%, 100%);
    display: flex;
    flex-direction: column;
    width: 102%;
    z-index: var(--z-index_pageElement);
    box-shadow: 0 2px 8px var(--time-picker-combox-shadow-color);
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
      flex: 1;
      height: 192px;
      overflow-y: scroll;
      border-right: 1px solid var(--time-picker-popup-border-color);
      box-sizing: border-box;
      &::-webkit-scrollbar {
        width: 0px;
      }
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: var(--time-picker-popup-scrollbar-color);
      }
      &:last-child {
        border-right: none;
      }
      ul {
        position: relative;
        padding-bottom: 156px;
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
        &:hover {
          background: var(--time-picker-popup-item-hover-background-color);
        }
        &:active {
          background: var(--time-picker-popup-item-active-background-color);
          color: var(--time-picker-popup-item-active-color);
        }
        &.selected {
          color: #fff;
          background: var(--time-picker-popup-item-selected-color);
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
        color: var(--input-placehoder-color);
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
