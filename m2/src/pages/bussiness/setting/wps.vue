<template>
  <div class="page wps">
    <div class="page-header">
      {{$t('trans0794')}}
    </div>
    <div class="page-content">
      <!-- <label class="wps__label">{{$t('trans0792')}}</label> -->
      <button class="btn"
              :disabled="started"
              @click="start()">{{btnText}}</button>
    </div>

  </div>
</template>

<script>
const WPS_DURATION = 120;
export default {
  data() {
    return {
      started: false,
      duration: WPS_DURATION
    };
  },
  computed: {
    btnText() {
      if (this.started) {
        return `${this.$t('trans0792')} (${this.duration})`;
      }
      return this.$t('trans0792');
    }
  },
  methods: {
    start() {
      if (!this.started) {
        this.$http.startWPS().then(() => {
          this.started = true;
          this.timer = setInterval(() => {
            this.duration -= 1;
            if (this.duration <= 0) {
              this.started = false;
              this.duration = WPS_DURATION;
              clearInterval(this.timer);
            }
          }, 1000);
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.page-content {
  .wps__label {
    width: 340px;
    text-align: left;
    display: block;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }
}
</style>
