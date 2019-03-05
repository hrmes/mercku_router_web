<template>
<div class="container">
  <div class="wrapper">
      <div class="header">{{$t('trans0316')}}</div>
      <div class="content">
        <!-- 连接成功 -->
        <div class="form">
          <div class="form-item">
            <div class="item-key">{{$t('trans0375')}}:</div>
            <div class="item-value">255.240.230.12</div>
          </div>

          <div class="form-item">
            <div class="item-key">{{$t('trans0151')}}:</div>
            <div class="item-value">255.240.230.12</div>
          </div>

          <div class="form-item">
            <div class="item-key">{{$t('trans0152')}}:</div>
            <div class="item-value">255.240.230.12</div>
          </div>

          <div class="form-item">
            <div class="item-key">{{$t('trans0153')}}:</div>
            <div class="item-value">25.20.10.12</div>
          </div>

          <div class="form-item">
            <div class="item-key">{{$t('trans0236')}}:</div>
            <div class="item-value">DNS:255.240.230.12</div>
          </div>        
        </div>

        <!-- 选择方式 -->
        <div class="chovice">
          <!-- <div class="title"></div> -->
          <div class="select">
          
            <m-select v-model="way_current_type"
                      :options="ways"
                      :label="$t('trans0317')"                     
            ></m-select>

            <!-- 开关选择宽带对应表单 -->
            <div class="show-item-content">
              <p>{{$t('trans0147')}}</p> 
              <m-form v-if="way_current_type==='宽带拨号'"
                      :model="pppoes"
                      >
                <m-form-item>
                    <m-input :label="$t('trans0155')"
                              :placeholder="$t('trans0321')"
                              v-model="pppoes.account"
                    ></m-input>
                </m-form-item>
                <m-form-item>
                    <m-input :label="$t('trans0156')"
                              :placeholder="$t('trans0321')"
                              type='password'
                              v-model="pppoes.password"
                    ></m-input>
                </m-form-item>
              </m-form>
            </div>
            <!-- 开关选择动态 ip 对应表单 -->
            <div class="show-item-content"
                  v-if="way_current_type==='动态ip'">
            </div>
            <!-- 开关选择静态ip对应表单 -->
            <div class="show-item-content"
                 v-if="way_current_type==='静态ip'">
              <m-form>
              <!-- <p>{{$t('trans0150')}}</p>  -->
                <m-form-item>
                    <m-input :label="$t('trans0151')"
                              placeholder="0.0.0.0"
                    ></m-input>
                </m-form-item>
                <m-form-item>
                    <m-input :label="$t('trans0152')"
                              placeholder="0.0.0.0"
                    ></m-input>
                </m-form-item>
                <m-form-item>
                    <m-input :label="$t('trans0153')"
                              placeholder="0.0.0.0"
                    ></m-input>
                </m-form-item>
                <m-form-item>
                    <m-input :label="$t('trans0236')"
                              placeholder="0.0.0.0"
                    ></m-input>
                </m-form-item> 
                <m-form-item>
                    <m-input :label="$t('trans0320')"
                              placeholder="0.0.0.0"
                    ></m-input>
                </m-form-item>
              </m-form>
            </div>
            <!-- 改变上网方式 -->
            <div class="change">
              <m-form>
                <m-form-item>
                  <m-radio-group class="radio-group"
                                  direction="vertical"
                                  :options="dnsChoices"
                                  v-model="autoconfs.manudns"
                  ></m-radio-group>
                </m-form-item>
                <!-- 手动配置 -->
                <div class="man-show" v-if="autoconfs.manudns"
                >
                  <m-form-item>
                    <m-input :label="$t('trans0236')"
                              placeholder="0.0.0.0"
                    ></m-input>
                  </m-form-item>
                  <m-form-item>
                    <m-input :label="$t('trans0320')"
                              placeholder="0.0.0.0">
                    </m-input>
                  </m-form-item>
                </div>
              </m-form>
            <!-- 提交表单 -->
                <div class="btn">保存
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        ways: [
          {
            value: '动态ip',
            text: '动态ip'
          },
          {
            value: '宽带拨号',
            text: '宽带拨号'
          },
          {
            value: '静态ip',
            text: '静态ip'
          }
        ],
        autoconfs: {
          autodns: false,
          manudns: false
        },
        dnsChoices: [
          {
            value: false,
            text: this.$t('trans0399')
          },
          {
            value: true,
            text: this.$t('trans0400')
          }
        ],
        way_current_type: '静态ip',
        options: [
          {
            value: 'dhcp',
            text: this.$t('trans0146')
          },
          {
            value: 'pppoe',
            text: this.$t('trans0144')
          },
          {
            value: 'static',
            text: this.$t('trans0148')
          }
        ],
        pppoes:{
          account: '',
          password: ''
        }
      }
    },

    methods: {
      handleManDns(){
      }
    },
    computed: {
    }
  }
</script>

<style lang='scss' scoped>
// 媒体查询
// 移动端
@media screen  and (max-width: 768px){
  .container {
    width: 100%;
  }
}
// pc 端
@media screen and (min-width: 768px) {
  width: 1619px;
}

.container {
  width: 1619px;
  height: 1208px;

  .wrapper {
    margin-left: 69px;
    margin-right: 1px;
    margin-top: 31px;

    width: 1550px;

    .header {
      vertical-align: center;
      width: 100%;
      height: 35px;

      font-size: 18px;
      font-weight: bold;
      border-bottom: 1px solid #f1f1f1;
    }

    .content {
      margin-top: 32px;
      width: 100%;
     // 连接成功表单
      .form {
        width: 230px;
        height: 177px;
        
        .form-item  {
          display: flex;
          justify-content: space-between;
          margin-top: -10px;
          height: 20px;

          font-size: 14px;
          .item-key {
            color: #999;

          }
          .item-value {
            width: 130px;
          }
        }
      }

      // 选择方式
      .chovice {
        margin-top: 50px;
        width: 100%;

        // .title {
        //   font-size: 14px;
        //   color: #333333;
        // }

        .select {
          margin-top: 10px;
          width: 350px;
          height: 36px;

          font-size: 14px;

          .show-item-content {
            width: 200px;
            margin-top: 30px;

            // background-color: #eee;

            p {
              margin-top: -20px;
              width: 260px;
              height: 47px;

              font-size: 12px;
              color:#999;
            }
          }

          .change {
            margin-top: 30px;
            width: 350px;

            // 显示手动配置输入菜单
            .man-show {
            }
            // 提交表单按钮
            .btn {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 40px;
              width: 120px;

              color: #fff;
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}
</style>