<template>
  <div class="page">
    <div class="page-header"
         :class="{'m-head':mobileShowHead}">
      <span class="title">{{$t('trans0444')}}</span>
      <div class="m-handle">
        <div class="m-check-box">
          <m-checkbox v-model="checkAll"
                      @change="change"></m-checkbox>
          <span>{{$t('trans0032')}}</span>
        </div>
        <div class="m-head-btn-wrap">
          <button class="btn btn-text text-primary m-btn-default"
                  @click="mulDel"
                  :disabled="!hasChecked">{{$t('trans0453')}}</button>
          <span @click="()=>mobileShowHead=!mobileShowHead">{{$t('trans0025')}}</span>
        </div>
      </div>
    </div>
    <div class="page-content">
      <p class="reboot-info"
         :class="{'extra':empty!==null && !empty}">
        {{$t('trans0496')}}
        <span class="btn-text text-primary"
              @click="updateEnabled">{{$t('trans0488')}}</span>
      </p>

      <div class="table"
           :class="{'empty-table':empty!==null && empty}">
        <div class="handle-info"
             :class="{'openInfo':mobileShowHead}"
             v-clickoutside="()=>mobileSelect=false">
          <div class="select btn"
               @click="()=>mobileSelect=!mobileSelect">
            {{$t('trans0370')}}
            <i>
              <img :class="{open:mobileSelect}"
                   src="../../../../assets/images/icon/ic_arrow_pack_up.png"
                   alt>
            </i>
          </div>
          <div class="btn-wrap"
               :class="{open:mobileSelect}">
            <button class="btn btn-small"
                    @click="()=>$router.push('/advance/rsvdip/form')">{{$t('trans0035')}}</button>
            <button class="btn m-btn"
                    @click="()=>{mobileShowHead=!mobileShowHead;mobileSelect=!mobileSelect}">
              {{$t('trans0453')}}
            </button>
            <button class="btn btn-small"
                    @click="mulDel"
                    :disabled="!hasChecked">{{$t('trans0453')}}</button>
          </div>
        </div>

        <div class="table-head">
          <div class="column-name">
            <div class="column-check">
              <m-checkbox v-model="checkAll"
                          @change="change"></m-checkbox>
            </div>
            {{$t('trans0108')}}
          </div>
          <div class="column-local-ip">{{$t('trans0188')}}</div>
          <div class="column-local-port">{{$t('trans0151')}}</div>
          <div class="column-handle">{{$t('trans0370')}}</div>
        </div>
        <div class="table-body">
          <div class="table-row"
               v-for="(item,index ) in rsvdips"
               :key="index">
            <div class="column-name"
                 :title="item.name">
              <div class="column-check"
                   :class="{'checkOpen':mobileShowHead}">
                <m-checkbox v-model="item.checked"></m-checkbox>
              </div>
              <label class="m-title with-colon">{{$t('trans0108')}}:</label>
              <span class="name">{{item.name}}</span>
            </div>
            <div class="column-local-ip">
              <label class="m-title with-colon">{{$t('trans0188')}}:</label>
              <span>{{formatMac(item.mac)}}</span>
            </div>
            <div class="column-local-port">
              <label class="m-title with-colon">{{$t('trans0151')}}:</label>
              <span>{{item.ip}}</span>
            </div>
            <div class="column-handle">
              <a class="btn-text"
                 @click="editHandle(item)">{{$t('trans0034')}}</a>
              <a class="btn-text text-primary"
                 @click="del([item.id])">{{$t('trans0033')}}</a>
            </div>
          </div>
          <div class="empty"
               v-if="empty!==null && empty">
            <img src="../../../../assets/images/img_default_empty.png"
                 alt="">
            <p>{{$t('trans0278')}}</p>
            <button class="btn btn-middle"
                    @click="()=>$router.push('/advance/rsvdip/form')">{{$t('trans0035')}}</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import { formatMac } from 'base/util/util';

export default {
  data() {
    return {
      formatMac,
      mobileSelect: false,
      mobileShowHead: false,
      empty: null,
      checkAll: false,
      reverseCheck: false,
      rsvdips: [],
      checkedArr: []
    };
  },
  computed: {
    hasChecked() {
      return this.rsvdips.some(i => i.checked);
    }
  },
  watch: {
    rsvdips: {
      handler: function temp(nv) {
        if (nv.length) {
          if (nv.every(v => v.checked)) {
            this.checkAll = true;
          } else {
            this.checkAll = false;
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    updateEnabled() {
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0229'),
        callback: {
          ok: () => {
            this.$http.meshNetworkReboot({ recovery_time: 40 }).then(() => {
              this.$reconnect({
                timeout: 60,
                ontimeout: () => {
                  this.$router.push({ path: '/unconnect' });
                }
              });
            });
          }
        }
      });
    },
    getList() {
      this.$loading.open();
      this.$http
        .meshRsvdipGet()
        .then(res => {
          this.$loading.close();
          this.rsvdips = res.data.result.map(v => ({ ...v, checked: false }));
          if (this.rsvdips.length > 0) {
            this.empty = false;
          } else {
            this.empty = true;
          }
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    editHandle(item) {
      this.$store.modules = { ...this.$store.modules, rsvdip: item };
      this.$router.push(`/advance/rsvdip/form/${item.id}`);
    },
    update(v, item) {
      this.$loading.open();
      this.$http
        .meshRsvdipUpdate({ ...item, enabled: v })
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
      this.rsvdips.forEach(item => {
        if (v) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
    },
    filterList(ids) {
      ids.forEach(v => {
        this.rsvdips = this.rsvdips.filter(item => item.id !== v);
      });
      if (this.rsvdips.length === 0) {
        this.empty = true;
        this.mobileShowHead = false;
      }
    },
    mulDel() {
      const rsvdipIds = [];
      this.rsvdips.forEach(v => {
        if (v.checked) {
          rsvdipIds.push(v.id);
        }
      });
      this.del(rsvdipIds);
    },
    del(rsvdipIds) {
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0376'),
        callback: {
          ok: () => {
            this.$loading.open();
            this.$http
              .meshRsvdipDelete({ rsvdip_ids: rsvdipIds })
              .then(() => {
                this.filterList(rsvdipIds);
                // this.getList();
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
.page-header {
  .m-handle {
    display: none;
  }
}
.table {
  width: 100%;
  .handle-info {
    .select {
      display: none;
    }
    .btn-wrap {
      margin-bottom: 20px;
      display: flex;
      .m-btn {
        display: none;
      }
      .btn {
        margin-right: 20px;
      }
    }
  }
  .column-check {
    width: 40px;
    flex-shrink: 0;
  }
  .column-name {
    display: flex;
    width: 180px;

    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 140px;
    }
  }
  .column-local-ip {
    width: 130px;
  }
  .column-local-port {
    width: 140px;
  }
  .column-outside-ip {
    width: 130px;
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
      &:last-child {
        padding-left: 30px;
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
      padding: 15px 30px;
      border-bottom: 1px solid #f1f1f1;
      justify-content: space-between;
      &:nth-child(2n) {
        background: #f7f7f7;
        @media screen and(max-width:768px) {
          background: #fff;
        }
      }
      .m-title {
        display: none;
      }
    }
  }
}
.reboot-info {
  font-size: 14px;
  margin: 0;
  padding: 0;
  margin-bottom: 20px;
  width: 100%;
  &.extra {
    width: 100%;
    text-align: left;
  }
}
@media screen and (max-width: 768px) {
  .reboot-info {
    font-size: 14px;
    width: auto;
    &.extra {
      background-color: #f1f1f1;
      padding: 10px;
    }
  }
  .page-header {
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
        font-weight: normal;
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
            width: auto;
            padding: 0;
            text-decoration: none;
            &[disabled] {
              color: #999;
            }
          }
          span {
            margin-left: 20px;
            cursor: pointer;
          }
        }
      }
    }
  }
  .empty {
    .btn-warp {
      width: 100%;
      .bth {
        width: 80%;
      }
    }
  }
  .table {
    &.empty-table {
      .handle-info {
        display: none;
      }
    }
    .handle-info {
      z-index: 1;
      display: block;
      position: absolute;
      top: 15px;
      margin: 0;
      right: 20px;
      .select {
        display: block;
        width: 80px;
        height: 30px;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        font-size: 12px;
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
        .btn:nth-child(2) {
          font-size: 12px;
        }
        .btn:nth-child(3) {
          display: none;
        }
        .m-btn {
          display: block;
        }
        &.open {
          width: 140px;
          border-radius: 2px;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
          border: solid 1px #f1f1f1;
          background-color: #ffffff;
          position: absolute;
          top: 36px;
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
            border: 0;
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
        &:first-child {
          padding-top: 0;
        }
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
</style>
