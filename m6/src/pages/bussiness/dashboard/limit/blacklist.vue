<template>

  <div class="urllimit">
    <div class="handle">
      <m-switch @change="changehandle"
                v-model="mode" />
      <label for="">{{$t('trans0462')}}</label>
    </div>
    <div class='table'
         :class="{'table--empty':!sortList.length}">
      <div v-if="!isMobile"
           class="tools">
        <button class="btn btn-small"
                @click.stop="modalOpen()">{{$t('trans0035')}}</button>
      </div>
      <div class="table-head">
        <div class="column-address">{{$t('trans0076')}}
          <span>({{$t('trans0101')}})</span>
        </div>
      </div>
      <div class="table-body">
        <div class="table-row"
             v-for="(row,index) in sortList"
             :key='index'>
          <div class="column-address">{{row}}</div>
          <div class="column-handle">
            <span class="btn-icon"
                  @click="delRow(row)">
              <i class="delete iconfont icon-ic_trash_normal"></i>
              <span class="icon-hover-popover"> {{$t('trans0033')}}</span>
            </span>
          </div>
        </div>
        <div class="empty"
             v-if="isEmpty">
          <img src="@/assets/images/img_default_empty.webp"
               alt="">
          <p class="empty-text">{{$t('trans0278')}}</p>
        </div>
        <div v-if="isMobile"
             class="mobile-add-btn">
          <button class="btn"
                  @click.stop="modalOpen()">{{$t('trans0035')}}</button>
        </div>
      </div>
    </div>

    <m-modal class="modal"
             :visible.sync="modalShow">
      <div class="modal-content">
        <div class="modal-form">
          <m-form ref="form"
                  class='form'
                  :model="{host}"
                  :rules='rules'>
            <m-form-item class="item"
                         prop='host'>
              <m-input class='small'
                       :label="$t('trans0076')"
                       type='text'
                       :placeholder="`${$t('trans0321')}`"
                       v-model="host"></m-input>
            </m-form-item>
          </m-form>
        </div>
        <div class="btn-info">
          <button class="btn btn-default"
                  @click="closeModal">{{$t('trans0025')}}</button>
          <button class="btn"
                  @click="submit">{{$t('trans0035')}}</button>
        </div>
      </div>
    </m-modal>
  </div>
</template>
<script>
import { hostRexp, isIP, getStringByte } from 'base/util/util';
import { BlacklistMode } from 'base/util/constant';

export default {
  data() {
    return {
      BlacklistMode,
      selectedRow: {},
      disabled: true,
      modalShow: false,
      mode: false,
      parentControlLimitList: [],
      host: '',
      form: {
        mac: '',
        hosts: [],
        mode: BlacklistMode.blacklist
      },
      rules: {
        host: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => hostRexp(value) || isIP(value),
            message: this.$t('trans0227')
          },
          {
            rule: value => getStringByte(value) <= 30,
            message: this.$t('trans0226')
          }
        ]
      }
    };
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    },
    sortList() {
      const list = this.parentControlLimitList;
      return list.sort();
    },
    isEmpty() {
      return !this.sortList.length;
    },
    blacklistLimit() {
      return this.$store.state.modules.limits[this.form.mac];
    }
  },
  mounted() {
    this.form.mac = this.$route.params.mac;
    if (this.blacklistLimit && this.blacklistLimit.parent_control) {
      const parentControl = this.blacklistLimit.parent_control;
      this.form.mode = parentControl.mode;
      this.mode = parentControl.mode === BlacklistMode.blacklist;
      this.parentControlLimitList = parentControl.blacklist || [];
    } else {
      this.getList();
    }
  },
  methods: {
    closeModal() {
      this.modalShow = false;
    },
    clearForm() {
      this.form = {
        ...this.form,
        hosts: []
      };
      this.host = '';
    },
    modalOpen(row) {
      if (this.parentControlLimitList.length === 15) {
        this.$toast(this.$t('trans0060'));
        return;
      }
      this.host = '';
      this.form.hosts = [];
      this.selectedRow = row;
      this.modalShow = true;
    },
    getList() {
      this.$http.parentControlLimitGet({ mac: this.form.mac }).then(res => {
        if (res.data.result) {
          this.parentControlLimitList = res.data.result.blacklist || [];
          this.form.mode = res.data.result.mode;
          this.mode = this.form.mode === BlacklistMode.blacklist;
        }
      });
    },
    changehandle(v) {
      this.$loading.open();
      const changeMode = v ? BlacklistMode.blacklist : BlacklistMode.free;
      this.$http
        .parentControlLimitUpdate({
          mac: this.form.mac,
          mode: changeMode
        })
        .then(() => {
          this.form.mode = changeMode;
          if (this.blacklistLimit && this.blacklistLimit.parent_control) {
            this.blacklistLimit.parent_control.mode = this.form.mode;
          }
          this.$loading.close();
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .catch(() => {
          this.mode = !v;
          this.$loading.close();
        });
    },
    delRow(row) {
      this.$loading.open();
      this.$http
        .parentControlLimitDel({
          mac: this.form.mac,
          hosts: [row]
        })
        .then(() => {
          this.parentControlLimitList = this.parentControlLimitList.filter(v => v !== row);
          if (this.blacklistLimit && this.blacklistLimit.parent_control) {
            this.blacklistLimit.parent_control.blacklist = this.parentControlLimitList;
          }
          this.$loading.close();
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$loading.open();
        this.$http
          .parentControlLimitAdd({
            mac: this.form.mac,
            hosts: [this.host]
          })
          .then(() => {
            this.parentControlLimitList.push(this.host);
            this.$loading.close();
            this.modalShow = false;
            this.$toast(this.$t('trans0040'), 3000, 'success');
            this.blacklistLimit.parent_control.blacklist = this.parentControlLimitList;
          })
          .catch(() => {
            this.$loading.close();
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.modal {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1001;
  display: flex;
  justify-content: center;
  align-items: center;
  .btn-info {
    display: flex;
    margin-top: 50px;
    justify-content: center;
    .btn {
      width: 120px;
      height: 42px;
      &:last-child {
        margin-left: 30px;
      }
    }
  }
  .modal-content {
    width: 330px;
    border-radius: 5px;
    background-color: var(--modal-content-background);
    .item {
      display: flex;
      align-items: center;
      margin-top: 30px;
      &:first-child {
        margin: 0;
      }
      &:last-child {
        align-items: flex-start;
      }
      label {
        width: 70px;
        font-size: 14px;
        color: #333333;
        overflow: hidden;
      }
      .date-wrap {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        width: 320px;
        .check-inner {
          width: 80px;
          margin-bottom: 12px;
        }
      }
    }
  }
}
.urllimit {
  width: 100%;
  position: relative;
  .handle {
    position: absolute;
    display: flex;
    align-items: center;
    label {
      margin-left: 10px;
      font-weight: 600;
    }
  }
  .table {
    width: 100%;
    .tools {
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    .column-address {
      span {
        padding-left: 10px;
        font-size: 12px;
        color: #999999;
      }
    }
    .table-head {
      height: 50px;
      background-color: var(--table-row-background-color);
      display: flex;
      padding: 0 20px;
      border-radius: 10px;
      margin-bottom: 5px;
      justify-content: space-between;
      color: var(--table-header-text-color);
      div {
        display: flex;
        height: 50px;
        align-items: center;
      }
    }
    .table-body {
      .table-row {
        display: flex;
        padding: 20px 20px;
        justify-content: space-between;
        border-radius: 10px;
        margin-bottom: 5px;
        background: var(--table-row-background-color);
        .column-handle {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .modal {
    .modal-content {
      width: auto;
    }
  }
  .urllimit {
    padding: 10px;
    .handle {
      display: flex;
      align-items: center;
      left: 10px;
      top: 10px;
    }
    .table {
      .table-body {
        margin-top: 45px;
        .table-row {
          flex-direction: row;
          padding: 20px 10px;
          position: relative;
        }
        .mobile-add-btn {
          margin-top: 30px;
          padding-top: 30px;
          border-top: 1px solid var(--table-body-hr-color);
        }
      }
      .column-address {
        flex: 1;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .column-handle {
        justify-content: flex-end;
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
</style>
