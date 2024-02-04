<template>
  <div class="page game">
    <div class="content">
      <div class="row-1">
        <div class="flex-left">
          <img src="@/assets/images/customer/qiyou/launcher_logo.png">
        </div>
        <div class="flex-right">
          <div class="main-title">{{$t('trans1279')}}</div>
          <div class="sub-title">
            {{$t('trans1280')}}
            <div class="link">
              <a @click="forward2QiyouApp">{{$t('trans1281')}}</a>
              <div v-if="!isMobile"
                   class="jump-app-info">
                <div class="icon mercku">
                  <img src="@/assets/images/customer/qiyou/ic_launcher.png"
                       alt="">
                </div>
                <div class="text-container">{{$t('trans1283')}}</div>
                <div class="icon qr">
                  <img src="@/assets/images/customer/qiyou/qr.png"
                       alt="">
                </div>
              </div>
            </div>
            {{$t('trans1282')}}
          </div>
        </div>
      </div>
      <div class="row-2">
        <div class="flex-top">
          <div class="main-title">{{$t('trans1284')}}</div>
          <div class="sub-title">
            {{$t('trans1285')}}
          </div>
        </div>
        <div class="flex-bottom">
          <button class="btn"
                  @click="forward2Wifi">{{$t('trans1286')}}</button>
        </div>
      </div>
      <div class="row-3">
        <div class="flex-left">
          <div class="main-title">{{$t('trans1287')}}</div>
          <div class="sub-title">
            {{$t('trans1288')}}
          </div>
        </div>
        <div class="flex-right">
          <img src="@/assets/images/add/img_game_lan.png">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    };
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    },
  },
  methods: {
    forward2Wifi() {
      this.$router.push({ path: '/setting/wifi' });
    },
    forward2QiyouApp() {
      if (this.isMobile) {
        window.open('https://www.qiyou.cn/specials/ljb-code', '_blank');
      }
    }
  }

};
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  .content {
    width: 600px;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: repeat(3, auto);
    grid-row-gap: 10px;
    > div {
      display: flex;
      background-color: var(--common_card-bgc);
      border-radius: 10px;
      padding: 30px;
      .main-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--text_default-color);
        margin-bottom: 5px;
      }
      .sub-title {
        font-size: 14px;
        display: flex;
      }
      a {
        color: var(--primary-color);
        text-decoration: underline;
        cursor: default;
      }
    }
    .row-1 {
      .flex-left {
        width: 60px;
        height: 60px;
        border-radius: 14px;
        box-shadow: 0 5px 10px 0 rgba(42, 116, 239, 0.2);
        background-color: #fff;
        margin-right: 15px;
        img {
          width: inherit;
          height: inherit;
        }
      }
      .flex-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        .sub-title {
          display: flex;
          flex-wrap: wrap;
        }
        .link {
          position: relative;
          .jump-app-info {
            display: none;
            position: absolute;
            bottom: -7px;
            left: 50%;
            transform: translate(-50%, 100%);
            justify-content: space-between;
            align-items: center;
            align-self: flex-end;
            padding: 10px 10px 10px 20px;
            border-radius: 10px;
            background: var(--dashboard_app-bgc);
            box-shadow: 0px 5px 15px 3px rgba(0, 0, 0, 0.2);
            .text-container {
              color: var(--text_default-color);
              width: 100px;
              margin-right: 10px;
            }
            .icon {
              width: 70px;
              height: 70px;
              img {
                width: 100%;
                height: 100%;
              }
              &.mercku {
                display: none;
              }
              &.qr {
                display: block;
              }
            }
            &::after {
              content: '';
              position: absolute;
              top: 1px;
              left: 50%;
              transform: translate(-50%, -100%);
              width: 0px;
              height: 0px;
              border: 7px solid transparent;
              border-bottom: 7px solid var(--dashboard_app-bgc);
              z-index: inherit;
            }
          }
          &:hover {
            .jump-app-info {
              display: flex;
            }
          }
        }
      }
    }
    .row-2 {
      flex-direction: column;
      justify-content: space-between;
      .flex-bottom {
        margin-top: 10px;
      }
      .btn {
        width: 240px;
      }
    }
    .row-3 {
      .flex-left {
        display: flex;
        flex-direction: column;
        width: 280px;
        margin-right: 20px;
      }
      .flex-right {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 7px;
        background-color: var(--mesh_table_header-bgc);
        padding: 10px;
        > img {
          width: 100%;
          aspect-ratio: 1;
        }
      }
    }
  }
}
@media screen and(max-width: 768px) {
  .page {
    width: 100%;
    padding: 10px 20px;
    .content {
      width: 100%;
      grid-template-rows: repeat(3, auto);
      > div {
        flex-direction: column;
        padding: 25px;
        .main-title {
          margin-bottom: 5px;
        }
        .sub-title {
        }
      }
      .row-1 {
        .flex-left {
          margin-bottom: 20px;
        }
        .flex-right {
          .sub-title {
            display: block;
            .link {
              display: inline-block;
              .jump-app-info {
                display: none;
              }
              &:hover {
                .jump-app-info {
                  display: none;
                }
              }
            }
          }
        }
      }
      .row-2 {
        .flex-bottom {
          margin-top: 20px;
          .btn {
            width: 100%;
            margin: 0;
          }
        }
      }
      .row-3 {
        .flex-right {
          margin-top: 20px;
        }
      }
    }
  }
}
</style>
