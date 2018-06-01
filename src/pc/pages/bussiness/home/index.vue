<template>
  <div class="home-container">
    <div class="check-info">
      <div class="row-1">
        <div class="name">Tom's wifi</div>
        <div class="router-icon"><img src="../../../assets/images/ic_router.png" alt=""></div>
      </div>
      <div class='check-status row-2'>
        <div class="check-txt-info">
          <span class='testing' v-if="netStatus==='testing'"> {{$t('trans0298')}}...</span>
        </div>
        <span class="success-line" v-if="netStatus==='connected' || netStatus==='testing'"></span>
        <span class='fail-line' v-if="netStatus==='unlinked'"></span>
        <span class='fail-info' v-if="netStatus==='unlinked'">
          <i class="fail-icon"></i>
        </span>
      </div>
      <div class="row-3">
        <div class="network-icon"><img src="../../../assets/images/ic_internet.png" alt=""></div>
        <div class="speed">
          <span>21.16</span>M
        </div>
      </div>
      <div class="btn-info" v-if="netStatus==='connected'">
        <button class="btn check-btn" @click='testSpeed()'>{{$t('trans0008')}}</button>
      </div>
    </div>
    <div class="router-info">
      <div class="item">
        <div class="title">{{$t('trans0299')}}</div>
        <div class='message'>
          <div class="m-item">
            <label class="m-title">{{$t('trans0187')}}：</label>
            Mercku m1
          </div>
          <div class="m-item">
            <label class="m-title">{{$t('trans0300')}}：</label>
            Mercku 稳定版2.18.15
          </div>
          <div class="m-item">
            <label class="m-title">{{$t('trans0188')}}：</label>
            F0:B4:29:77:59:
          </div>
          <div class="m-item">
            <label class="m-title">{{$t('trans0251')}}:</label>
            6816/02252767
          </div>
        </div>
      </div>
      <div class="item">
        <div class="title">{{$t('trans0301')}}</div>
        <div class='message'>
          <div class="m-item">
            <label class="m-title">{{$t('trans0302')}}：</label>
            Mercku m1
          </div>
          <div class="m-item">
            <label class="m-title">{{$t('trans0151')}}：</label>
            Mercku 稳定版2.18.15
          </div>
          <div class="m-item">
            <label class="m-title">{{$t('trans0152')}}：</label>
            F0:B4:29:77:59:
          </div>
          <div class="m-item">
            <label class="m-title">{{$t('trans0236')}}：</label>
            6816/02252767
          </div>
          <div class="m-item">
            <label class="m-title">{{$t('trans0153')}}：</label>
            6816/02252767
          </div>
        </div>
      </div>
      <div class="item real-time-network">
        <div class="title">{{$t('trans0303')}}</div>
        <div class="content">
          <div class="real-time-info">
            <div class="down">
              <label class="r-title">{{$t('trans0305')}}：</label>
              <i class='r-dwon-icon'></i>
              <span class="speed">0.5</span>
              <span class="unit"> KB/s</span>
            </div>
            <div class='up'>
              <label class="r-title">{{$t('trans0304')}}：</label>
              <i class='r-up-icon'></i>
              <span class="speed">0.7</span>
              <span class="unit"> KB/s</span>
            </div>
          </div>
          <div class="speep-info real-wrap">
            <div class="extra">
              <i class="f-up-icon"></i>
              <div>
                <p>
                  <span class="speed">21.15</span>
                  <span class='unit'> MB/s</span>
                </p>
                <p class="note">{{$t('trans0306')}}</p>
              </div>
            </div>
            <div class="extra">
              <i class="f-down-icon"></i>
              <div>
                <p>
                  <span class="speed">2.15</span>
                  <span class='unit'> MB/s</span>
                </p>
                <p class="note">{{$t('trans0307')}}</p>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div class="item term-flow-info">
        <div class="title">{{$t('trans0308')}}</div>
        <div class="speep-info">
          <div class="extra">
            <i class="t-dwon-icon"></i>
            <div>
              <p>
                <span class="speed">21.15</span>
                <span class='unit'> MB</span>
              </p>
              <p class="note">{{$t('trans0309')}}</p>
            </div>
          </div>
          <div class="extra">
            <i class="t-up-icon"></i>
            <div>
              <p>
                <span class="speed">21.15</span>
                <span class='unit'> MB</span>
              </p>
              <p class="note">{{$t('trans0310')}}</p>
            </div>
          </div>
          <div class="extra">
            <i class="t-count-icon"></i>
            <div>
              <p>
                <span class="speed">8</span>
              </p>
              <p class="note">{{$t('trans0311')}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class='mesh-info'>
      <div class="title">{{$t('trans0312')}}</div>
      <div class="content">
        <div v-for="item in meshStatus" class="mesh" :class="diffMesh(item)">
          <div class="message">
            <img src="../../../assets/images/ic_main_router.png" alt="" v-if='item.main'>
            <img src="../../../assets/images/ic_plug.png" alt="" v-if='!item.main'>
            <span>{{item.name}}</span>
          </div>
          <div class="status">
            <img src="../../../assets/images/ic_plug_bad.png" alt="" v-if='item.status===1'>
            <img src="../../../assets/images/ic_plug_fine.png" alt="" v-if='item.status===2'>
            <img src="../../../assets/images/ic_plug_good.png" alt="" v-if='item.status===3'>
          </div>
        </div>
      </div>
    </div>
    <div class='speed-model-info' v-if='speedModelOpen'>
      <div class="shadow"></div>
      <div class='speed-content'>
        <div v-if="speedStatus==='testing'">
          <div class="test-info"></div>
          <p>{{$t('trans0045')}}...</p>
        </div>
        <div v-if="speedStatus==='completed'" class="speed-completed">
          <div class="speed-result-info">
            <div class="extra">
              <i class="p-dwon-icon"></i>
              <div>
                <p>
                  <span class="speed">21.15</span>
                  <span class='unit'> MB</span>
                </p>
                <p class="note">{{$t('trans0306')}}</p>
              </div>
            </div>
            <div class="extra">
              <i class="p-up-icon"></i>
              <div>
                <p>
                  <span class="speed">21.15</span>
                  <span class='unit'> MB</span>
                </p>
                <p class="note">{{$t('trans0306')}}</p>
              </div>
            </div>
            <div class="extra">
              <i class="p-count-icon"></i>
              <div>
                <p>
                  <span class="speed">21.15</span>
                  <span class='unit'> MB</span>
                </p>
                <p class="note">{{$t('trans0306')}}</p>
              </div>
            </div>
          </div>
          <div class="btn-info">
            <button class="cmp-btn" @click="()=>speedModelOpen=false">{{$t('trans0018')}}</button>
            <button class="re-btn" @click="testSpeed()">{{$t('trans0279')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      netStatus: 'unlinked', // unlinked: 未连网线，linked: 连网线但不通，connected: 外网正常连接
      speedStatus: 'testing',
      speedModelOpen: false,
      routerInfo: {},
      netInfo: {},
      meshStatus: [
        {
          main: true,
          name: '主路由名称过长 该怎么办呢~~~~',
          status: 3
        },
        {
          main: false,
          name: 'bee',
          status: 3
        },

        {
          main: false,
          name: 'bee',
          status: 2
        },

        {
          main: false,
          name: 'bee',
          status: 1
        }
      ]
    };
  },
  mounted() {
    this.testWan();
    this.getRouter();
    this.getNet();
    // this.$loading.open();
  },
  methods: {
    getRouter() {
      this.$http.getRouter().then(res => {
        this.routerInfo = res.data.result;
        console.log(this.routerInfo);
      });
    },
    getNet() {
      this.$http.getNet().then(res => {
        this.netInfo = res.data.result;
        console.log(this.netInfo);
      });
    },
    testWan() {
      this.netStatus = 'testing';
      const timer = setTimeout(() => {
        this.$http
          .testWan()
          .then(res => {
            clearTimeout(timer);
            this.netStatus = res.data.result.status;
          })
          .catch(() => {
            clearTimeout(timer);
            this.netStatus = 'unlinked';
          });
      }, 1000);
    },
    testSpeed() {
      this.speedModelOpen = true;
      this.speedStatus = 'testing';
      setTimeout(() => {
        this.speedStatus = 'completed';
      }, 3000);
    },
    diffMesh(item) {
      let className = '';
      if (item) {
        switch (item.status) {
          case 3:
            className = 'signal-3';
            break;
          case 2:
            className = 'signal-2';
            break;
          case 1:
            className = 'signal-1';
            break;
          default:
            break;
        }
        className = `${className} ${item.main && 'main'}`;
      }
      return className;
    }
  }
};
</script>
<style lang="scss" scoped>
.home-container {
  .speed-model-info {
    .shadow {
      width: 100%;
      height: 100%;
      background: #000;
      opacity: 0.7;
      position: fixed;
      z-index: -1;
    }
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 99999;
    display: flex;
    justify-content: center;
    align-items: center;
    @keyframes speed-testing {
      0% {
        background: url('../../../assets/images/img_test_01.png') no-repeat;
        background-size: 100% 100%;
      }
      50% {
        background: url('../../../assets/images/img_test_02.png') no-repeat;
        background-size: 100% 100%;
      }
      100% {
        background: url('../../../assets/images/img_test_03.png') no-repeat;
        background-size: 100% 100%;
      }
    }
    .speed-content {
      text-align: center;
      .test-info {
        background: url('../../../assets/images/img_test_01.png') no-repeat;
        background-size: 100% 100%;
        width: 330px;
        height: 330px;
        animation: speed-testing 1s linear infinite;
      }
      p {
        color: #ffffff;
        font-size: 16px;
        font-weight: 200;
      }
      .speed-completed {
        width: 600px;
        min-height: 265px;
        background: white;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        .speed-result-info {
          flex: 1;

          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: row;
          .extra {
            flex: 1;
            p {
              margin: 0;
              padding: 0;
            }
            text-align: left;
            display: flex;
            justify-content: center;
            align-items: center;
            .p-dwon-icon {
              width: 25px;
              height: 34px;
              display: inline-block;
              background: url('../../../assets/images/ic_ic_download.png')
                no-repeat;
              background-size: 100% 100%;
              margin-right: 5px;
            }
            .p-up-icon {
              width: 25px;
              height: 34px;
              display: inline-block;
              background: url('../../../assets/images/ic_upload.png') no-repeat;
              background-size: 100% 100%;
              margin-right: 5px;
            }
            .p-count-icon {
              width: 30px;
              height: 30px;
              display: inline-block;
              background: url('../../../assets/images/ic_broadband.png')
                no-repeat;
              background-size: 100% 100%;
              margin-right: 5px;
            }
            .title {
              font-size: 16px;
              color: #333333;
              font-weight: 600;
              padding: 15px 0;
              border-bottom: 1px solid #f1f1f1;
            }
            .speed {
              font-size: 22px;
              font-weight: bold;
              padding: 0 3px;
              color: #000;
            }
            .unit {
              font-size: 12px;
              font-weight: normal;
              letter-spacing: -0.2px;
              color: #333333;
            }
            .note {
              font-size: 12px;
              letter-spacing: -0.1px;
              color: #999999;
              margin-left: 3px !important;
            }
          }
        }
        .btn-info {
          height: 100px;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          .cmp-btn {
            width: 120px;
            height: 42px;
            border-radius: 4px;
            border: solid 1px #b6b6b6;
            color: #333333;
            background: white;
            outline: none;
            box-sizing: border-box;
            &:active {
              opacity: 0.6;
            }
          }
          .re-btn {
            outline: none;
            width: 120px;
            height: 42px;
            border-radius: 4px;
            background-color: #4237dd;
            border: solid 1px #4237dd;
            color: #ffffff;
            margin-left: 40px;
            &:active {
              opacity: 0.6;
            }
          }
        }
      }
    }
  }
  padding: 0 30px;
  padding-bottom: 30px;
  .check-info {
    .row-1 {
      display: flex;
      max-width: 200px;
      align-items: center;
    }
    .row-3 {
      max-width: 200px;
      display: flex;
      align-items: center;
      margin-right: 20px;
    }
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 150px;
    width: 100%;

    flex-wrap: wrap;
    .name {
      //   font-weight: bold;
    }
    .network-icon {
      padding: 0 20px;
      img {
        display: inline-block;
        width: 50px;
        height: 50px;
      }
    }
    .router-icon {
      padding: 0 20px;
      img {
        display: inline-block;
        width: 70px;
        height: 28px;
      }
    }
    .check-status {
      flex: 1;
      max-width: 440px;
      min-width: 150px;
      min-height: 60px;
      position: relative;
      .success-line {
        position: absolute;
        max-width: 440px;
        min-width: 150px;
        width: 100%;
        height: 3px;
        border: 2px dashed #4237dd;
        box-sizing: border-box;
      }
      .fail-line {
        position: absolute;
        max-width: 440px;
        min-width: 150px;
        width: 100%;
        height: 3px;
        border: 2px dashed #999999;
        box-sizing: border-box;
      }
      .fail-info {
        position: absolute;
        padding: 0 10px;
        background: #f1f1f1;
        z-index: 111;
        width: 57px;
        height: 32px;
        // padding: 10px;
        background: #f1f1f1;
        top: 13px;
        right: 50%;
        transform: translateX(50%);
      }
      .fail-icon {
        position: absolute;
        width: 37px;
        height: 31px;
        background: url('../../../assets/images/ic_wifi_wrong.png');
        background-size: 100% 100%;
      }
      .check-txt-info {
        position: relative;
        min-height: 30px;
      }
      .testing {
        display: inline-block;
        font-size: 12px;
        text-align: center;
        width: 100%;
        min-width: 100px;
        font-weight: 200;
        color: #333333;
        position: absolute;
        bottom: 10px;
        // top: -24px;
        right: 50%;
        transform: translateX(50%);
      }
    }
    .check-btn {
      // margin-left: 30px;
      height: 50px;
      width: 160px;
    }
    .speed {
      font-weight: 200;
      // margin-right: 20px;
      span {
        font-size: 24px;
        color: #000;
        padding-right: 5px;
        font-weight: 400;
      }
    }
  }
  .router-info {
    position: relative;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    .item {
      // min-width: 400px;
      width: calc(50% - 10px);
      min-height: 220px;
      overflow: hidden;
      background: white;
      margin-bottom: 20px;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 0 20px;
      .extra {
        min-width: 140px;
        // text-align: left;
      }
      .title {
        font-size: 16px;
        color: #333333;
        font-weight: 600;
        padding: 15px 0;
        border-bottom: 1px solid #f1f1f1;
      }
      .speed {
        font-size: 26px;
        font-weight: bold;
        padding: 0 3px;
      }
      .unit {
        font-size: 14px;
        font-weight: normal;
        letter-spacing: -0.2px;
        color: #333333;
      }
      .note {
        font-size: 14px;
        letter-spacing: -0.1px;
        color: #999999;
        margin-left: 3px !important;
      }
      .message {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        padding-top: 10px;
        .m-item {
          width: 50%;
          font-size: 14px;
          color: #333333;
          padding-top: 20px;
          .m-title {
            color: #999999;
          }
        }
      }

      .speep-info {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        min-height: 165px;
        div {
          display: inline-block;
          flex: 1;
          text-align: center;
          // min-width: 200px;
          p {
            margin: 0;
            padding: 0;
            text-align: left;
          }
        }
        .f-up-icon {
          width: 36px;
          height: 36px;
          display: inline-block;
          background: url('../../../assets/images/ic_fast_upload.png') no-repeat;
          background-size: 100% 100%;
        }
        .f-down-icon {
          width: 36px;
          height: 36px;
          display: inline-block;
          background: url('../../../assets/images/ic_fast_download.png')
            no-repeat;
          background-size: 100% 100%;
        }
        .t-dwon-icon {
          width: 25px;
          height: 34px;
          display: inline-block;
          background: url('../../../assets/images/ic_ic_download.png') no-repeat;
          background-size: 100% 100%;
        }
        .t-up-icon {
          width: 25px;
          height: 34px;
          display: inline-block;
          background: url('../../../assets/images/ic_upload.png') no-repeat;
          background-size: 100% 100%;
        }
        .t-count-icon {
          width: 36px;
          height: 36px;
          display: inline-block;
          background: url('../../../assets/images/ic_contact_advice.png')
            no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .term-flow-info {
      .speep-info {
        div {
          text-align: left;
        }
      }
    }
    .real-time-network {
      .content {
        display: flex;
        flex-wrap: wrap;
        min-height: 165px;
        .real-wrap {
          min-width: 270px;
          min-height: 60px !important;
        }
        .real-time-info {
          position: relative;
          &::after {
            content: '';
            position: absolute;
            box-sizing: border-box;
            width: 2px;
            height: 70px;
            border: 1px solid #f1f1f1;
            right: 0;
          }
          width: 260px;
          display: flex;
          // height: 165px;
          overflow: hidden;
          flex-direction: column;
          justify-content: center;
          color: #333333;
          font-size: 14px;
          .r-title {
            font-size: 17px;
            color: #999999;
            font-weight: 200;
            border: none;
          }
          .down {
            .r-dwon-icon {
              width: 12px;
              height: 16px;
              display: inline-block;
              background: url('../../../assets/images/ic_ic_download.png')
                no-repeat;
              background-size: 100% 100%;
            }
          }
          .up {
            padding-top: 15px;

            .r-up-icon {
              width: 12px;
              height: 16px;
              display: inline-block;
              background: url('../../../assets/images/ic_upload.png') no-repeat;
              background-size: 100% 100%;
            }
          }
        }
      }
    }
  }
  .mesh-info {
    .title {
      font-size: 16px;
      color: #333333;
      font-weight: 600;
      padding: 15px 0;
      border-bottom: 1px solid #f1f1f1;
    }
    width: 100%;
    min-height: 273px;
    background: white;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 0 20px;
    .content {
      display: flex;
      min-height: 200px;
      align-items: center;
      flex-wrap: wrap;
      justify-content: flex-start;
      :nth-child(1) {
        margin-left: 0 !important;
      }
      .mesh {
        width: 220px;
        height: 120px;
        margin-top: 10px;
        margin-bottom: 10px;
        margin-right: 20px;
        border-radius: 6px;
        overflow: hidden;
        display: flex;

        &.signal-3 {
          background: linear-gradient(to left bottom, #20e779, #19d191);
        }
        &.signal-2 {
          background: linear-gradient(to left bottom, #0089ff, #05befe);
        }
        &.signal-1 {
          background: linear-gradient(to left bottom, #ff9575, #ff527a);
        }
        .message {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 20px;
          width: 50%;
          img {
            width: 22px;
            height: 27px;
          }
          span {
            font-size: 14px;
            color: white;
            padding-top: 10px;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .status {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 60px;
            height: 60px;
          }
        }
      }
      .main {
        width: 260px;
        margin-top: 10px;
        margin-right: 40px;
        display: flex;
        .message {
          img {
            width: 50px;
            height: 24px;
          }
        }
        .status {
          img {
            width: 80px;
            height: 80px;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1068px) {
  .check-info {
    padding-bottom: 30px;
  }
  .row-1 {
    width: 120px;
    justify-content: center;
    flex-flow: column-reverse;
    .name {
      padding-top: 6px;
    }
  }
  .row-3 {
    width: 120px;
    flex-flow: column;
  }
}
@media screen and (max-width: 1220px) {
  .router-info {
    flex-direction: column;
    .item {
      width: 100% !important;
    }
  }
}
@media screen and (max-width: 540px) {
  .home-container {
    .router-info {
      .item {
        .message {
          flex-direction: column;
          padding-bottom: 20px;
          .m-item {
            width: 100%;
            padding-top: 10px;
            font-size: 14px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .home-container {
    .speed-model-info {
      .speed-content {
        width: 100%;
        .test-info {
          width: 150px;
          height: 150px;
          margin: 0 auto;
        }
        .speed-completed {
          padding: 10px;
          .speed-result-info {
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            padding-top: 20px;
            .extra {
              min-width: 120px;

              // padding-right: 10px;
              padding-bottom: 20px;
            }
          }
          width: 80%;
          margin: 0 auto;
          min-height: 265px !important;
        }
      }
    }
    .btn-info {
      width: 100%;
      margin-top: 20px;
      .btn {
        height: 44px;
      }
    }
    padding: 10px;
    padding-top: 30px;
    .router-info {
      .term-flow-info {
        .speep-info {
          .extra {
            text-align: left;
            .t-dwon-icon,
            .t-up-icon {
              width: 25px;
              height: 30px;
            }
            .t-count-icon {
              width: 30px;
              height: 30px;
            }
          }
        }
      }
      .real-wrap {
        min-height: 60px !important;
        margin: 10px 0;
        div {
          text-align: left !important;
        }
        i {
          width: 30px !important;
          height: 30px !important;
        }
      }
      .item {
        padding: 0 10px;
        .title {
          height: 44px;
          line-height: 44px;
          font-size: 14px;
          padding: 0;
        }
      }
      .speed {
        font-size: 20px !important;
      }
      .unit {
        font-size: 12px !important;
      }
      .note {
        font-size: 12px !important;
      }
      .real-time-network {
        .real-time-info {
          .down {
            padding-top: 20px;
          }
          width: 100% !important;
          height: auto !important;
          &::after {
            border: none !important;
          }

          .r-title {
            font-size: 14px !important;
          }
        }
      }
    }
    .check-info {
      .speed {
        // padding-top: 10px;
        span {
          font-size: 14px;
        }
      }
      .row-1 {
        width: 100px;
        font-size: 12px !important;
      }
      .row-3 {
        width: 100px;
        font-size: 12px !important;
        margin: 0;
      }
      .network-icon {
        padding: 0 10px;
        img {
          display: inline-block;
          width: 36px;
          height: 36px;
        }
      }
      .router-icon {
        padding: 0 10px;
        img {
          display: inline-block;
          width: 50px;
          height: 18px;
        }
      }
      .check-status {
        min-width: 100px;
        .fail-info {
          width: 44px;
          top: 20px;
        }
        .fail-icon {
          width: 24px;
          height: 20px;
        }
        .success-line,
        .fail-line {
          min-width: 100px;
        }
      }
    }
  }
}
</style>

