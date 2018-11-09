<template>
  <div class="setting-safe-container">
    <div class="content">
      <div class='w-header'>
        {{$t('trans0067')}}
      </div>
      <m-form ref="form" class='form' :model="form" :rules='rules'>
        <m-form-item class="item" prop='password'>
          <m-input :label="$t('trans0113')" type='password' :placeholder="`${$t('trans0321')}`" v-model="form.password"></m-input>
        </m-form-item>
        <div class="btn-info">
          <button class="btn" @click="submit()">{{$t('trans0081')}}</button>
        </div>
      </m-form>
    </div>
    <div class="content">
      <div class='w-header'>
        {{$t('trans0424')}}
      </div>
      <div class="switch-container">
        <div class="item">
          <label for="">{{$t('trans0424')}}</label>
          <m-switch v-model="wan.dos"></m-switch>
        </div>
        <div class="item">
          <label for="">{{$t('trans0434')}}</label>
          <m-switch v-model="wan.ping"></m-switch>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { passwordRule } from '../../../../util/util';

export default {
  data() {
    return {
      wan: {
        dos: false,
        ping: false
      },
      form: {
        password: ''
      },
      rules: {
        password: [
          {
            rule: value => passwordRule.test(value),
            message: this.$t('trans0169')
          }
        ]
      }
    };
  },
  mounted() {
    this.getFirewall();
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$loading.open();
        this.$http
          .updateAdmin(this.form)
          .then(() => {
            this.$loading.close();
            this.$router.push({ path: '/login' });
          })
          .catch(err => {
            if (err.upgrading) {
              return;
            }
            this.$loading.close();
            if (err && err.error) {
              this.$toast(this.$t(err.error.code));
            } else {
              this.$router.push({ path: '/unconnect' });
            }
          });
      }
    },
    getFirewall() {
      console.log(this.$http.getFirewall());
      this.$http
        .getFirewall()
        .then(res => {
          this.wan = res.data.result.wan;
        })
        .catch(() => {
          console.log('...');
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.setting-safe-container {
  position: relative;
  flex: auto;
  padding: 0 2%;
  display: flex;
  flex-direction: column;
  .content {
    border-radius: 8px;
    padding: 0 20px;
    background: white;
    position: relative;
    flex: 1;
    margin-bottom: 30px;
    &:last-child {
      margin-bottom: 0;
    }
    .w-header {
      height: 60px;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      color: #333333;
      line-height: 60px;
      font-weight: bold;
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
    .switch-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      .item {
        margin-top: 30px;
        display: flex;
        align-items: center;
        label {
          width: 200px;
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .setting-safe-container {
    padding: 20px 16px;
    .content {
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
      .form {
        width: 100%;
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

