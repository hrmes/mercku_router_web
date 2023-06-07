<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class='page-header'>
      {{$t('trans1168')}}
    </div>
    <div class="page-content">
      <m-form ref="form"
              class='form'>
        <m-form-item class="item">
          <h4>{{$t('trans1168')}}</h4>
          <p class="form__tips">{{$t('trans1169')}}</p>
        </m-form-item>
        <m-form-item class="item">
          <m-select :label="$t('trans1170')"
                    v-model="wpsBand"
                    :options="bandList"></m-select>
          <p class="form__tips">{{$t('trans1171')}}</p>
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
import { debounce } from 'base/util/util';

export default {
  data() {
    return {
      wpsBand: '2.4g',
      bandList: [
        { value: '2.4g', text: this.$t('trans0677') },
        { value: '5g', text: this.$t('trans0679') }
      ]
    };
  },
  methods: {
    submit: debounce(function updateWps() {
      this.$loading.open();
      this.$http
        .updateMeshWps({ band: this.wpsBand })
        .then(() => {
           this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .finally(() => {
          this.$loading.close();
        });
    }, 500)
  }
};
</script>
<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  h4 {
    margin: 0;
    padding: 0;
  }
}
.form-button {
  margin-top: 0;
}
</style>
