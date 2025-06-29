<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class='page-header'>
      {{$t('trans0418')}}
    </div>
    <div class="page-content">
      <m-form ref="form"
              class='form'
              :model="ddns"
              :rules='rules'>
        <div class="form-item">
          <label style="font-weight:bold;">{{$t('trans0435')}}</label>
          <m-radio-group v-model="ddns.service"
                         class="radio-group"
                         direction='vertical'
                         :options="services"></m-radio-group>
        </div>
        <m-form-item class="item"
                     prop='domain'>
          <m-input :label="$t('trans0436')"
                   :placeholder="`${$t('trans0321')}`"
                   v-model="ddns.domain"></m-input>
        </m-form-item>
        <m-form-item class="item"
                     prop='username'>
          <m-input :label="$t('trans0410')"
                   :placeholder="`${$t('trans0321')}`"
                   v-model="ddns.username"></m-input>
        </m-form-item>
        <m-form-item class="item"
                     prop='password'>
          <m-input :label="$t('trans0003')"
                   type="password"
                   :placeholder="`${$t('trans0321')}`"
                   v-model="ddns.password"></m-input>
        </m-form-item>
        <div class="form-item">
          <m-checkbox v-model="ddns.enabled"
                      :text="$t('trans0462')"></m-checkbox>
        </div>
      </m-form>
      <div class="form-button">
        <button class="btn"
                v-defaultbutton
                @click="submit()">{{$t('trans0081')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { isValidPassword, getStringByte } from 'base/util/util';

export default {
  data() {
    return {
      ddns: {
        domain: '',
        username: '',
        password: '',
        service: 'dyndns',
        enabled: true
      },
      services: [
        {
          text: this.$t('trans0437'),
          value: 'dyndns'
        },
        {
          text: this.$t('trans0438'),
          value: 'oray'
        }
      ],
      rules: {
        domain: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          },
          {
            rule: value => getStringByte(value) <= 64,
            message: this.$t('trans0228')
          }
        ],
        username: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          },
          {
            rule: value => getStringByte(value) <= 64,
            message: this.$t('trans0261')
          }
        ],
        password: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          },
          {
            rule: value => isValidPassword(value, 1, 64),
            message: this.$t('trans0125').format(1, 64)
          }
        ]
      }
    };
  },
  mounted() {
    this.getDDNS();
  },
  methods: {
    getDDNS() {
      this.$loading.open();
      this.$http
        .getDDNS()
        .then(res => {
          this.$loading.close();
          this.ddns = res.data.result;
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$loading.open();
        this.$http
          .updateDDNS(this.ddns)
          .then(() => {
            this.$loading.close();
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
.form {
  display: flex;
  flex-direction: column;
  .form-item {
    &:first-child {
      label {
        margin-bottom: 20px;
      }
      .radio-group {
        width: fit-content;
      }
      width: fit-content;
      display: flex;
      flex-direction: column;
    }
    &:nth-last-child(2) {
      display: flex;
      justify-content: flex-start;
      width: 100%;
    }
  }
}
.form-button {
  margin-top: 0;
  padding-top: 25px;
  border-top: 1px solid var(--hr-color);
}
@media screen and (max-width: 768px) {
  .form-item {
    &:first-child {
      display: flex;
      flex-direction: column;
      label {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
