<template>
  <div class="page">
    <div v-if="isMobile"
         class="page-header">
      {{$t('trans0444')}}
    </div>
    <div class="page-content">
      <div class="page-content__main"
           v-if="isShowList">
        <p class="reboot-info"
           :class="{'extra':empty!==null && !empty}">
          {{$t('trans0496')}}
          <span class="btn-text text-primary"
                @click="updateEnabled">{{$t('trans0488')}}</span>
        </p>
        <div class="table"
             :class="{'empty-table':empty!==null && empty}">
          <div class="table-header">
            <div class="wrapper">
              <div class="checkbox">
                <m-checkbox v-model="checkAll"
                            @change="change"></m-checkbox>
              </div>
              <div class="name">
                {{$t('trans0108')}}
              </div>
            </div>
            <div class="mac"
                 v-if="!isMobile">{{$t('trans0188')}}</div>
            <div class="ip"
                 v-if="!isMobile">{{$t('trans0151')}}</div>
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
                 v-for="(item,index ) in rsvdips"
                 :key="index">
              <div class="wrapper">
                <div class="checkbox">
                  <m-checkbox v-model="item.checked"
                              @click.native='stopDefault($event)'></m-checkbox>
                </div>
                <div class="name"
                     :title="item.name"
                     @click.stop="item.open=!item.open">
                  <span class="name">{{item.name}}</span>
                </div>
              </div>

              <div class="mac">
                <label class="m-title with-colon"
                       v-if="isMobile">{{$t('trans0188')}}</label>
                <span>{{formatMac(item.mac)}}</span>
              </div>
              <div class="ip">
                <label class="m-title with-colon"
                       v-if="isMobile">{{$t('trans0151')}}</label>
                <span>{{item.ip}}</span>
              </div>
              <div class="operator">
                <span class="limit-icon"
                      @click="editHandle(item)">
                  <i class="iconfont ic_settings"></i>
                  <span class="hover-popover"> {{$t('trans0034')}}</span>
                </span>
                <span class="limit-icon"
                      @click="del([item.id])">
                  <i class="iconfont ic_trash"></i>
                  <span class="hover-popover"> {{$t('trans0033')}}</span>
                </span>
              </div>
            </div>
            <div class="empty"
                 v-if="empty!==null && empty">
              <img src="../../../../assets/images/img_default_empty.png"
                   alt="">
              <p>{{$t('trans0278')}}</p>
            </div>
          </div>
        </div>
      </div>
      <transition name="fade"
                  :css="!isMobile">
        <rsvdipForm v-if="isShowForm"
                    :isEdit="isEdit"
                    @closeForm="closeForm"
                    @refreshList="getList"></rsvdipForm>
      </transition>
    </div>
  </div>
</template>
<script>
import { formatMac } from 'base/util/util';
import rsvdipForm from './form.vue';

export default {
  components: {
    rsvdipForm
  },
  data() {
    return {
      ScrollPage: document.querySelector('.scrollbar-wrap'),
      formatMac,
      empty: null,
      checkAll: false,
      reverseCheck: false,
      rsvdips: [],
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
      return this.rsvdips.some(i => i.checked);
    },
    isShowList() {
      return !this.isMobile || !this.isShowForm;
    }
  },
  watch: {
    rsvdips: {
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
          this.rsvdips = res.data.result.map(v => ({
            ...v,
            checked: false,
            open: false
          }));
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
      this.$store.state.modules = {
        ...this.$store.state.modules,
        rsvdip: item
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
        .meshRsvdipUpdate({ ...item, enabled: v })
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
      this.rsvdips.forEach(item => {
        item.checked = v;
      });
    },
    filterList(ids) {
      this.rsvdips = this.rsvdips.filter(item => !ids.includes(item.id));
      this.empty = this.rsvdips.length === 0;
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
      if (this.rsvdips.length < 20) {
        this.isEdit = false;
        if (this.isMobile) {
          this.ScrollPage.scrollTop = 0;
        }
        this.isShowForm = true;
      } else {
        this.$toast(this.$t('trans0060'));
      }
    },
    stopDefault(e) {
      e.stopPropagation();
    },
    closeForm() {
      this.isShowForm = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.table-header {
  grid-template-columns: 1fr 1fr 1fr 1fr;
  .wrapper {
    grid-template-columns: 30px 1fr;
    gap: 10px;
  }
}
.table-body {
  .table-row {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    .wrapper {
      grid-template-columns: 30px 1fr;
      gap: 10px;
    }
  }
}
.checkbox {
  display: flex;
  align-items: center;
}
.name {
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.operator {
  display: flex;
  justify-content: flex-end;
  .btn-wrap {
    display: flex;
  }
  button {
    margin-left: 20px;
    &:first-child {
      margin: 0;
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
  .table-header {
    grid-template-columns: 1fr 2fr;
    .operator {
      .btn {
        width: auto;
        min-width: auto;
      }
    }
  }
  .table-body {
    .table-row {
      grid-template-rows: repeat(4, 1fr);
      grid-template-columns: 100%;
      font-size: 13px;
      font-weight: 400;
      color: var(--common_gery-color);
      > div {
        display: flex;
        align-items: center;
        height: 50px;
        border-bottom: 1px solid var(--hr-color);
        &:last-child {
          border: none;
          padding: 0;
        }
      }
      .wrapper {
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
      .name {
        font-size: 14px;
        color: var(--text_default-color);
      }
      .mac,
      .ip {
        justify-content: space-between;
      }
      &.close {
        grid-template-rows: 100%;
        .wrapper {
          padding-bottom: 0;
          border-color: transparent;
          &::after {
            transform: translateY(-50%) rotate(0deg);
          }
        }
        .mac,
        .ip,
        .operator {
          display: none;
        }
      }
    }
  }

  .reboot-info {
    font-size: 12px;
    width: auto;
    border-radius: 10px;
    margin-bottom: 5px;
    &.extra {
      background: var(--table_row-bgc);
      padding: 10px;
    }
  }
}
</style>
