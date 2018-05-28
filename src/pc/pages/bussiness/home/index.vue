<template>
    <div class="home-container">
        <div class="check-info">
            <div class="name">Tom's wifi</div>
            <div class="router-icon"><img src="../../../assets/1.png" alt=""></div>
            <div class='check-status'>
                <span class='testing' v-if='true'> {{$t('trans0298')}}正在检测你的网络，请等待…</span>
                <img class="success-line" v-if='true' src="../../../assets/1.png" alt="">
                <img class='fail-line' v-if='false' src="../../../assets/1.png" alt="">
            </div>
            <div class="network-icon"><img src="../../../assets/1.png" alt=""></div>
            <div class="speed">
                <span>21.16</span>M
            </div>
            <Button class="check-btn" v-if='true'>测速</Button>
        </div>
        <div class="router-info">
            <div class="item">
                <div class="title">{{$t('trans0299')}}路由器信息</div>
                <div class='message'>
                    <div class="m-item">
                        <label class="m-title">{{$t('trans0187')}}型号：</label>
                        Mercku m1
                    </div>
                    <div class="m-item">
                        <label class="m-title">{{$t('trans0300')}}路由器ROM版本：</label>
                        Mercku 稳定版2.18.15
                    </div>
                    <div class="m-item">
                        <label class="m-title">{{$t('trans0188')}}MAC地址：</label>
                        F0:B4:29:77:59:
                    </div>
                    <div class="m-item">
                        <label class="m-title">{{$t('trans0251')}}SN：</label>
                        6816/02252767
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="title">{{$t('trans0301')}}外网状态</div>
                <div class='message'>
                    <div class="m-item">
                        <label class="m-title">{{$t('trans0302')}}连接类型：</label>
                        Mercku m1
                    </div>
                    <div class="m-item">
                        <label class="m-title">{{$t('trans0151')}}IP地址：</label>
                        Mercku 稳定版2.18.15
                    </div>
                    <div class="m-item">
                        <label class="m-title">{{$t('trans0152')}}子网掩码：</label>
                        F0:B4:29:77:59:
                    </div>
                    <div class="m-item">
                        <label class="m-title">{{$t('trans0236')}}DNS：</label>
                        6816/02252767
                    </div>
                    <div class="m-item">
                        <label class="m-title">{{$t('trans0153')}}网关：</label>
                        6816/02252767
                    </div>
                </div>
            </div>
            <div class="item real-time-network">
                <div class="title">{{$t('trans0303')}}实时网络状态</div>
                <div class="content">
                    <div class="real-time-info">
                        <div class="down">
                            <label class="r-title">实时下行：</label>
                            <i class='r-dwon-icon'></i>
                            <span class="speed">0.5</span>
                            <span class="unit"> KB/s</span>
                        </div>
                        <div class='up'>
                            <label class="r-title">实时上行：</label>
                            <i class='r-up-icon'></i>
                            <span class="speed">0.7</span>
                            <span class="unit"> KB/s</span>
                        </div>
                    </div>
                    <div class="speep-info">
                        <div class='up'>
                            <i class="f-up-icon"></i>
                            <div>
                                <p>
                                    <span class="speed">21.15</span>
                                    <span class='unit'> MB/s</span>
                                </p>
                                <p class="note">最快上传</p>
                            </div>
                        </div>
                        <div class="down">
                            <i class="f-down-icon"></i>
                            <div>
                                <p>
                                    <span class="speed">2.15</span>
                                    <span class='unit'> MB/s</span>
                                </p>
                                <p class="note">最快下载</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="item term-flow-info">
                <div class="title">{{$t('trans0308')}}终端流量统计</div>
                <div class="speep-info">
                    <div class='up'>
                        <i class="f-up-icon"></i>
                        <div>
                            <p>
                                <span class="speed">21.15</span>
                                <span class='unit'> MB/s</span>
                            </p>
                            <p class="note">最快上传</p>
                        </div>
                    </div>
                    <div class='up'>
                        <i class="f-up-icon"></i>
                        <div>
                            <p>
                                <span class="speed">21.15</span>
                                <span class='unit'> MB/s</span>
                            </p>
                            <p class="note">最快上传</p>
                        </div>
                    </div>
                    <div class='up'>
                        <i class="f-up-icon"></i>
                        <div>
                            <p>
                                <span class="speed">21.15</span>
                                <span class='unit'> MB/s</span>
                            </p>
                            <p class="note">最快上传</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class='mesh-info'>
            <div class="title">{{$t('trans0308')}}Mesh状态</div>
            <div class="content">
                <div v-for="item in meshStatus" class="mesh" :class="diffMesh(item)" :style="item.main&&{width:' 260px ',margin:' 0 25px'}">

                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      meshStatus: [
        {
          main: true,
          name: 'm2',
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
        },

        {
          main: false,
          name: 'bee',
          status: 2
        }
      ]
    };
  },
  methods: {
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
            [];
            break;
        }
      }
      return className;
    }
  }
};
</script>
<style lang="scss" scoped>
.home-container {
  padding: 0 30px;
  padding-bottom: 80px;
  .check-info {
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
        border: 1px solid red;
        border-radius: 50px;
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
      width: 440px;
      position: relative;
      .success-line {
        position: absolute;
        width: 440px;
        height: 3px;
        box-sizing: border-box;
      }
      .fail-line {
        position: absolute;
        width: 440px;
        height: 24px;
        box-sizing: border-box;
        top: -12px;
      }
      .testing {
        display: inline-block;
        font-size: 12px;
        text-align: center;
        width: 440px;
        font-weight: 200;
        color: #333333;
        position: absolute;
        top: -24px;
      }
    }
    .check-btn {
      margin-left: 30px;
      height: 50px;
      width: 160px;
      background: #4237dd;
      color: white;
    }
    .speed {
      font-weight: 200;
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
      min-width: 520px;
      width: calc(50% - 10px);
      min-height: 220px;
      overflow: hidden;
      background: white;
      margin-bottom: 20px;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 0 20px;
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
        justify-content: center;
        align-items: center;
        min-height: 165px;
        div {
          display: inline-block;
          padding-left: 10px;
          flex: 1;
          text-align: center;
          p {
            margin: 0;
            padding: 0;
            text-align: left;
          }
        }
        .f-up-icon {
          width: 36px;
          height: 36px;
          border: 1px solid red;
          border-radius: 36px;
          display: inline-block;
          background: url('../../../assets/1.png') no-repeat;
          background-size: 100% 100%;
        }
        .f-down-icon {
          width: 36px;
          height: 36px;
          border: 1px solid red;
          border-radius: 36px;
          display: inline-block;
          background: url('../../../assets/1.png') no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .real-time-network {
      .content {
        display: flex;
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
          height: 165px;
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
              background: url('../../../assets/1.png') no-repeat;
              background-size: 100% 100%;
            }
          }
          .up {
            padding-top: 15px;

            .r-up-icon {
              width: 12px;
              height: 16px;
              display: inline-block;
              background: url('../../../assets/1.png') no-repeat;
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
        margin: 0 10px;
        border-radius: 6px;
        &.signal-3 {
          background: linear-gradient(to left bottom, #20e779, #19d191);
        }
        &.signal-2 {
          background: linear-gradient(to left bottom, #0089ff, #05effe);
        }
        &.signal-1 {
          background: linear-gradient(to left bottom, #ff9575, #ff527a);
        }
        &.main {
          width: 260px;
          margin: 0 25px;
        }
        &.node {
          width: 220px;
        }
      }
    }
  }
}
</style>

