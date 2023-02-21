<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      <span class="title">{{$t('trans0444')}}</span>
    </div>
    <div class="page-content">
      <p class="reboot-info"
         :class="{'extra':empty!==null && !empty}">
        {{$t('trans0496')}}
        <span class="btn-text text-primary"
              @click="updateEnabled">{{$t('trans0488')}}</span>
      </p>
      <div v-if="$store.state.isMobile"
           class="mobile-tools-bar">
        <div class="checkbox">
          <m-checkbox v-model="checkAll"
                      :text="$t('trans0032')"
                      @change="change"></m-checkbox>
        </div>
        <div class="btn-wrap">
          <button class="btn btn-small"
                  @click="mulDel"
                  :disabled="!hasChecked">{{$t('trans0033')}}</button>
          <button class="btn btn-small"
                  @click="add">{{$t('trans0035')}}</button>
        </div>
      </div>
      <div class="table"
           :class="{'empty-table':empty!==null && empty}">
        <div v-if="!$store.state.isMobile"
             class="table-head">
          <div class="column-name">
            <div class="column-check">
              <m-checkbox v-model="checkAll"
                          @change="change"></m-checkbox>
            </div>
            {{$t('trans0108')}}
          </div>
          <div class="column-local-ip">{{$t('trans0188')}}</div>
          <div class="column-local-port">{{$t('trans0151')}}</div>
          <div class="column-handle">
            <div class="btn-wrap"
                 :class="{open:mobileSelect}">
              <button class="btn btn-small"
                      @click="mulDel"
                      :disabled="!hasChecked">{{$t('trans0453')}}</button>
              <button class="btn btn-small"
                      @click="()=>$router.push('/advance/rsvdip/form')">{{$t('trans0035')}}</button>
            </div>
          </div>
        </div>
        <div class="table-body">
          <div class="table-row"
               :class="{'open':item.open}"
               v-for="(item,index ) in rsvdips"
               :key="index">
            <div class="column-name"
                 :title="item.name"
                 @click.stop="item.open=!item.open">
              <div class="column-check">
                <m-checkbox v-model="item.checked"
                            @click.native='stopDefault($event)'></m-checkbox>
              </div>
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
              <span class="btn-icon"
                    @click="editHandle(item)">
                <i class="iconfont icon-ic_settings_normal"></i>
                <span class="icon-hover-popover"> {{$t('trans0034')}}</span>
              </span>
              <span v-if="$store.state.isMobile"
                    class="label"
                    @click="editHandle(item)">
                {{$t('trans0034')}}
              </span>
              <span class="btn-icon"
                    @click="del([item.id])">
                <i class="iconfont icon-ic_trash_normal"></i>
                <span class="icon-hover-popover"> {{$t('trans0033')}}</span>
              </span>
              <span v-if="$store.state.isMobile"
                    class="label"
                    @click="del([item.id])">
                {{$t('trans0033')}}
              </span>
            </div>
          </div>
          <div class="empty"
               v-if="empty!==null && empty">
            <img src="../../../../assets/images/img_default_empty.webp"
                 alt="">
            <p>{{$t('trans0278')}}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import { formatMac } from '../../../../util/util';

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
          this.rsvdips = res.data.result.map(v => ({ ...v, checked: false, open: false }));
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
      this.$store.state.modules = { ...this.$store.state.modules, rsvdip: item };
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
    },
    add() {
      if (this.rsvdips.length <= 20) {
        this.$router.push('/advance/rsvdip/form');
      } else {
        this.$toast(this.$t('trans0060'));
      }
    },
    stopDefault(e) {
      e.stopPropagation();
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
  .column-check {
    width: 40px;
    // display: flex;
    // align-items: center;
    flex-shrink: 0;
  }
  .column-name {
    display: flex;
    width: 180px;

    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: pre;
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
    width: 180px;
    display: flex;
    justify-content: flex-end;
    .btn-wrap {
      .btn {
        &:first-child {
          margin-right: 10px;
        }
      }
    }
  }
  .table-head {
    background: var(--table-row-background-color);
    display: flex;
    padding: 10px 20px;
    justify-content: space-between;
    border-radius: 10px;
    margin-bottom: 5px;
    div {
      display: flex;
      align-items: center;
    }
  }
  .table-body {
    .table-row {
      display: flex;
      padding: 15px 20px;
      border-radius: 10px;
      margin-bottom: 5px;
      background: var(--table-row-background-color);
      justify-content: space-between;
      > div {
        display: flex;
        align-items: center;
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
    font-size: 12px;
    width: auto;
    border-radius: 10px;
    margin-bottom: 5px;
    &.extra {
      text-align: center;

      background: var(--table-row-background-color);
      padding: 10px;
    }
  }
  .mobile-tools-bar {
    display: flex;
    padding: 10px;
    justify-content: space-between;
    align-items: center;
    background: var(--table-row-background-color);
    border-radius: 10px;
    margin-bottom: 5px;
    .checkbox {
      display: flex;
      align-items: center;
      padding-left: 10px;
    }
    .btn-wrap {
      display: flex;
      .btn {
        min-width: fit-content;
        &:first-child {
          margin-right: 5px;
        }
      }
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
  .page-content {
    padding: 10px 20px;
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
    .table-body {
      .table-row {
        .m-title {
          display: inline-block;
        }
        flex-direction: column;
        padding: 10px;
        position: relative;

        .column-local-ip,
        .column-local-port {
          display: none;
          width: 100%;
          padding: 10px;
          justify-content: space-between;
          margin-bottom: 8px;
          color: var(--text-gery-color);
          border-bottom: 1px solid var(--table-body-hr-color);
        }
        .column-handle {
          display: none;
          padding-left: 10px;
          justify-content: flex-start;
          margin: 10px 0;
          .label {
            color: var(--text-gery-color);
          }
        }
        .column-name {
          position: relative;
          width: 100%;
          padding: 10px 35px 10px 10px;
          color: var(--text-default-color);
          .column-check {
            width: auto;
            display: flex;
            align-items: center;
            margin-right: 12px;
          }
          .name {
            flex: 1;
          }
          &::after {
            content: '\e65b';
            font-family: 'iconfont';
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%) rotate(-90deg);
            font-size: 12px;
            transition: transform 0.3s;
          }
        }
        &.open {
          .column-local-ip,
          .column-outside-ip,
          .column-outside-port,
          .column-local-port,
          .column-protocol,
          .column-handle {
            display: flex;
          }
          .column-name {
            border-bottom: 1px solid var(--table-body-hr-color);
            &::after {
              transform: translateY(-50%) rotate(0);
            }
          }
        }
      }
    }
  }
}
</style>
