<template>
  <div class="advance-portfw-container">
    <div class="content">
      <div class='w-header' :class="{'m-head':mobileShowHead}">
        <span class="title"> {{$t('trans0422')}}</span>
        <div class="m-handle">
          <div class="m-check-box">
            <m-checkbox v-model="checkAll" :onChange="change"></m-checkbox>
            <span>{{$t('trans0032')}}</span>
          </div>
          <div class="m-head-btn-wrap">
            <button class="btn m-btn-default" @click="mulDel" :disabled="!hasChecked">{{$t('trans0453')}}</button>
            <span @click="()=>mobileShowHead=!mobileShowHead">{{$t('trans0025')}}</span>
          </div>
        </div>
      </div>
      <div class="empty" v-if="(typeof empty =='boolean') && empty">
        <img src="../../../../assets/images/img_default_empty.png" alt="">
        <p>{{$t('trans0278')}}</p>
        <div class="btn-warp">
          <button class="btn" @click="()=>$router.push('/advance/portforwarding/form')">{{$t('trans0035')}}</button>
        </div>
      </div>
      <div class='table' v-if="(typeof empty =='boolean') && !empty">
        <div class="handle-info" :class="{'openInfo':mobileShowHead}">
          <div class="select" @click="()=>mobileSelect=!mobileSelect">{{$t('trans0370')}} <i> <img :class="{open:mobileSelect}" src="../../../../assets/images/ic_arrow_pack_up.png" alt=""></i> </div>
          <div class="btn-wrap" :class="{open:mobileSelect}">
            <button class="btn" @click="()=>$router.push('/advance/portforwarding/form')">{{$t('trans0035')}}</button>
            <button class="btn m-btn" @click="()=>{mobileShowHead=!mobileShowHead;mobileSelect=!mobileSelect}">{{$t('trans0453')}}</button>
            <button class="btn btn-default" @click="mulDel" :disabled="!hasChecked">{{$t('trans0453')}}</button>
          </div>
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
            <div class="column-check" :class="{'checkOpen':mobileShowHead}">
              <m-checkbox v-model='item.checked'></m-checkbox>
            </div>
            <div class="column-name"> <span class="m-title">{{$t('trans0108')}}：</span>{{item.name}}</div>
            <div class="column-local-ip"><span class="m-title">{{$t('trans0427')}}：</span>{{item.local.ip}}</div>
            <div class="column-local-port"><span class="m-title">{{$t('trans0428')}}：</span>{{item.local.port.from}}-{{item.local.port.to}}</div>
            <div class="column-outside-ip"><span class="m-title">{{$t('trans0425')}}：</span>{{item.remote.ip}}</div>
            <div class="column-outside-port"><span class="m-title">{{$t('trans0426')}}：</span>{{item.remote.port.from}}-{{item.remote.port.to}}</div>
            <div class="column-protocol"><span class="m-title">{{$t('trans0408')}}：</span>{{item.protocol}}</div>
            <div class="column-status">
              <m-switch v-model="item.enabled" :onChange="(v)=>update(v,item)"></m-switch>
            </div>
            <div class="column-handle">
              <a @click="editHandle(item)"> {{$t('trans0034')}}</a>
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
      mobileSelect: false,
      mobileShowHead: false,
      empty: null,
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
      this.$http.meshPortfwGet().then(res => {
        this.portfws = res.data.result.map(v => ({ ...v, checked: false }));
        if (this.portfws.length > 0) {
          this.empty = false;
        } else {
          this.empty = true;
        }
      });
    },
    editHandle(item) {
      this.$store.state = { portfw: item };
      this.$router.push(`/advance/portforwarding/form/${item.id}`);
    },
    update(v, item) {
      this.$loading.open();
      this.$http
        .meshPortfwUpdate({ ...item, enabled: v })
        .then(() => {
          this.$loading.close();
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .catch(() => {
          this.$loading.close();
          this.getList();
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
    filterList(ids) {
      ids.forEach(v => {
        this.portfws = this.portfws.filter(item => item.id !== v);
      });
      if (this.portfws.length === 0) {
        this.empty = true;
      }
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
                this.filterList(portfwIds);
                // this.getList
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
.advance-portfw-container {
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
      .m-handle {
        display: none;
      }
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
      .handle-info {
        .select {
          display: none;
        }
        .btn-wrap {
          margin: 30px 0;
          .m-btn {
            display: none;
          }
          .btn {
            width: 70px;
            height: 27px;
            padding: 0;
            &:last-child {
              margin-left: 20px;
            }
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
          .m-title {
            display: none;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .advance-portfw-container {
    padding: 20px 16px;
    .content {
      position: relative;
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
        &.m-head {
          .title {
            display: none;
          }
          .m-handle {
            width: 100%;
            height: 100%;
            display: block;
            display: flex;
            font-size: 14px;
            color: #333333;
            font-weight: 200;
            align-items: center;
            justify-content: space-between;
            line-height: 1;
            .m-check-box {
              display: flex;
              align-items: center;
              span {
                margin-left: 10px;
              }
            }
            .m-head-btn-wrap {
              display: flex;
              align-items: center;
              .m-btn-default {
                border: none;
                background: none;
                color: #d6001c;
                width: auto;
                padding: 0;
                height: auto;
                &[disabled] {
                  color: #333333;
                  opacity: 0.7;
                }
              }
              span {
                margin-left: 20px;
                cursor: pointer;
                &:nth-child(1) {
                  color: #d6001c;
                }
                &:hover {
                  opacity: 0.8;
                }
              }
            }
          }
        }
      }
      min-height: 450px;
      .empty {
        .btn-warp {
          width: 100%;
          .bth {
            width: 80%;
          }
        }
      }
      .table {
        .handle-info {
          z-index: 1;
          display: block;
          position: absolute;
          top: 7px;
          margin: 0;
          right: 20px;
          .select {
            display: block;
            width: 80px;
            height: 30px;
            border-radius: 4px;
            background-color: #d6001c;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            font-size: 12px;
            &:active {
              background: rgb(182, 0, 24);
            }
            &:hover {
              background: rgb(182, 0, 24);
            }
            i {
              img {
                transition: all 0.3s;
                width: 12px;
                &.open {
                  transform: rotate(180deg);
                }
              }
            }
          }
          .btn-wrap {
            display: none;
            .btn-default {
              display: none;
            }
            .m-btn {
              display: block;
            }
            &.open {
              width: 140px;
              height: 104px;
              border-radius: 2px;
              box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
              border: solid 1px #f1f1f1;
              background-color: #ffffff;
              position: absolute;
              top: 1px;
              right: 0;
              display: block;
              .btn {
                width: 140px;
                height: 42px;
                margin: 0;
                background: white;
                color: #333333;
                text-align: left;
                padding-left: 20px;
                &:active {
                  background-color: #d6001c;
                }
              }
            }
          }
        }
        .openInfo {
          display: none;
        }
        .table-body {
          .table-row {
            .m-title {
              display: inline-block;
            }
            flex-direction: row;
            flex-wrap: wrap;
            padding: 20px 0;
            position: relative;
            .column-local-ip,
            .column-local-port,
            .column-outside-ip,
            .column-outside-port {
              width: 100%;
              margin-bottom: 8px;
            }
            .column-protocol,
            .column-handle {
              width: 100%;
            }
            .column-handle {
              text-align: right;
              margin-top: 10px;
            }
            .column-name {
              width: calc(100% - 30px);
              margin-bottom: 18px;
            }
            .column-check {
              display: none;
              &.checkOpen {
                display: block;
                width: 30px;
              }
            }
            .column-status {
              position: absolute;
              text-align: right;
              right: 0;
              top: 20px;
            }
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

