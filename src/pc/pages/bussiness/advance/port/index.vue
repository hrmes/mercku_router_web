<template>
  <div class="advance-port-container">
    <div class="content">
      <div class='w-header'>
        {{$t('端口转发')}}
      </div>
      <div class="empty" v-if="!hasPort">
        <img src="../../../../assets/images/img_no_network_access.png" alt="">
        <p>暂无端口转发</p>
        <div class="btn-warp">
          <button class="btn" @click="modalOpen('add')">{{$t('trans0035')}}</button>
        </div>
      </div>
      <div class='table' v-else>
        <div class="handle-wrap">
          <button class="btn" @click="modalOpen('add')">{{$t('trans0035')}}</button>
          <button class="btn btn-default" @click="modalOpen('add')" :disabled="!hasChecked">{{$t('批量删除')}}</button>
        </div>
        <div class="table-head">
          <div class="column-check">
            <m-checkbox v-model="checkAll" :onChange="change"></m-checkbox>
          </div>
          <div class="column-name">{{$t('名称')}}</div>
          <div class="column-local-ip">{{$t('本地IP')}}</div>
          <div class="column-local-port">{{$t('本地端口')}}</div>
          <div class="column-outside-ip">{{$t('外部IP')}}</div>
          <div class="column-outside-port">{{$t('外部端口')}}</div>
          <div class="column-protocol">{{$t('协议')}}</div>
          <div class="column-status">{{$t('状态')}}</div>
          <div class="column-handle">{{$t('操作')}}</div>
        </div>
        <div class="table-body">
          <div class="table-row" v-for="(item,index ) in list" :key='index'>
            <div class="column-check">
              <m-checkbox v-model='item.checked'></m-checkbox>
            </div>
            <div class="column-name">{{item.name}}</div>
            <div class="column-local-ip">{{item.localIP}}</div>
            <div class="column-local-port">{{item.localPort}}</div>
            <div class="column-outside-ip">{{item.outsideIP}}</div>
            <div class="column-outside-port">{{item.outsidePort}}</div>
            <div class="column-protocol">{{item.protocol}}</div>
            <div class="column-status">
              <m-switch v-model="item.status"></m-switch>
            </div>
            <div class="column-handle">
              <a> 编辑</a>
              <a>删除</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    const arr = Array.from(new Array(5)).map((_, i) => ({
      checked: false,
      name: `我是端口名称${i}`,
      localIP: `123.123.123.${i}`,
      localPort: `我是端口名称${i}`,
      outsideIP: `1233-${i}`,
      outsidePort: `123.123.123.${i}`,
      protocol: i % 2 === 0 ? 'TCP' : 'UDP',
      status: i % 2 === 0
    }));
    return {
      checkAll: false,
      reverseCheck: false,
      list: arr
    };
  },
  computed: {
    hasPort() {
      return true;
    },
    hasChecked() {
      return this.list.some(i => i.checked);
    }
  },
  watch: {
    list: {
      handler: function temp(v) {
        if (v.map(item => item.checked).some(n => !n)) {
          this.checkAll = false;
        } else {
          this.checkAll = true;
        }
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    change(v) {
      this.list.forEach(item => {
        if (v) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.advance-port-container {
  flex: auto;
  padding: 0 2%;
  display: flex;
  position: relative;
  .content {
    border-radius: 8px;
    padding: 0 20px;
    background: white;
    position: relative;
    flex: 1;
    .w-header {
      height: 60px;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      color: #333333;
      line-height: 60px;
      font-weight: bold;
    }
    .empty {
      padding-top: 30px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      p {
        margin: 0;
        margin-bottom: 60px;
      }
      img {
        width: 200px;
      }
    }
    .table {
      .handle-wrap {
        margin: 30px 0;
        .btn {
          width: 70px;
          height: 27px;
          padding: 0;
          &:last-child {
            margin-left: 20px;
          }
        }
      }
      .column-check {
        width: 50px;
      }
      .column-name {
        width: 120px;
      }
      .column-local-ip {
        width: 120px;
      }
      .column-local-port {
        width: 100px;
      }
      .column-outside-ip {
        width: 120px;
      }
      .column-outside-port {
        width: 100px;
      }
      .column-protocol {
        width: 100px;
      }
      .column-status {
        width: 100px;
      }
      .column-handle {
        width: 150px;
      }
      .table-head {
        height: 50px;
        background-color: #f1f1f1;
        display: flex;
        padding: 0 30px;
        justify-content: space-between;
        div {
          display: flex;
          height: 50px;
          align-items: center;
        }
      }
      .table-body {
        .table-row {
          display: flex;
          padding: 30px 30px;
          border-bottom: 1px solid #f1f1f1;
          justify-content: space-between;
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .advance-port-container {
    .modal {
      .modal-content {
        width: 295px;
        height: 229px;
      }
    }
    padding: 20px 16px;
    .content {
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
      min-height: 450px;
      .handle {
        display: flex;
        align-items: center;
        margin-top: 20px;
        label {
          padding: 0 30px 0 0px;
        }
      }
      .table {
        margin-top: 20px;
        .table-body {
          .table-row {
            flex-direction: row;
            padding: 20px 0;
            position: relative;
          }
        }
        .column-address {
          width: 200px;
          overflow: height;
        }
        .column-handle {
          width: 100%;
          justify-content: flex-end;
          // margin-top: 20px;
          a {
            margin-right: 0 !important;
            &:first-child {
              margin-right: 20px !important;
            }
          }
          .check-wrap {
            position: absolute;
            right: 0;
            top: 20px;
          }
        }
        .table-head {
          display: none;
        }
      }
    }
  }
}
</style>

