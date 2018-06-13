<template>
  <layout style="height:100%;">
    <div class="setting-safe-container">
      <div v-if="reboot">
        <m-proress></m-proress>
      </div>
      <div class="content">
        <div class='w-header'>
          {{$t('trans0067')}}
        </div>
        <m-form ref="form" class='form' :model="form" :rules='rules'>
          <m-form-item class="item" prop='admin_password'>
            <m-input :label="$t('trans0113')" type='password' :placeholder="`${$t('trans0321')}`" v-model="form.admin_password"></m-input>
          </m-form-item>
          <div class="btn-info">
            <button class="btn" @click="submit()">{{$t('trans0081')}}</button>
          </div>
        </m-form>
      </div>
    </div>
  </layout>
</template>
<script>
import Form from '../../../component/form/index.vue';
import FormItem from '../../../component/formItem/index.vue';
import Input from '../../../component/input/input.vue';
import Progress from '../../../component/progress/index.vue';
import layout from '../../../layout.vue';

export default {
  components: {
    'm-input': Input,
    'm-form-item': FormItem,
    'm-form': Form,
    'm-proress': Progress,
    layout
  },
  data() {
    return {
      reboot: false,
      form: {
        admin_password: ''
      },
      rules: {
        admin_password: [
          { rule: value => !/\s/g.test(value), message: this.$t('trans0228') },
          {
            rule: value => /^[a-zA-Z0-9]{8,24}$/g.test(value),
            message: this.$t('trans0169')
          }
        ]
      }
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$http
          .update({ wifi: { ...this.form } })
          .then(res => {
            if (res.status === 200) {
              this.reboot = true;
              this.$reconnect({
                onsuccess: () => {
                  this.$router.push({ path: '/home' });
                },
                ontimeout: () => {
                  this.$router.push({ path: '/disappear' });
                }
              });
            }
          })
          .catch(err => {
            if (err && err.error) {
              this.$toast(this.$t(err.error.code));
            } else {
              this.$router.push({ path: '/disappear' });
            }
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.setting-safe-container {
  position: relative;
  padding: 0 30px;
  flex: 1;
  height: 100%;
  .content {
    border-radius: 8px;
    padding: 0 20px;
    background: white;

    position: relative;
    .w-header {
      height: 60px;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      color: #333333;
      line-height: 60px;
      font-weight: 400;
    }
    .form {
      display: flex;
      justify-content: center;
      padding: 30px 0;
      flex-direction: column;
      align-items: center;
      align-items: center;
      .item {
        // margin-bottom: 20px;
      }

      .btn-info {
        display: block;
        text-align: center !important;
      }
      .check-info {
        display: flex;
        align-items: center;
        margin-top: 30px;
        label {
          margin-right: 10px;
          font-size: 16px;
          color: #333333;
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .setting-safe-container {
    padding: 10px;
    .content {
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
      min-height: 450px;
      .form {
        width: 100%;
        // padding: 0 20px;
        .form-item {
          width: 100%;
        }
        .input-info {
          width: 100%;
        }
        .title {
          margin-top: 20px;
          margin-bottom: 10px;
        }
        .check-info {
          display: flex;
          align-items: center;
          margin-top: 20px;
          label {
            margin-right: 10px;
            font-size: 16px;
            color: #333333;
          }
        }
        .btn-info {
          width: 100%;
        }
      }
    }
  }
}
</style>

