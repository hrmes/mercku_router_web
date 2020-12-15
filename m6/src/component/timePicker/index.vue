<template>
  <div class="time-picker-panel">
    <div class="input-wrap"
         @click="open">
      <input type="text"
             :placeholder="$t('trans0100')"
             v-model="inputValue"
             readonly>
      <img class="icon-inner"
           src="../../assets/images/rescreen-time.png"
           alt="">
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
  props: {
    value: { type: String }
  },
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
      const pEl = el;
      const sEl = el.querySelector('.selected');
      const cTop = sEl.offsetTop;
      const pTop = pEl.offsetTop;
      const { scrollTop } = pEl;
      const move = cTop - pTop + scrollTop;
      this.scrollTo(el, 0, move);
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
<style lang='scss'>
.time-picker-panel {
  width: 160px;
  height: 36px;
  position: relative;
  border: 1px solid $time-picker-pannel-border-color;
  border-radius: 4px;
  padding: 0 5px;
  .combox {
    position: absolute;
    background: $time-picker-combox-background-color;
    left: -1px;
    top: calc(100% + 5px);
    display: flex;
    flex-direction: column;
    width: 100%;
    z-index: 9999;
    box-shadow: 0 2px 8px $time-picker-combox-shadow-color;
    background-clip: padding-box;
    overflow: hidden;
    transition: transform 0.3s;
    .select-wrap {
      display: flex;
    }
    .button-wrap {
      border-top: 1px solid $time-picker-buttons-border-color;
      button {
        height: 38px;
        width: 50%;
        border: none;
        background: $time-picker-button-background-color;
        cursor: pointer;
        outline: none;
        &:hover {
          opacity: 0.8;
        }
        &:first-child {
          color: $time-picker-button-cancel-color;
        }
        &:last-child {
          color: $time-picker-button-confirm-color;
        }
      }
    }
    .select-inner {
      flex: 1;
      height: 192px;
      overflow-y: scroll;
      border-right: 1px solid $time-picker-popup-border-color;
      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: $time-picker-popup-scrollbar-color;
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
        text-align: left;
        padding-left: 10px;
        height: 36px;
        line-height: 36px;
        cursor: pointer;
        &:hover {
          background: $time-picker-popup-item-hover-background-color;
          color: $time-picker-popup-item-hover-color;
        }
        &:active {
          background: $time-picker-popup-item-active-background-color;
          color: $time-picker-popup-item-active-color;
        }
        &.selected {
          color: $time-picker-popup-item-selected-color;
        }
      }
    }
  }
  .input-wrap {
    width: 100%;
    height: 100%;
    cursor: pointer;
    position: relative;
    input {
      cursor: pointer;
      border: none;
      text-decoration: none;
      outline: none;
      width: 100%;
      height: 100%;
      background: $time-picker-input-background-color;
    }
    .icon-inner {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0;
      width: 18px;
    }
  }
}
</style>
