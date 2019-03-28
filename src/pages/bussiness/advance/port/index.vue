<template>
  <div class="page">
    <div class='page-header'
         :class="{'m-head':mobileShowHead}">
      <span class="title"> {{$t('trans0422')}}</span>
      <div class="m-handle">
        <div class="m-check-box">
          <m-checkbox v-model="checkAll"
                      :onChange="change"></m-checkbox>
          <span>{{$t('trans0032')}}</span>
        </div>
        <div class="m-head-btn-wrap">
          <button class="btn m-btn-default "
                  @click="mulDel"
                  :disabled="!hasChecked">{{$t('trans0453')}}</button>
          <span @click="()=>mobileShowHead=!mobileShowHead">{{$t('trans0025')}}</span>
        </div>
      </div>
    </div>
    <div class="page-content">
      <div class='table'
           :class="{'empty-table':(empty !== null) && empty}">
        <div class="handle-info"
             :class="{'openInfo':mobileShowHead}"
             v-clickoutside="()=>mobileSelect=false">
          <div class="select"
               @click="()=>mobileSelect=!mobileSelect">{{$t('trans0370')}}
            <i>
              <img :class="{open:mobileSelect}"
                   src="../../../../assets/images/icon/ic_arrow_pack_up.png"
                   alt=""></i>
          </div>
          <div class="btn-wrap"
               :class="{open:mobileSelect}">
            <button class="btn btn-small"
                    @click="add">{{$t('trans0035')}}</button>
            <button class="btn m-btn btn-small"
                    @click="()=>{mobileShowHead=!mobileShowHead;mobileSelect=!mobileSelect}">
              {{$t('trans0453')}}
            </button>
            <button class="btn  btn-small"
                    @click="mulDel"
                    :disabled="!hasChecked">{{$t('trans0453')}}</button>
          </div>
        </div>

        <div class="table-head">
          <div class="column-name">
            <div class="column-check">
              <m-checkbox v-model="checkAll"
                          :onChange="change"></m-checkbox>
            </div>
            {{$t('trans0108')}}
          </div>
          <div class="column-outside-ip">{{$t('trans0425')}} /
            {{$t('trans0426')}}</div>
          <div class="column-local-ip">{{$t('trans0427')}} /
            {{$t('trans0428')}}</div>
          <div class="column-protocol">{{$t('trans0408')}}</div>
          <div class="column-status">{{$t('trans0190')}}</div>
          <div class="column-handle">{{$t('trans0370')}}</div>
        </div>
        <div class="table-body">
          <div class="table-row"
               v-for="(item,index ) in portfws"
               :key='index'>
            <div class="column-name">
              <div class="column-check"
                   :class="{'checkOpen':mobileShowHead}">
                <m-checkbox v-model='item.checked'></m-checkbox>
              </div>
              <span class="m-title">{{$t('trans0108')}}：</span>
              <span class="name">{{item.name}}</span>
            </div>
            <div class="column-outside-ip">
              <p> <span class="m-title">{{$t('trans0425')}}：</span>{{
                item.remote.ip==='0.0.0.0'?$t('trans0109'):item.remote.ip}}</p>
              <p>
                <span class="m-title">{{$t('trans0426')}}：</span>
                {{item.remote.port.from}}-{{item.remote.port.to}}
              </p>
            </div>
            <div class="column-local-ip">
              <p><span class="m-title">{{$t('trans0427')}}：</span>{{item.local.ip}}</p>
              <p>
                <span class="m-title">{{$t('trans0428')}}：</span>
                {{item.local.port.from}}-{{item.local.port.to}}
              </p>
            </div>
            <div class="column-protocol">
              <span class="m-title">{{$t('trans0408')}}：</span>
              {{item.protocol}}
            </div>
            <div class="column-status">
              <m-switch v-model="item.enabled"
                        :onChange="(v)=>update(v,item)"></m-switch>
            </div>
            <div class="column-handle">
              <a @click="editHandle(item)">{{$t('trans0034')}}</a>
              <a @click="del([item.id])">{{$t('trans0033')}}</a>
            </div>

          </div>
          <div class="empty"
               v-if="(empty !== null) && empty">
            <img src="../../../../assets/images/img_default_empty.png"
                 alt="">
            <p>{{$t('trans0278')}}</p>
            <button class="btn"
                    @click="add">{{$t('trans0035')}}</button>
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
          this.portfws = res.data.result.map(v => ({ ...v, checked: false }));

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
      .m-btn {
        display: none;
      }
      .btn {
        &:last-child {
          margin-left: 20px;
        }
      }
    }
  }
  .column-check {
    width: 40px;
  }
  .column-name {
    display: flex;
    width: 220px;

    .name {
      display: inline-block;
      width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .column-local-ip {
    width: 200px;
    // flex-direction: column;
    p {
      padding: 0;
      margin: 0;
      &:first-child {
        margin-bottom: 8px;
      }
    }
  }
  .column-local-port {
    width: 100px;
  }
  .column-outside-ip {
    // flex-direction: column;
    p {
      padding: 0;
      margin: 0;
      &:first-child {
        margin-bottom: 8px;
      }
    }
    width: 200px;
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
    width: 120px;
    a {
      cursor: pointer;
      text-decoration: underline;
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
    div {
      display: flex;
      align-items: center;
    }
    .column-outside-ip,
    .column-local-ip {
      flex-direction: column;
      align-items: flex-start;
    }
    .table-row {
      display: flex;
      padding: 15px 30px;
      border-bottom: 1px solid #f1f1f1;
      justify-content: space-between;
      .m-title {
        display: none;
      }
    }
  }
}
@media screen and (max-width: 768px) {
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
          border-radius: 2px;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
          border: solid 1px #f1f1f1;
          background-color: #ffffff;
          position: absolute;
          top: 30px;
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
        &:first-child {
          padding-top: 0;
          .column-status {
            top: 0;
          }
        }
        .m-title {
          display: inline-block;
        }
        flex-direction: row;
        flex-wrap: wrap;
        padding: 0;
        padding-bottom: 20px;
        padding-top: 20px;
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
          justify-content: flex-end;
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
          display: flex;
          justify-content: flex-end;
        }
      }
    }
    .table-head {
      display: none;
    }
  }
}
</style>
