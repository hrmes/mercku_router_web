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
              <m-radio-card-group v-model="wanInterface"
                                  :options="interfaceList"
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

const InterfaceType = {
  RJ45: 'RJ45',
  SFP: 'SFP'
};
function getAccessModeImg(model) {
  let imgObj = null;
  switch (model) {
    case InterfaceType.RJ45:
      imgObj = {
        unselected: wanIcon,
        selected: wanIcon
      };
      break;
    case InterfaceType.SFP:
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
      wanInterface: InterfaceType.RJ45,
      interfaceList: [
        { value: InterfaceType.RJ45, text: this.$t('trans1247'), img: getAccessModeImg(InterfaceType.RJ45) },
        { value: InterfaceType.SFP, text: this.$t('trans1248'), img: getAccessModeImg(InterfaceType.SFP) }]
    };
  },
  mounted() {
    this.getMeshWanIntf();
  },
  methods: {
    getMeshWanIntf() {
      this.$loading.open();
      this.$http.getMeshWanIntf()
        .then(res => {
          this.wanInterface = res.data.result.interface;
        })
        .finally(() => {
          this.$loading.close();
        });
    },
    submit: debounce(function updateMeshWanIntf() {
      console.log(this.wanInterface);
      this.$loading.open();
      this.$http
        .updateMeshWanIntf({ interface: this.wanInterface })
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
