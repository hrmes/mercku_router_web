<template>
  <div class="time-picker-panel">
    <div class="input-wrap" @click.stop="open">
      <input type="text" placeholder="请选择时间" v-model="value" disabled>
      <span class="icon-inner">
        <a class="icon">
          <img src="../../assets/images/rescreen-time.png" alt="">
        </a>
      </span>
    </div>
    <div class="combobox" ref="combo" v-show="opened">
      <div class="select-inner">
        <ul style="height:928px">
          <li v-for="(v,i) in hs" :key='i' @click.stop="(e)=>select('h',v,e)" :class="{'selected':time.h===v}">{{v}}</li>
        </ul>
      </div>
      <div class="select-inner">
        <ul style="height:2080px">
          <li v-for="(v,i) in ms" :key='i' @click.stop="(e)=>select('m',v,e)" :class="{'selected':time.m===v}">{{v}}</li>
        </ul>
      </div>
      <!-- <div class="select-inner">
                <ul style="height:2080px">
                    <li v-for="(v,i) in ms" :key='i' @click.stop="(e)=>select('s',v,e)" :class="{'selected':time.s===v}">{{v}}</li>
                </ul>
            </div> -->
    </div>
  </div>
</template>
<script>
export default {
  props: {
    inputValue: {
      type: String
    }
  },
  data() {
    return {
      opened: false,
      hs: Array.from(new Array(24)).map((__, v) => this.formatCount(v)),
      ms: Array.from(new Array(60)).map((__, v) => this.formatCount(v)),
      value: '',
      time: {
        h: '00',
        m: '00'
      }
    };
  },
  watch: {
    inputValue(v) {
      this.value = v;
      this.time = {
        h: v.split(':')[0],
        m: v.split(':')[1]
      };
    }
  },
  mounted() {
    if (window.addEventListener) {
      document.body.addEventListener('click', this.close);
    } else if (window.attachEvent) {
      document.body.attachEvent('click', this.close);
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
      return v < 10 ? `0${v}` : `${v}`;
    },
    open() {
      this.opened = true;
    },
    close() {
      if (!this.opened) {
        return;
      }
      this.opened = false;
    },
    scroll(e) {
      const pEl = this.$refs.combo;
      const cEl = e.currentTarget;
      const pTop = pEl.getBoundingClientRect().top;
      const cTop = cEl.getBoundingClientRect().top;
      const move = cTop - pTop;
      const scrollTop = e.path[2].scrollTop;
      e.path[2].scrollTo(0, move + scrollTop);
    },
    select(type, v) {
      // this.scroll(e);
      this.time[type] = v;
      this.value = `${this.time.h}:${this.time.m} `;
      this.$emit('input', this.value);
    }
  }
};
</script>
<style lang='scss' scoped>
.time-picker-panel {
  width: 168px;
  height: 38px;
  border: 1px solid #f1f1f1;
  position: relative;
  .combobox {
    position: absolute;
    background: white;
    left: 0;
    display: flex;
    width: 168px;
    z-index: 9999;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    background-clip: padding-box;
    overflow: hidden;
    transition: transform 0.3s;
    .select-inner {
      flex: 1;
      height: 192px;
      overflow-y: scroll;
      border-right: 1px solid #f1f1f1;
      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-track {
        background-color: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: #e6e6e6;
      }
      &:last-child {
        border-right: none;
      }
      ul {
        position: relative;
      }
      li {
        margin: 0;
        padding: 0;
        text-decoration: none;
        list-style: none;
        text-align: left;
        padding-left: 10px;
        height: 32px;
        line-height: 32px;
        // transition: background 0.3s;
        cursor: pointer;
        &:hover {
          background: #4237dd;
          color: white;
        }
        &.selected {
          background: #4237dd;
          color: white;
        }
      }
    }
  }
  .input-wrap {
    display: flex;
    align-items: center;
    width: 168px;
    height: 38px;
    cursor: pointer;
    input {
      cursor: pointer;
      border: none;
      text-decoration: none;
      outline: none;
      width: 120px;
      padding-left: 5px;
      margin-left: 5px;
      height: 30px;
    }
    .icon-inner {
      display: inline-block;
      width: 38px;
      text-align: center;
      a {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 18px;
        }
      }
    }
  }
}
</style>


