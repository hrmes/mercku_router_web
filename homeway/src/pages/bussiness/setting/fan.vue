<template>
  <div class="page">
    <div class="page-header">{{$t('trans1094')}}</div>
    <div class="page-content">
      <m-form class="flex-form">
        <m-form-item>
          <m-radio-card-group v-model="mode"
                              :options='modeArr'
                              direction=vertical></m-radio-card-group>
        </m-form-item>
        <m-form-item>
          <p class="tips">{{$t('trans1095')}}</p>
        </m-form-item>
        <m-form-item>
          <button class="btn primary"
                  v-defaultbutton
                  style="width:100%"
                  @click="updateMode">{{$t('trans0081')}}</button>
        </m-form-item>
      </m-form>
    </div>
  </div>
</template>

<script>
import { HomewayFanModel } from '../../../../../base/src/util/constant';

function getFanModeImg(model) {
  let imgObj = null;
  switch (model) {
    case HomewayFanModel.game:
      imgObj = {
        unselected: require('../../../assets/images/icon/ic_fan_game.png'),
        selected: require('../../../assets/images/icon/ic_fan_game_selected.png')
      };
      break;
    case HomewayFanModel.standard:
      imgObj = {
        unselected: require('../../../assets/images/icon/ic_fan_standard.png'),
        selected: require('../../../assets/images/icon/ic_fan_standard_selected.png')
      };
      break;
    case HomewayFanModel.sleep:
      imgObj = {
        unselected: require('../../../assets/images/icon/ic_fan_sleep.png'),
        selected: require('../../../assets/images/icon/ic_fan_sleep_selected.png')
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
      mode: '',
      modeArr: [
        { value: 'game', text: this.$t('trans1088'), description: this.$t('trans1091'), img: getFanModeImg('game') },
        { value: 'standard', text: this.$t('trans1089'), description: this.$t('trans1092'), img: getFanModeImg('standard') },
        { value: 'sleep', text: this.$t('trans1090'), description: this.$t('trans1093'), img: getFanModeImg('sleep') }]
    };
  },
  mounted() {
    this.getFanMode();
  },
  methods: {
    getFanMode() {
      this.$loading.open();
      this.$http.getMeshFanMode()
        .then(res => {
          const { data: { result: { mode } } } = res;
          this.mode = mode;
        })
        .finally(() => {
          this.$loading.close();
        });
    },
    updateMode() {
      const params = { mode: this.mode };
      this.$http.updateMeshFanMode(params)
        .then(() => {
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .catch(() => {
          this.$toast(this.$t('trans0077'), 3000, 'error');
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.flex-form {
  width: 340px;
}
.tips {
  color: #999999;
  font-size: 14px;
}

@media screen and (max-width: 760px) {
  .flex-form {
    width: 100%;
  }
}
</style>
