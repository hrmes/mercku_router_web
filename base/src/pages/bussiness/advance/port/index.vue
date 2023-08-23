<template>
  <div class="page">
    <div v-if="isMobile"
         class='page-header'>
      <span class="title">{{$t('trans0422')}}</span>
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <!-- <div v-if="$store.state.isMobile"
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
        </div> -->
        <div class='table'
             :class="{'empty-table':(empty !== null) && empty}">
          <div class="table-header">
            <div class="checkbox">
              <m-checkbox v-model="checkAll"
                          @change="change"></m-checkbox>
            </div>
            <div class="status">{{$t('trans0190')}}</div>
            <div class="name">
              {{$t('trans0108')}}
            </div>
            <div class="outside-ip">
              {{$t('trans0425')}} / {{$t('trans0426')}}
            </div>
            <div class="local-ip">
              {{$t('trans0427')}} / {{$t('trans0428')}}
            </div>
            <div class="protocol">{{$t('trans0408')}}</div>
            <div class="operator">
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
              <div class="checkbox"
                   :class="{'checkOpen':mobileShowHead}">
                <m-checkbox v-model='item.checked'
                            @click.native='stopDefault($event)'></m-checkbox>
              </div>
              <div class="status">
                <m-switch v-model="item.enabled"
                          @change="(v)=>update(v,item)"></m-switch>
              </div>
              <div class="name"
                   @click.stop="item.open=!item.open">
                <span class="name"
                      :title="item.name">{{item.name}}</span>
              </div>
              <div class="outside-ip">
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
              <div class="local-ip">
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
              <div class="protocol">
                <label class="m-title with-colon">{{$t('trans0408')}}:</label>
                <span>{{item.protocol}}</span>
              </div>
              <div class="operator">
                <span class="limit-icon"
                      @click="editHandle(item)">
                  <i class=" iconfont icon-ic_settings_normal"></i>
                  <span class="hover-popover"> {{$t('trans0034')}}</span>
                </span>
                <span class="limit-icon"
                      @click="del([item.id])">
                  <i class=" iconfont icon-ic_trash_normal"></i>
                  <span class="hover-popover"> {{$t('trans0033')}}</span>
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
    isMobile() {
      return this.$store.state.isMobile;
    },
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
          this.portfws = res.data.result.map(v => ({
            ...v,
            checked: false,
            open: false
          }));

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
      this.$store.state.modules = {
        ...this.$store.state.modules,
        portfw: item
      };
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
  .table-header {
    grid-template-columns: 30px 80px 1fr 1.5fr 1.5fr 100px 1.2fr;
    div {
      display: flex;
      align-items: center;
    }
  }
  .table-body {
    .table-row {
      display: grid;
      grid-template-rows: 100%;
      grid-template-columns: 30px 80px 1fr 1.5fr 1.5fr 100px 1.2fr;
      gap: 10px;
      padding: 10px 15px;
      margin-bottom: 5px;
      align-items: center;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-default-color);
      background: var(--table-row-background-color);
      border-radius: 10px;
      div {
        display: flex;
        align-items: center;
      }
      .m-title {
        display: none;
      }
    }
  }
  .name {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .operator {
    justify-content: flex-end;
    .btn-icon {
      width: 40px;
      height: 40px;
      font-weight: 400;
      background: transparent;
      margin-left: 15px;
      &:first-child {
        margin: 0;
      }
    }
    button {
      margin-left: 15px;
      &:first-child {
        margin: 0;
      }
    }
  }
}
@media screen and (max-width: 768px) {
}
</style>
