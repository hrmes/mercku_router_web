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
            <div class="checkbox">
              <m-checkbox v-model="checkAll"
                          @change="change"></m-checkbox>
            </div>
            <div class="name">
              {{$t('trans0108')}}
            </div>
            <div class="mac">{{$t('trans0188')}}</div>
            <div class="ip">{{$t('trans0151')}}</div>
            <div class="operator">
              <div class="btn-wrap"
                   :class="{open:mobileSelect}">
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
                 :class="{'open':item.open}"
                 v-for="(item,index ) in rsvdips"
                 :key="index">
              <div class="checkbox">
                <m-checkbox v-model="item.checked"
                            @click.native='stopDefault($event)'></m-checkbox>
              </div>
              <div class="name"
                   :title="item.name"
                   @click.stop="item.open=!item.open">
                <span class="name">{{item.name}}</span>
              </div>
              <div class="mac">
                <label class="m-title with-colon"
                       v-if="isMobile">{{$t('trans0188')}}:</label>
                <span>{{formatMac(item.mac)}}</span>
              </div>
              <div class="ip">
                <label class="m-title with-colon"
                       v-if="isMobile">{{$t('trans0151')}}:</label>
                <span>{{item.ip}}</span>
              </div>
              <div class="operator">
                <span class="limit-icon"
                      @click="editHandle(item)">
                  <i class="iconfont icon-ic_settings_normal"></i>
                  <span class="hover-popover"> {{$t('trans0034')}}</span>
                </span>
                <span class="limit-icon"
                      @click="del([item.id])">
                  <i class="iconfont icon-ic_trash_normal"></i>
                  <span class="hover-popover"> {{$t('trans0033')}}</span>
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
      <transition name="fade">
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

const ScrollPage = document.querySelector('.scrollbar-wrap');

export default {
  components: {
    rsvdipForm
  },
  data() {
    return {
      formatMac,
      mobileSelect: false,
      mobileShowHead: false,
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
      if (!this.isMobile) {
        return true;
      }
      return !this.showForm;
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
        this.isEdit = false;
        if (this.isMobile) {
          ScrollPage.scrollTop = 0;
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
  grid-template-columns: 30px 1fr 1fr 1fr 1fr;
}
.table-body {
  .table-row {
    grid-template-columns: 30px 1fr 1fr 1fr 1fr;
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
  .reboot-info {
    font-size: 12px;
    width: auto;
    border-radius: 10px;
    margin-bottom: 5px;
    &.extra {
      background: var(--table-row-background-color);
      padding: 10px;
    }
  }
}
</style>
