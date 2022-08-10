<template>
  <div class="initialization-container">
    <div class="checklist">
      <div class="checklist-img">
        <img src="../../../assets/images/img_checklist.png"
             alt="">
      </div>
      <div class="checklist-tips">
        <p>{{'Please prepare the following tools and accessories before installation:'}}</p>
      </div>
      <div class="checklist-container">
        <ul>
          <li>- 1*Homeway {{currentRouter}}</li>
          <li>- 1*Phillips screwdriver</li>
          <li>- 1*test pencil</li>
          <li>- 1*Insulation tape</li>
          <li>- 1*Insulated Gloves</li>
        </ul>
      </div>
      <div class="btn-container">
        <button @click="prepared(currentRouter)"
                class="btn">OK, Well prepared</button>
      </div>

    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { HomewayModel } from '../../../../../base/src/util/constant';

export default {
  data() {
    return {
      HomewayModel,
      modelVersion: null,
      currentRouter: null,
    };
  },
  mounted() {
    this.getRouter();
  },
  methods: {
    getRouter() {
      this.$http.getRouter()
        .then(res => {
          console.log('routerMeta@@@', res);
          this.modelVersion = res.data.result.sn.slice(9, 10);
          console.log('modelVersion', this.modelVersion);
        })
        .then(() => {
          switch (this.modelVersion) {
            case this.HomewayModel.homeway_230v:
              this.currentRouter = '230v';
              break;
            case this.HomewayModel.homgway_PoE_1:
              this.currentRouter = 'PoE';
              break;
            case this.HomewayModel.homeway_PoE_2:
              this.currentRouter = 'PoE';
              break;
            default:
              break;
          }
        });
      // axios({
      //   methods: 'get',
      //   url: 'http://127.0.0.1:4523/mock/1010011/getRouterInfo?id=1'
      // })
      //   .then(res => {
      //     console.log('routerMeta@@@', res);
      //     this.modelVersion = res.data.result.sn.slice(9, 10);
      //     console.log('modelVersion', this.modelVersion);
      //   })
      //   .then(() => {
      //     switch (this.modelVersion) {
      //       case this.routerModel.m6a:
      //         break;
      //       case this.routerModel.homeway_230v:
      //         this.currentRouter = '230v';
      //         break;
      //       case this.routerModel.homgway_PoE_1:
      //         this.currentRouter = 'PoE';
      //         break;
      //       case this.routerModel.homeway_PoE_2:
      //         this.currentRouter = 'PoE';
      //         break;
      //       default:
      //         break;
      //     }
      //   });
    },
    prepared(router) {
      console.log(this.$router);
      router === '230v' ? this.$router.push({ name: 'wifiSetting_230v' }) : this.$router.push({ name: 'wifiSetting' });
    }
  }
};
</script>
<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 14px;
}
.initialization-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: auto;
  background: #fff;
  .checklist {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 350px;
    margin: 0 auto;
    > div {
      margin-bottom: 30px;
    }
    > :nth-child(3) {
      margin-bottom: 40px;
    }
    .checklist-img {
      width: 220px;
      height: 220px;
      > img {
        width: inherit;
        height: inherit;
      }
    }
    .checklist-tips {
      width: inherit;
      > p {
        font-size: 14px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: center;
        padding: 0 7px;
        color: #333;
      }
    }
    .checklist-container {
      width: inherit;
      background: #f1f1f1;
      padding: 10px 0 10px 15px;
      border-radius: 5px;
      overflow: hidden;
      > ul {
        > li {
          list-style-type: none;
          line-height: 25px;
        }
      }
    }
    .btn-container {
      width: inherit;
      > .btn {
        font-size: 16px;
      }
    }
  }
}
@media screen and(max-width: 768px) {
  .initialization-container {
    // margin-top: 20px;
    > .checklist {
      width: 335px;
      .checklist-img {
        width: 185px;
        height: 185px;
      }
    }
  }
}
</style>
