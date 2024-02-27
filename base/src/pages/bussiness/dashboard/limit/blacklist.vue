<template>
  <div class="urllimit">
    <!--  -->
    <div class='url-table'
         :class="{'table--empty':!sortList.length}">
      <div class="table-head">
        <div class="handle">
          <m-switch :label="$t('trans0462')"
                    @change="changehandle"
                    v-model="mode" />
        </div>
        <div class="tools">
          <button class="btn btn-small"
                  @click.stop="modalOpen()">{{$t('trans0035')}}</button>
        </div>
      </div>
      <div class="table-body">
        <div class="table-row"
             v-for="(row,index) in sortList"
             :key='index'>
          <div class="column-address">{{row}}</div>
          <div class="column-handle">
            <span class="limit-icon"
                  @click="delRow(row)">
              <i class="delete iconfont ic_trash"></i>
              <span class="hover-popover"> {{$t('trans0033')}}</span>
            </span>
          </div>
        </div>
        <div class="empty"
             v-if="isEmpty">
          <img :src="require('base/assets/images/common/img_default_empty.png')">
          <p class="empty-text">{{$t('trans0278')}}</p>
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
          this.$toast(this.$t('trans0040'), 2000, 'success');
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
          this.parentControlLimitList = this.parentControlLimitList.filter(
            v => v !== row
          );
          if (this.blacklistLimit && this.blacklistLimit.parent_control) {
            this.blacklistLimit.parent_control.blacklist =
              this.parentControlLimitList;
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
            this.$toast(this.$t('trans0040'), 2000, 'success');
            this.blacklistLimit.parent_control.blacklist =
              this.parentControlLimitList;
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
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: 30px;
    .btn-default {
      background-image: linear-gradient(
          to right,
          var(--modal_content-bgc),
          var(--modal_content-bgc)
        ),
        var(--common_btn_default-bgimg) !important;
    }
  }
  .modal-content {
    border-radius: 5px;
    background-color: var(--modal_content-bgc);
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
  min-height: 400px;
  position: relative;
  .url-table {
    width: 100%;
    .table-head {
      height: 50px;
      background-color: var(--common_sub_card-bgc);
      display: grid;
      grid-template-rows: 100%;
      grid-template-columns: repeat(2, 1fr);
      padding: 0 10px;
      border-radius: 10px;
      margin-bottom: 5px;
      > div {
        display: flex;
        align-items: center;
      }
      .handle {
        justify-content: flex-start;
        color: var(--common_gery-color);
      }
      .tools {
        justify-content: flex-end;
        .btn {
          margin: 0;
        }
      }
    }
    .table-body {
      .table-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        padding: 0 10px;
        border-radius: 10px;
        margin-bottom: 5px;
        background: var(--common_sub_card-bgc);
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
    min-height: unset;
  }
}
</style>
