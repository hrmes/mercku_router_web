<template>
  <div class="wlan-container">
    <div class="step">
      <m-step :steps="steps" :current="current"></m-step>
    </div>
    <div class="step-content">
      <div v-if="current===0">
        <label for="">
          <span>{{}}</span>
        </label>
      </div>
      <div v-if="current===1">2</div>
      <div v-if="current===2">3</div>
    </div>
    <div class="button-container">
      <button class="btn">{{$t('trans0055')}}</button>
    </div>
  </div>

</template>
<script>
import mStep from '../../../component/step/index.vue';

export default {
  components: {
    mStep
  },
  data() {
    return {
      current: 0
    };
  },
  computed: {
    steps() {
      return [this.$t('trans0167'), this.$t('trans0295'), this.$t('trans0296')];
    }
  }
};
</script>
<style lang="scss" scoped>
.wlan-container {
  position: absolute;
  top: 60px;
  width: 100%;
  bottom: 0;
  background: #fff;
  .step {
    margin-top: 50px;
    text-align: center;
  }
}
@media screen and(max-width: 768px) {
  .wlan-container {
    position: static;
    overflow: hidden;
  }
}
</style>
