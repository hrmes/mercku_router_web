<template>
  <div class="page">
    <div class='page-header'>
      {{$t('trans0076')}}
    </div>
    <div class="page-content">
      <div class="handle">
        <label for="">{{$t('trans0462')}}</label>
        <m-switch :onChange="changehandle"
                  v-model="mode" />
      </div>
      <div class='table'>
        <div class="tools">
          <button class="btn btn-primary"
                  @click.stop="modalOpen('add')">{{$t('trans0035')}}</button>
        </div>
        <div class="table-head">
          <div class="column-address">{{$t('trans0076')}}
            <span>{{$t('trans0101')}}</span>
          </div>
          <div class="column-handle">{{$t('trans0370')}}</div>
        </div>
        <div class="table-body">
          <div class="table-row"
               v-for="(row,index) in sortList"
               :key='index'>
            <div class="column-address">{{row}}</div>
            <div class="column-handle">
              <a @click="delRow(row)">{{$t('trans0033')}}</a>
            </div>
          </div>
          <div class="empty"
               v-if="isEmpty">
            <img src="../../../../assets/images/img_default_empty.png"
                 alt="">
            <p class="empty-text">{{$t('trans0278')}}</p>
          </div>
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
          <button v-if="modalStatus==='add'"
                  class="btn"
                  @click="submit">{{$t('trans0035')}}</button>
          <button v-if="modalStatus==='edit'"
                  class="btn"
                  @click="updateSubmit">{{$t('trans0081')}}</button>
        </div>
      </div>
    </m-modal>
  </div>
</template>
<script>
import { hostRexp, isIP, getStringByte } from 'util/util';
import { BlacklistMode } from 'util/constant';

export default {
  data() {
    return {
      BlacklistMode,
      modalStatus: 'add',
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
    sortList() {
      const list = this.parentControlLimitList;
      return list.sort();
    },
    isEmpty() {
      return !this.sortList.length;
    }
  },
  mounted() {
    this.form.mac = this.$route.params.mac;
    const { blacklist } = this.$store.state.limits;
    if (blacklist && blacklist.parent_control) {
      const parentControl = blacklist.parent_control;
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
    modalOpen(type, row) {
      if (this.parentControlLimitList.length === 15) {
        this.$toast(this.$t('trans0060'));
        return;
      }
      this.host = '';
      this.form.hosts = [];
      this.modalStatus = type;
      this.selectedRow = row;
      if (type === 'edit') {
        this.form.hosts = [row];
        this.host = row;
      }
      this.modalShow = true;
    },
    getList() {
      this.$http.parentControlLimitGet({ mac: this.form.mac }).then(res => {
        if (res.data.result) {
          this.parentControlLimitList = res.data.result.blacklist || [];
          this.mode = res.data.result.mode === BlacklistMode.blacklist;
          this.form.mode = res.data.result.mode;
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
          this.parentControlLimitList = this.parentControlLimitList.filter(
            v => v !== row
          );
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
    height: 218px;
    border-radius: 5px;
    background-color: #ffffff;
    padding: 30px;
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
.page-content {
  display: flex;
  flex-direction: column;
}
.handle {
  display: flex;
  align-items: center;
  align-self: flex-start;
  label {
    padding: 0 30px 0 10px;
  }
}
.table {
  width: 100%;

  .tools {
    margin-bottom: 20px;
  }
  margin-top: 30px;
  .column-handle {
    width: 250px;
  }
  .column-address {
    span {
      padding-left: 20px;
      font-size: 12px;
      color: #999999;
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
      .column-handle {
        display: flex;
        align-items: center;
        a {
          margin-right: 50px;
          cursor: pointer;
          font-size: 14px;
          &:hover {
            text-decoration: underline;
          }
          &:last-child {
            color: #ff0001;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .modal {
    .modal-content {
      width: 295px;
      height: 229px;
    }
  }
  .handle {
    display: flex;
    align-items: center;
    margin-top: 20px;
    label {
      padding: 0 30px 0 0px;
    }
  }
  .table {
    margin-top: 20px;
    .table-body {
      .table-row {
        flex-direction: row;
        padding: 20px 0;
        position: relative;
      }
    }
    .column-address {
      width: 200px;
      overflow: height;
    }
    .column-handle {
      width: 100%;
      justify-content: flex-end;
      // margin-top: 20px;
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
</style>
