<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class='page-header'>
      {{$t('trans0561')}}
    </div>
    <div class="page-content">
      <m-form ref="form"
              class='form'
              :model="form"
              :rules='rules'>
        <m-form-item class="item"
                     prop='password'>
          <m-input :label="$t('trans0113')"
                   type='password'
                   :placeholder="`${$t('trans0321')}`"
                   v-model="form.password"></m-input>
        </m-form-item>
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
import { isValidPassword } from 'base/util/util';

export default {
  data() {
    return {
      form: {
        password: ''
      },
      rules: {
        password: [
          {
            rule: value => isValidPassword(value),
            message: this.$t('trans0169')
          }
        ]
      }
    };
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
}
.form-button {
  margin-top: 0;
  padding-top: 25px;
  border-top: 1px solid var(--hr-color);
}
</style>
