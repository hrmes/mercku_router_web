<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class='page-header'>
      <span class="title"> {{$t('trans0422')}}</span>
    </div>
    <div class="page-content">
      <div v-if="$store.state.isMobile"
           class="mobile-tools-bar">
        <div class="checkbox">
          <m-checkbox v-model="checkAll"
                      :text="$t('trans0032')"
                      @change="change"></m-checkbox>
        </div>
        <div class="btn-wrap"
             :class="{open:mobileSelect}">
          <button class="btn btn-small"
                  @click="mulDel"
                  :disabled="!hasChecked">{{$t('trans0033')}}</button>
          <button class="btn btn-small"
                  @click="add">{{$t('trans0035')}}</button>
        </div>
      </div>
      <div class='table'
           :class="{'empty-table':(empty !== null) && empty}">
        <div v-if="!$store.state.isMobile"
             class="table-head">
          <div class="column-name">
            <div class="column-check">
              <m-checkbox v-model="checkAll"
                          @change="change"></m-checkbox>
            </div>
            {{$t('trans0108')}}
          </div>
          <div class="column-outside-ip">{{$t('trans0425')}} /
            {{$t('trans0426')}}</div>
          <div class="column-local-ip">{{$t('trans0427')}} /
            {{$t('trans0428')}}</div>
          <div class="column-protocol">{{$t('trans0408')}}</div>
          <div class="column-status">{{$t('trans0190')}}</div>
          <div class="column-handle">
            <div class="btn-wrap"
                 :class="{open:mobileSelect}">
              <button class="btn btn-small"
                      @click="mulDel"
                      :disabled="!hasChecked">{{$t('trans0033')}}</button>
              <button class="btn btn-small"
                      @click="add">{{$t('trans0035')}}</button>
            </div>
          </div>
        </div>
        <div class="table-body">
          <div class="table-row"
               :class="{'open':item.open}"
               v-for="(item,index ) in portfws"
               :key='index'>
            <div class="column-name"
                 @click.stop="item.open=!item.open">
              <div class="column-check"
                   :class="{'checkOpen':mobileShowHead}">
                <m-checkbox v-model='item.checked'
                            @click.native='stopDefault($event)'></m-checkbox>
              </div>
              <span class="name"
                    :title="item.name">{{item.name}}</span>
            </div>
            <div class="column-outside-ip">
              <p>
                <label class="m-title with-colon">{{$t('trans0425')}}:</label>
                <span>{{item.remote.ip === '0.0.0.0' ? $t('trans0109') : item.remote.ip}}</span>
              </p>
              <span v-if="!$store.state.isMobile"
                    style="margin:0 3px">/</span>
              <p>
                <label class="m-title with-colon">{{$t('trans0426')}}:</label>
                <span>{{item.remote.port.from}}-{{item.remote.port.to}}</span>
              </p>
            </div>
            <div class="column-local-ip">
              <p>
                <label class="m-title with-colon">{{$t('trans0427')}}:</label>
                <span>{{item.local.ip}}</span>
              </p>
              <span v-if="!$store.state.isMobile"
                    style="margin:0 3px">/</span>
              <p>
                <label class="m-title with-colon">{{$t('trans0428')}}:</label>
                <span>{{item.local.port.from}}-{{item.local.port.to}}</span>
              </p>
            </div>
            <div class="column-protocol">
              <label class="m-title with-colon">{{$t('trans0408')}}:</label>
              <span>{{item.protocol}}</span>
            </div>
            <div class="column-status">
              <m-switch v-model="item.enabled"
                        @change="(v)=>update(v,item)"></m-switch>
            </div>
            <div class="column-handle">
              <span class="btn-icon"
                    @click="editHandle(item)">
                <i class=" iconfont icon-ic_settings_normal"></i>
                <span class="icon-hover-popover"> {{$t('trans0034')}}</span>
              </span>
              <span v-if="$store.state.isMobile"
                    class="label"
                    @click="editHandle(item)">
                {{$t('trans0034')}}
              </span>
              <span class="btn-icon"
                    @click="del([item.id])">
                <i class=" iconfont icon-ic_trash_normal"></i>
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
               v-if="(empty !== null) && empty">
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
      handler(nv) {
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
    add() {
      if (this.portfws.length <= 20) {
        this.$router.push('/advance/portforwarding/form');
      } else {
        this.$toast(this.$t('trans0060'));
      }
    },
    getList() {
      this.$loading.open();
      this.$http
        .meshPortfwGet()
        .then(res => {
          this.$loading.close();
          this.portfws = res.data.result.map(v => ({ ...v, checked: false, open: false }));

          if (this.portfws.length > 0) {
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
      this.$store.modules = { ...this.$store.modules, portfw: item };
      this.$router.push(`/advance/portforwarding/form/${item.id}`);
    },
    update(v, item) {
      this.$loading.open();
      this.$http
        .meshPortfwUpdate({ ...item, enabled: item.enabled })
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
        this.mobileShowHead = false;
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
    stopDefault(e) {
      e.stopPropagation();
    }
  }
};
</script>
<style lang="scss" scoped>
.table {
  width: 100%;
  font-size: 12px;
  .table-head {
    height: 50px;
    color: var(--text-gery-color);
    background-color: var(--table-row-background-color);
    display: flex;
    padding: 0 15px;
    justify-content: space-between;
    border-radius: 10px;
    margin-bottom: 5px;
    div {
      display: flex;
      height: 50px;
      align-items: center;
    }
  }
  .table-body {
    div {
      display: flex;
      align-items: center;
    }
    .column-outside-ip,
    .column-local-ip {
      align-items: flex-start;
      flex-wrap: wrap;
    }
    .table-row {
      color: var(--text-default-color);
      font-weight: 600;
      display: flex;
      padding: 15px;
      justify-content: space-between;
      background: var(--table-row-background-color);
      border-radius: 10px;
      margin-bottom: 5px;
      .m-title {
        display: none;
      }
    }
  }
  .column-check {
    margin-right: 10px;
  }
  .column-name {
    display: flex;
    width: 120px;
    .name {
      display: inline-block;
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .column-local-ip {
    width: 180px;
    p {
      padding: 0;
      margin: 0;
      // &:first-child {
      //   margin-bottom: 8px;
      // }
    }
  }
  .column-local-port {
    width: 100px;
  }
  .column-outside-ip {
    width: 190px;
    @media screen and (min-width: 1441px) {
      width: 215px;
    }
    p {
      padding: 0;
      margin: 0;
      &:first-child {
        margin-bottom: 8px;
      }
    }
  }
  .column-outside-port {
    width: 100px;
  }
  .column-protocol {
    width: 50px;
  }
  .column-status {
    width: 50px;
  }
  .column-handle {
    width: 190px;
    justify-content: flex-end;
    font-weight: 400;
    .btn-wrap {
      .btn {
        &:first-child {
          margin-right: 10px;
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .page-content {
    padding-top: 10px;
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
          width: 60px;
          min-width: 60px;
          &:first-child {
            margin-right: 5px;
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
    font-size: 14px;
    .table-body {
      .table-row {
        font-weight: 400;
        .m-title {
          display: inline-block;
        }
        flex-direction: row;
        flex-wrap: wrap;
        padding: 10px;
        position: relative;
        .column-local-ip,
        .column-outside-ip,
        .column-outside-port,
        .column-protocol {
          display: none;
          width: 100%;
          justify-content: space-between;
          margin-bottom: 8px;
          color: var(--text-gery-color);
          > p {
            padding: 10px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid var(--table-body-hr-color);
          }
        }
        .column-protocol {
          border-bottom: 1px solid var(--table-body-hr-color);
          padding: 10px;
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
          padding: 10px 65px 10px 10px;
          color: var(--text-default-color);
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
        .column-status {
          position: absolute;
          text-align: right;
          right: 20px;
          top: 18px;
          display: flex;
          justify-content: flex-end;
        }
        &.open {
          .column-local-ip,
          .column-outside-ip,
          .column-outside-port,
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
