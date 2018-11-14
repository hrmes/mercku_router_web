<template>
  <div class="page">
    <div class='page-header'>
      {{$t('trans0418')}}
    </div>
    <div class="page-content">
      <m-form ref="form" class='form' :model="ddns" :rules='rules'>
        <div class="form-item">
          <label for="">{{$t('trans0435')}}</label>
          <m-radio-group v-model="ddns.service" :options="services"></m-radio-group>
        </div>
        <m-form-item class="item" prop='domain'>
          <m-input :label="$t('trans0436')" :placeholder="`${$t('trans0321')}`" v-model="ddns.domain"></m-input>
        </m-form-item>
        <m-form-item class="item" prop='username'>
          <m-input :label="$t('trans0410')" :placeholder="`${$t('trans0321')}`" v-model="ddns.username"></m-input>
        </m-form-item>
        <m-form-item class="item" prop='password'>
          <m-input :label="$t('trans0003')" :placeholder="`${$t('trans0321')}`" v-model="ddns.password"></m-input>
        </m-form-item>
        <div class="form-item">
          <m-checkbox v-model="ddns.enabled" :text="$t('trans0369')"></m-checkbox>
        </div>
        <div class="form-item">
          <button class="btn" @click="submit()">{{$t('trans0081')}}</button>
        </div>
      </m-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ddns: {
        domain: '',
        username: '',
        password: '',
        service: '',
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
        ip: [
          {
            // rule: value => isIP(value),
            // message: this.$t('trans0231')
          }
        ]
      }
    };
  },
  mounted() {
    this.getDMZ();
  },
  methods: {
    getDMZ() {
      this.$http.getDMZ().then(res => {
        this.dmz = res.data.result;
      });
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$loading.open();
        this.$http
          .updateDMZ(this.dmz)
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
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .btn-wrapper {
    display: block;
    text-align: center !important;
  }
  .checkbox-wrapper {
    margin-bottom: 30px;
    width: 350px;
  }
}
@media screen and (max-width: 768px) {
  .form {
    .checkbox-wrapper {
      width: 100%;
    }
  }
}
</style>

