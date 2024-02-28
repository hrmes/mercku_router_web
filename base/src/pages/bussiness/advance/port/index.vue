<template>
  <div class="page">
    <div v-if="isMobile"
         class='page-header'>
      <span class="title">{{$t('trans0422')}}</span>
    </div>
    <div class="page-content">
      <div class="page-content__main"
           v-if="isShowList">
        <div class='table'
             :class="{'empty-table':(empty !== null) && empty}">
          <div class="table-header">
            <div class="wrapper">
              <div class="checkbox">
                <m-checkbox v-model="checkAll"
                            @change="change"></m-checkbox>
              </div>
              <div class="status"
                   v-if="!isMobile">{{$t('trans0190')}}</div>
              <div class="name">
                {{$t('trans0108')}}
              </div>
            </div>
            <div class="outside-ip"
                 v-if="!isMobile">
              {{$t('trans0425')}} / {{$t('trans0426')}}
            </div>
            <div class="local-ip"
                 v-if="!isMobile">
              {{$t('trans0427')}} / {{$t('trans0428')}}
            </div>
            <div class="protocol"
                 v-if="!isMobile">{{$t('trans0408')}}</div>
            <div class="operator">
              <div class="btn-wrap">
                <button class="btn btn-small"
                        @click="mulDel"
                        :disabled="!hasChecked">{{$t('trans0453')}}</button>
                <button class="btn btn-small"
                        @click="add">{{$t('trans0035')}}</button>
              </div>
            </div>
          </div>
          <div class="table-body">
            <div class="table-row"
                 :class="{'close':!item.open}"
                 v-for="(item,index ) in portfws"
                 :key='index'>
              <div class="wrapper">
                <div class="checkbox">
                  <m-checkbox v-model='item.checked'
                              @click.native='stopDefault($event)'></m-checkbox>
                </div>
                <div class="status">
                  <m-switch v-model="item.enabled"
                            @change="(v)=>update(v,item)"></m-switch>
                </div>
                <div class="name"
                     @click="clickWrapper(item)">
                  <span class="name"
                        :title="item.name">{{item.name}}</span>
                </div>
              </div>
              <div class="outside-ip">
                <p>
                  <label class="m-title with-colon"
                         v-if="isMobile">{{$t('trans0425')}}:</label>
                  <span>{{item.remote.ip === '0.0.0.0'||item.remote.ip==='' ? $t('trans0109') : item.remote.ip}}</span>
                </p>
                <span v-if="!isMobile"
                      style="margin:0 3px">/</span>
                <p>
                  <label class="m-title with-colon"
                         v-if="isMobile">{{$t('trans0426')}}:</label>
                  <span>{{item.remote.port.from}}-{{item.remote.port.to}}</span>
                </p>
              </div>
              <div class="local-ip">
                <p>
                  <label class="m-title with-colon"
                         v-if="isMobile">{{$t('trans0427')}}:</label>
                  <span>{{item.local.ip}}</span>
                </p>
                <span v-if="!isMobile"
                      style="margin:0 3px">/</span>
                <p>
                  <label class="m-title with-colon"
                         v-if="isMobile">{{$t('trans0428')}}:</label>
                  <span>{{item.local.port.from}}-{{item.local.port.to}}</span>
                </p>
              </div>
              <div class="protocol">
                <label class="m-title with-colon"
                       v-if="isMobile">{{$t('trans0408')}}:</label>
                <span>{{item.protocol}}</span>
              </div>
              <div class="operator">
                <span class="limit-icon"
                      @click="editHandle(item)">
                  <i class=" iconfont ic_settings"></i>
                  <span class="hover-popover"> {{$t('trans0034')}}</span>
                </span>
                <span class="limit-icon"
                      @click="del([item.id])">
                  <i class=" iconfont ic_trash"></i>
                  <span class="hover-popover"> {{$t('trans0033')}}</span>
                </span>
              </div>
            </div>
            <div class="empty"
                 v-if="(empty !== null) && empty">
              <img :src="require('base/assets/images/common/img_default_empty.png')" />
              <p>{{$t('trans0278')}}</p>
            </div>
          </div>
        </div>
      </div>
      <transition name="fade"
                  :css="!isMobile">
        <portForwardForm v-if="isShowForm"
                         :isEdit="isEdit"
                         @closeForm="closeForm"
                         @refreshList="getList"></portForwardForm>
      </transition>
    </div>
  </div>
</template>
<script>
import portForwardForm from './form.vue';

export default {
  components: {
    portForwardForm
  },
  data() {
    return {
      ScrollPage: document.querySelector('.scrollbar-wrap'),
      empty: null,
      checkAll: false,
      portfws: [],
      checkedArr: [],
      isShowForm: false,
      isEdit: false
    };
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    },
    hasChecked() {
      return this.portfws.some(i => i.checked);
    },
    isShowList() {
      return !this.isMobile || !this.isShowForm;
    }
  },
  watch: {
    portfws: {
      handler(nv) {
        this.checkAll = nv.length > 0 && nv.every(v => v.checked);
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
        this.isEdit = false;
        if (this.isMobile) {
          this.ScrollPage.scrollTop = 0;
        }
        this.isShowForm = true;
      } else {
        this.$toast(this.$t('trans0060'));
      }
    },
    getList() {
      this.$loading.open();
      this.$http
        .meshPortfwGet()
        .then(res => {
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
        .finally(() => {
          this.$loading.close();
        });
    },
    editHandle(item) {
      this.$store.state.modules = {
        ...this.$store.state.modules,
        portfw: item
      };
      this.isEdit = true;
      if (this.isMobile) {
        this.ScrollPage.scrollTop = 0;
      }
      this.isShowForm = true;
    },
    update(v, item) {
      this.$loading.open();
      this.$http
        .meshPortfwUpdate({ ...item, enabled: item.enabled })
        .then(() => {
          this.$loading.close();
          this.$toast(this.$t('trans0040'), 2000, 'success');
        })
        .catch(() => {
          this.$loading.close();
          this.getList();
        });
    },
    change(v) {
      this.portfws.forEach(item => {
        item.checked = v;
      });
    },
    filterList(ids) {
      this.portfws = this.portfws.filter(item => !ids.includes(item.id));
      this.empty = this.portfws.length === 0;
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
                this.$toast(this.$t('trans0040'), 2000, 'success');
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
    },
    clickWrapper(item) {
      if (this.isMobile) {
        item.open = !item.open;
      }
    },
    closeForm() {
      this.isShowForm = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.table {
  width: 100%;
  .table-header {
    grid-template-columns: 2fr 1.5fr 1.5fr 100px 1.2fr;
    div {
      display: flex;
      align-items: center;
    }
    .wrapper {
      display: grid;
      grid-template-rows: 100%;
      grid-template-columns: 30px 80px 1fr;
      gap: 10px;
    }
  }
  .table-body {
    .table-row {
      grid-template-columns: 2fr 1.5fr 1.5fr 100px 1.2fr;
      font-size: 13px;
      div {
        display: flex;
        align-items: center;
      }
      .wrapper {
        display: grid;
        grid-template-rows: 100%;
        grid-template-columns: 30px 80px 1fr;
        gap: 10px;
      }
    }
  }
  .name {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .operator {
    justify-content: flex-end;
    button {
      margin-left: 15px;
      &:first-child {
        margin: 0;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .page {
    .page-content {
      position: relative;
    }
    .page-content__main {
      padding-bottom: 20px;
    }
  }

  .table {
    .table-header {
      grid-template-columns: 1fr 2fr;
      .wrapper {
        grid-template-columns: 30px 1fr;
        gap: 0;
      }
      .operator {
        .btn {
          width: auto;
          min-width: auto;
        }
      }
    }
    .table-body {
      .table-row {
        grid-template-rows: 1fr 2fr 2fr 1fr 1fr;
        grid-template-columns: 100%;
        font-weight: 400;
        color: var(--common_gery-color);
        > div {
          height: 50px;
          border-bottom: 1px solid var(--hr-color);
          &:last-child {
            border: none;
            padding: 0;
          }
        }
        .wrapper {
          grid-template-columns: 30px 2fr 0.7fr;
          grid-template-areas: 'checkbox name status';
          gap: 0;
          .checkbox {
            grid-area: checkbox;
          }
          .name {
            grid-area: name;
            color: var(--text_default-color);
            height: 100%;
            > span {
              line-height: 50px;
              max-width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .status {
            grid-area: status;
            position: relative;
            &::after {
              content: '\e6c2';
              font-family: 'iconfont';
              position: absolute;
              top: 50%;
              right: 0;
              transform: translateY(-50%) rotate(90deg);
              font-size: 12px;
              transition: transform 0.3s;
              color: var(--text_default-color);
            }
          }
        }
        .outside-ip,
        .local-ip {
          display: grid;
          height: 100px;
          grid-template-rows: repeat(2, 1fr);
          > p {
            display: flex;
            justify-content: space-between;
            margin: 0;
          }
        }
        .protocol {
          justify-content: space-between;
        }
        &.close {
          grid-template-rows: 100%;
          .wrapper {
            padding-bottom: 0;
            border-color: transparent;
            .status {
              &::after {
                transform: translateY(-50%) rotate(0deg);
              }
            }
          }
          .outside-ip,
          .local-ip,
          .protocol,
          .operator {
            display: none;
          }
        }
      }
    }
  }
}
</style>
