<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class='page-header'>
      SFP
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card">
            <m-form-item>
              <m-radio-card-group v-model="mode"
                                  :options="modesList"
                                  direction="vertical"></m-radio-card-group>
            </m-form-item>
            <m-form-item class="last">
              <p class="des-tips">{{$t('trans1250')}}</p>
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
import sfpIcon from '@/assets/images/icon/ic_sfp_sfp.png';
import wanIcon from '@/assets/images/icon/ic_sfp_wan.png';

const AccessMode = {
  wan: 'wan',
  sfp: 'sfp'
};
function getAccessModeImg(model) {
  let imgObj = null;
  switch (model) {
    case AccessMode.wan:
      imgObj = {
        unselected: wanIcon,
        selected: wanIcon
      };
      break;
    case AccessMode.sfp:
      imgObj = {
        unselected: sfpIcon,
        selected: sfpIcon
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
      mode: AccessMode.wan,
      modesList: [
        { value: AccessMode.wan, text: this.$t('trans1247'), img: getAccessModeImg(AccessMode.wan) },
        { value: AccessMode.sfp, text: this.$t('trans1248'), img: getAccessModeImg(AccessMode.sfp) }]
    };
  },
  mounted() {
    this.getMeshAccessMode();
  },
  methods: {
    async getMeshAccessMode() {
      try {
        this.$loading.open();
        const response = await this.$http.getMeshAccessMode();
        const {
          data: {
            result: { mode }
          }
        } = response;
        this.mode = mode;
      } catch (error) {
        console.error(error);
      } finally {
        this.$loading.close();
      }
    },
    submit: debounce(function updateMeshAccessMode() {
      console.log(this.mode);
      this.$loading.open();
      this.$http
        .updateMeshAccessMode({ mode: this.mode })
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
.row-1 {
  .form-item {
    margin-bottom: 15px;
    &.last {
      margin-bottom: 0;
    }
  }
}
</style>
