<template>
  <div class="setting-safe-container">
    <div class="content">
      <div class='w-header'>
        {{$t('trans0067')}}
      </div>
      <div class='form'>
        <m-form ref="form" :model="form" :rules='rules'>
          <m-form-item class="item" prop='new_password'>
            <m-input :label="$t('trans0113')" type='password' :placeholder="`${$t('trans0321')}`" v-model="form.admin_password"></m-input>
          </m-form-item>
        </m-form>
        <div class="btn-info">
          <button class="btn" @click="submit()">{{$t('trans0081')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Form from '../../../component/form/index.vue';
import FormItem from '../../../component/formItem/index.vue';
import Input from '../../../component/input/input.vue';

export default {
  components: {
    'm-input': Input,
    'm-form-item': FormItem,
    'm-form': Form
  },
  data() {
    return {
      form: {
        admin_password: ''
      },
      rules: {
        admin_password: [
          { rule: value => !/\s/g.test(value), message: this.$t('trans0228') },
          {
            rule: value => /^[a-zA-Z0-9\W_]{8,24}$/g.test(value),
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
            this.$dialog.info({});
            this.$reconnect({
              onsuccess: () => {
                // clearInterval(timer);
                // this.$router.push({ path: '/login' });
              },
              ontimeout: () => {
                this.$router.push({ path: '/disappear' });
              },
              onprogress: percent => {
                console.log(percent);
              }
            });
            console.log(res);
          })
          .catch(err => {
            if (err && err.error) {
              this.$toast(this.$t(err.error.code));
            } else {
              this.$toast(this.$t('trans0039'));
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
      .item {
        // margin-bottom: 20px;
      }

      .btn-info {
        display: block;
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

