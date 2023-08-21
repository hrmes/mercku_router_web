<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class='page-header'>
      {{$t('trans0561')}}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card">
            <m-form ref="form"
                    class='form'
                    :model="form"
                    :rules='rules'>
              <m-form-item class="last"
                           prop='password'
                           :errorMsgIsStatic="true">
                <m-input :label="$t('trans0113')"
                         type='password'
                         :placeholder="`${$t('trans0321')}`"
                         v-model="form.password"></m-input>
              </m-form-item>
            </m-form>
          </div>
        </div>
      </div>
      <div class="page-content__bottom">
        <div class="form-button__wrapper">
          <button class="btn"
                  v-defaultbutton
                  @click="submit()">{{$t('trans0081')}}</button>
        </div>
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
@media screen and (max-width: 768px) {
  .page {
    .page-content {
      .page-content__main {
        flex: none;
      }
    }
  }
}
</style>
