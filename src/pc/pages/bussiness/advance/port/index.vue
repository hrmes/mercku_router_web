<template>
  <div class="advance-port-container">
    <div class="content">
      <div class='w-header'>
        {{$t('trans0422')}}
      </div>
      <div class="empty" v-if="(typeof empty =='boolean') && !empty">
        <img src="../../../../assets/images/img_no_network_access.png" alt="">
        <p>{{$t('trans0278')}}</p>
        <div class="btn-warp">
          <button class="btn" @click="()=>this.$router.push('/advance/portforwarding/form')">{{$t('trans0035')}}</button>
        </div>
      </div>
      <div class='table' v-else>
        <div class="handle-wrap">
          <button class="btn" @click="()=>this.$router.push('/advance/portforwarding/form')">{{$t('trans0035')}}</button>
          <button class="btn btn-default" @click="mulDel" :disabled="!hasChecked">{{$t('trans0453')}}</button>
        </div>
        <div class="table-head">
          <div class="column-check">
            <m-checkbox v-model="checkAll" :onChange="change"></m-checkbox>
          </div>
          <div class="column-name">{{$t('trans0108')}}</div>
          <div class="column-local-ip">{{$t('trans0427')}}</div>
          <div class="column-local-port">{{$t('trans0428')}}</div>
          <div class="column-outside-ip">{{$t('trans0425')}}</div>
          <div class="column-outside-port">{{$t('trans0426')}}</div>
          <div class="column-protocol">{{$t('trans0408')}}</div>
          <div class="column-status">{{$t('trans0190')}}</div>
          <div class="column-handle">{{$t('trans0370')}}</div>
        </div>
        <div class="table-body">
          <div class="table-row" v-for="(item,index ) in portfws" :key='index'>
            <div class="column-check">
              <m-checkbox v-model='item.checked'></m-checkbox>
            </div>
            <div class="column-name">{{item.name}}</div>
            <div class="column-local-ip">{{item.local.ip}}</div>
            <div class="column-local-port">{{item.local.port.from}}-{{item.local.port.to}}</div>
            <div class="column-outside-ip">{{item.remote.ip}}</div>
            <div class="column-outside-port">{{item.remote.port.from}}-{{item.remote.port.to}}</div>
            <div class="column-protocol">{{item.protocol}}</div>
            <div class="column-status">
              <m-switch v-model="item.enabled"></m-switch>
            </div>
            <div class="column-handle">
              <a> {{$t('trans0034')}}</a>
              <a @click="del([item.id])"> {{$t('trans0033')}}</a>
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
    return {
      empty: true,
      checkAll: false,
      reverseCheck: false,
      portfws: [],
      checkedArr: []
    };
  },
  computed: {
    hasChecked() {
      return this.portfws.some(i => i.checked);
    }
  },
  watch: {
    portfws: {
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
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.$http.meshPoetfwGet().then(res => {
        this.portfws = res.data.result.map(v => ({ ...v, checked: false }));
        if (this.portfws.length > 0) {
          this.empty = true;
        } else {
          this.empty = false;
        }
      });
    },
    change(v) {
      this.portfws.forEach(item => {
        if (v) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
    },
    mulDel() {
      const portfwIds = [];
      this.portfws.forEach(v => {
        if (v.checked) {
          portfwIds.push(v.id);
        }
      });
      this.del(portfwIds);
    },
    del(portfwIds) {
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0376'),
        callback: {
          ok: () => {
            this.$loading.open();
            this.$http
              .meshPortfwDelete({ portfw_ids: portfwIds })
              .then(() => {
                // this.portfws
                this.$toast(this.$t('trans0040'), 3000, 'success');
                this.$loading.close();
              })
              .catch(() => {
                this.$loading.close();
              });
          }
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
        a {
          cursor: pointer;
          &:last-child {
            color: #ff0001;
            padding-left: 30px;
          }
          &:hover {
            opacity: 0.8;
          }
        }
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

