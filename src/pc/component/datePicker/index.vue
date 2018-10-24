<template>
  <div class="date-picker-panel" @click.stop="open">
    <div class="input-wrap">
      <input type="text" placeholder="请选择日期" disabled>
      <span class="icon-inner">
        <a class="icon">V</a>
      </span>
    </div>
    <div class="combobox" ref="combo" v-show="opened">
      <ul>
        <li v-for="(v,i) in date" :key='i' @click.stop="()=>select(v)" :class="{'active':v.checked}">
          <span>{{v.label}}</span>
          <i v-if="v.checked">√</i>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      opened: false,
      date: [
        {
          label: '星期日',
          value: '0',
          checked: false
        },
        {
          label: '星期一',
          value: '1',
          checked: false
        },
        {
          label: '星期二',
          value: '2',
          checked: false
        },
        {
          label: '星期三',
          value: '3',
          checked: false
        },
        {
          label: '星期四',
          value: '4',
          checked: false
        },
        {
          label: '星期五',
          value: '5',
          checked: false
        },
        {
          label: '星期六',
          value: '6',
          checked: false
        }
      ]
    };
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
  computed: {
    checkedArr() {
      const arr = [];
      this.date.forEach(v => {
        if (v.checked) {
          arr.push(v);
        }
      });
      return arr;
    }
  },
  methods: {
    open() {
      this.opened = !this.opened;
    },
    close() {
      if (!this.opened) {
        return;
      }
      this.opened = false;
    },
    select(item) {
      this.date.forEach(v => {
        if (v.value === item.value) {
          v.checked = !v.checked;
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.date-picker-panel {
  position: relative;
  .combobox {
    position: absolute;
    left: 0;
    width: 152px;
    height: 192px;
    overflow-y: scroll;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    background-clip: padding-box;
    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #e6e6e6;
    }
    ul,
    li {
      text-decoration: none;
      list-style: none;
    }
    li {
      height: 34px;
      padding-left: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      -moz-user-select: -moz-none;
      &:hover {
        // color: #4237dd;
      }
      i {
        margin-right: 20px;
      }
      &.active {
        color: #d6001c;
      }
    }
  }
}
</style>


