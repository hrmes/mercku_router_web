<template>
  <layout>
    <div class="mesh-container">
      <div class="content">
        <div class='w-header'>
          {{$t('trans0194')}}
        </div>

        <div class="type-container" v-show="current===-1">
          <div class="tip">{{$t('trans0364')}}</div>
          <div class="router-category-container">
            <div class="router" v-for="(router,index) in routers" :key="index" @click="selectRouter(router)">
              <div class="check-container">
                <div class="checkbox" :class="{'checked':router.selected}"></div>
                <span class="text">{{router.name}}</span>
              </div>
              <img class="img" :src="router.image" alt="">
            </div>
          </div>
          <button class="btn btn-next" @click="step(0)">{{$t('trans0055')}}</button>
        </div>

        <div class="info-container" v-show="current>=0">
          <div class="step">
            <m-step :steps="steps" :current="current"></m-step>
          </div>
          <div class="step-content">
            <div class="step-item step-item0" v-show="current===0">
              <p>{{$t('trans0257')}}</p>
              <p>{{$t('trans0377')}}</p>
              <p>{{$t('trans0378')}}</p>
              <img v-if="routers[1].selected" src="../../../assets/images/img_add_plug_m2.jpg" alt="">
              <img v-if="routers[0].selected" src="../../../assets/images/img_add_plug_bee.jpg" alt="">
              <div class="button-container">
                <button @click="step(-1)" class="btn btn-default ">{{$t('trans0057')}}</button>
                <button @click="step(1)" class="btn">{{$t('trans0055')}}</button>
              </div>

            </div>
            <div class="step-item step-item1" v-show="current===1">
              <div class="scaning" v-show="scaning">
                <img src="../../../assets/images/loading.gif" alt="">
                <p>{{$t('trans0334')}}</p>
              </div>
              <div v-show="!scaning && nodes.length">扫描完成</div>
              <div v-show="!scaning && !nodes.length">没有节点</div>
            </div>
            <div class="step-item step-item2" v-show="current===2">
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="loading" v-if="scaning"></div>
  </layout>
</template>
<script>
import Input from '../../../component/input/input.vue';
import layout from '../../../layout.vue';
import mCheckbox from '../../../component/checkbox/index.vue';
import mStep from '../../../component/step/index.vue';

export default {
  components: {
    layout,
    mCheckbox,
    mStep
  },
  data() {
    return {
      routers: [
        {
          name: 'M2 Bee Wi-Fi Mesh Node',
          image: require('../../../assets/images/img_bee.png'),
          selected: true
        },
        {
          name: 'M2 Standalone Wi-Fi router',
          image: require('../../../assets/images/img_m2.png'),
          selected: false
        }
      ],
      current: -1,
      steps: ['', '', ''],
      scaning: false,
      nodes: []
    };
  },
  mounted() {},
  methods: {
    selectRouter(router) {
      this.routers.forEach(r => (r.selected = false));
      router.selected = true;
    },
    step(index) {
      this.current = index;
      if (this.current === 1) {
        this.scaning = true;
        this.$http.scanMeshNode().then(res => {
          this.nodes = res.data.result;
          this.scaning = false;
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  opacity: 0;
  z-index: 1000;
}
.mesh-container {
  position: relative;
  flex: auto;
  padding: 0 2%;
  display: flex;

  .content {
    border-radius: 8px;
    padding: 0 20px;
    background: white;
    position: relative;
    flex: 1;
    .w-header {
      height: 60px;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      color: #333333;
      line-height: 60px;
      font-weight: 400;
      margin-bottom: 60px;
    }
    .type-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      align-items: center;
      .tip {
        margin-bottom: 30px;
      }
      .router {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 340px;
        height: 140px;
        border-radius: 5px;
        background-color: #f1f1f1;
        margin-bottom: 30px;
        cursor: pointer;
        .check-container {
          display: flex;
          align-items: center;
          align-content: center;
          .text {
            margin-left: 20px;
            display: inline-block;
            font-weight: bold;
            font-size: 14px;
            width: 120px;
          }
          .checkbox {
            width: 18px;
            height: 18px;
            border-radius: 2px;
            border: 1px solid #999;
            border-radius: 50%;
            &.checked {
              background: url(../../../assets/images/ic_selected.png) no-repeat
                center;
              border: none;
              background-size: 90%;
              background-color: #00d061;
            }
          }
        }
        img {
          width: 140px;
          height: 140px;
        }
        .name {
          width: 120px;
          font-weight: bold;
          font-size: 14px;
        }
      }
      .btn-next {
        margin-top: 30px;
        margin-bottom: 30px;
      }
    }
    .info-container {
      width: 564px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .step-item {
        .button-container {
          margin-top: 36px;
          display: flex;
          button {
            display: inline-block;
            flex: 1;
            margin-right: 20px;
            width: 160px;
            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
      .step-item0 {
        p {
          margin: 0;
          text-align: center;
          margin-bottom: 10px;
          &:first-child {
            margin-bottom: 20px;
            font-size: 16px;
          }
        }
        img {
          width: 280px;
          height: 280px;
          display: block;
          margin: 0 auto;
        }
      }
      .step-item1 {
        .scaning {
          margin-top: 150px;
          img {
            display: block;
            margin: 0 auto;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .mesh-container {
    padding: 20px 16px;
    .content {
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
      min-height: 450px;
      .type-container {
        .router {
          width: 300px;
          img {
            width: 120px;
            height: 120px;
          }
        }
        .btn-next {
          width: 300px;
        }
      }
      .info-container {
        width: 100%;
      }
    }
  }
}
@media screen and (width: 320px) {
  .mesh-container {
    .content {
      min-height: 450px;
      .type-container {
        .router {
          width: 250px;
          img {
            width: 80px;
            height: 80px;
          }
        }
        .btn-next {
          width: 250px;
        }
      }
    }
  }
}
</style>

