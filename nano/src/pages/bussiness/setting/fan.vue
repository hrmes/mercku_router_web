<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class='page-header'>
      {{$t('trans1222')}}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card">
            <m-form-item class="last">
              <h4> {{$t('trans1222')}}</h4>
              <p class="des-tips">{{$t('trans1223')}}</p>
            </m-form-item>
          </div>
        </div>
        <div class="row-2">
          <div class="card">
            <m-form-item class="last">
              <m-radio-card-group v-model="mode"
                                  :options="modesList"
                                  direction="vertical"></m-radio-card-group>
            </m-form-item>
          </div>
        </div>
      </div>
      <div class="page-content__bottom">
        <div class="form-button__wrapper">
          <button class="btn"
                  v-defaultbutton
                  @click="submit">{{$t('trans0081')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { debounce } from 'base/util/util';
import fanGameIcon from '@/assets/images/icon/ic_fan_game.svg';
import fanSleepIcon from '@/assets/images/icon/ic_fan_sleep.svg';

const FanMode = {
  game: 'game',
  sleep: 'sleep'
};
function getFanModeImg(model) {
  let imgObj = null;
  switch (model) {
    case FanMode.game:
      imgObj = {
        unselected: fanGameIcon,
        selected: fanGameIcon
      };
      break;
    case FanMode.sleep:
      imgObj = {
        unselected: fanSleepIcon,
        selected: fanSleepIcon
      };
      break;
    default:
      break;
  }
  return imgObj;
}

export default {
  data() {
    return {
      mode: FanMode.sleep,
      modesList: [
        { value: FanMode.game, text: this.$t('trans1224'), img: getFanModeImg(FanMode.game) },
        { value: FanMode.sleep, text: this.$t('trans1225'), img: getFanModeImg(FanMode.sleep) }
      ]
    };
  },
  mounted() {
    this.getMeshFanMode();
  },
  methods: {
    async getMeshFanMode() {
      try {
        this.$loading.open();
        const response = await this.$http.getMeshFanMode();
        const {
          data: {
            result: { mode }
          }
        } = response;
        this.mode = mode;
      } catch (error) {
        console.error(error);
      }
    },
    submit: debounce(function updateMeshFanMode() {
      console.log(this.mode);
      this.$loading.open();
      this.$http
        .updateMeshFanMode({ mode: this.mode })
        .then(() => {
          this.$toast(this.$t('trans0040'), 3000, 'success');
        });
    }, 500)
  }
};
</script>
<style lang="scss" scoped>
h4 {
  margin: 0;
  padding: 0;
}
</style>
