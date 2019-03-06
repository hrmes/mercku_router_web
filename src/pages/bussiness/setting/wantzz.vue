<template>
<div class="container">
  <div class="wrapper">
      <div class="header">{{$t('trans0316')}}</div>
      <div class="content">
        <!-- 连接成功 -->
        <div class="form">
          <div class="form-item">
            <div class="item-key">{{$t('trans0317')}}:</div>
            <div class="item-value">{{networkArr[localNetInfo.type]}}</div>
          </div>

          <div class="form-item">
            <div class="item-key">{{$t('trans0151')}}:</div>
            <div class="item-value">{{localNetInfo.netinfo.ip}}</div>
          </div>

          <div class="form-item">
            <div class="item-key">{{$t('trans0152')}}:</div>
            <div class="item-value">{{localNetInfo.netinfo.mask }}</div>
          </div>

          <div class="form-item">
            <div class="item-key">{{$t('trans0153')}}:</div>
            <div class="item-value">{{localNetInfo.netinfo.gateway}}</div>
          </div>

          <div class="form-item">
            <div class="item-key">{{$t('trans0236')}}:</div>
            <div class="item-value">{{localNetInfo.netinfo.dns.length>0?localNetInfo.netinfo.dns.join('/'):'-'}}</div>
          </div>        
        </div>

        <!-- 选择方式 -->
        <div class="chovice">
          <!-- <div class="title"></div> -->
          <div class="select">
          
            <m-select v-model="netType"
                      :options="options"
                      :label="$t('trans0317')"                     
            ></m-select>

            <!-- 开关选择宽带对应表单 -->
            <div class="show-item-content">
              <p>{{netNote[netType]}}</p> 
              <m-form v-if="isPppoe"
                      ref="pppoeForm"
                      :model="pppoeForm"
                      :rules="pppoeRules"
                      >
                <m-form-item prop='account'>
                    <m-input :label="$t('trans0155')"
                              type="text"
                              :placeholder="$t('trans0321')"
                              v-model="pppoeForm.account"></m-input>
                </m-form-item>
                <m-form-item prop='password'>
                    <m-input :label="$t('trans0156')"
                              :placeholder="$t('trans0321')"
                              type='password'
                              v-model="pppoeForm.password"
                    ></m-input>
                </m-form-item>
              </m-form>
            </div>
            <!-- 开关选择动态 ip 对应表单 -->
            <div class="show-item-content"
                  v-if="isDhcp"
                  >
            </div>
            <!-- 开关选择静态ip对应表单 -->
            <div class="show-item-content"
                >
              <m-form  v-if="isStatic"
                       ref="staticForm"
                       :model="staticForm"
                       :rules="staticRules"
              >
                <m-form-item prop='ip'
                              ref='ip'>
                    <m-input :label="$t('trans0151')"
                              placeholder="0.0.0.0"
                              v-model="staticForm.ip"
                              :onBlur="ipChange"
                    ></m-input>
                </m-form-item>
                <m-form-item prop='mask'
                              ref='mask'>
                    <m-input :label="$t('trans0152')"
                              placeholder="0.0.0.0"
                              v-model="staticForm.mask"
                              :onBlur="maskChange"
                    ></m-input>
                </m-form-item>
                <m-form-item prop='gateway'
                              ref='gateway'>
                    <m-input :label="$t('trans0153')"
                              placeholder="0.0.0.0"
                              v-model="staticForm.gateway"
                    ></m-input>
                </m-form-item>
                <m-form-item prop='dns1'
                              ref='dns'>
                    <m-input :label="$t('trans0236')"
                              placeholder="0.0.0.0"
                              v-model="staticForm.dns1"
                    ></m-input>
                </m-form-item> 
                <m-form-item prop='dns2'
                             ref='backupdns'>
                    <m-input :label="$t('trans0320')"
                              placeholder="0.0.0.0"
                              v-model="staticForm.dns2"
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
                                  :options="dnsOptions"
                                  v-model="autodns.dhcp"
                  ></m-radio-group>
                </m-form-item>
                <!-- 手动配置 -->
                <div class="man-show" v-if="autodns.dhcp">
                  <m-form-item prop='dns1'
                                ref='dns'>
                    <m-input :label="$t('trans0236')"
                              placeholder="0.0.0.0"
                              type="text"
                              v-model="pppoeForm.dns1"></m-input>
                  </m-form-item>
                  <m-form-item prop='dns2'
                               ref='backupdns'>
                    <m-input :label="$t('trans0320')"
                              placeholder="0.0.0.0"
                              type="text"
                              v-model="pppoeForm.dns2">
                    </m-input>
                  </m-form-item>
                </div>
              </m-form>
            <!-- 提交表单按钮 -->
                <div>
                  <button class="btn" 
                          v-defaultbutton
                          @click="submit()">{{$t('trans0081')}}
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as  CONSTANTS from 'util/constant';
import { ipRule, isMulticast, isLoopback, isValidMask, ipReg } from 'util/util';

// 检查 DNS
function checkDNS(value) {
  return ipReg.test(value) && !isMulticast(value) && !isLoopback(value);
}
  export default {
    data () {
      return {
        CONSTANTS,
        // 上网方式下的描述
        netNote: {
          dhcp: this.$t('trans0147'),
          static: this.$t('trans0150'),
          pppoe: this.$t('trans0154')
        },
        // 上网方式类型
        networkArr: {
          '-': '-',
          dhcp: this.$t('trans0146'),
          static: this.$t('trans0148'),
          pppoe: this.$t('trans0144')
        },
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
        // 自动获取 dns
        autodns: {
          pppoe: false,
          dhcp: false
        },
        // dns 配置方式选择
        dnsOptions: [
          {
            value: false,
            text: this.$t('trans0399')
          },
          {
            value: true,
            text: this.$t('trans0400')
          }
        ],
        // 网络状态设置
        netStatus: CONSTANTS.WanNetStatus.unlinked,
        // 上网类型
        netType: CONSTANTS.WanType.dhcp,
        // 网络信息
        netInfo: {},
        way_current_type: '静态ip',
        // 上网类型选择器
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

        // 静态 ip 网络表单
        staticForm: {
          ip: '',
          mask: '',
          gateway: '',
          dns1: '',
          dns2:''
        },
        // 宽带拨号表单
        pppoeForm: {
          account: '',
          passwoed: '',
          dns1: '',
          dns2:''
        },
        // 动态 ip 表单
        dhcpForm: {
          dns1: '',
          dns2: ''
        },
        // 宽带拨号表单验证规则
        pppoeRules: {
          account: [
            {
              rule: value => !/^\s*$/g.test(value),
              message: this.$t('trans0232')
            }
          ],
          password: [
            {
              rule: value => !/^\s*$/g.test(value),
              message: this.$t('trans0232')
            }
          ]         
        },
        // 静态 ip 验证规则
        staticRules: {
          ip: [
            {
              rule: value => !/^\s*$/g.test(value),
              message: this.$t('trans0232') 
            },
            {
              rule: value => ipReg.test(value),
              message: this.$t('trans0231')             
            }
          ],
          mask: [
            {
              rule: value => !/^\s*$/g.test(value),
              message: this.$t('trans0232')
            },
            {
              rule: value => ipReg.test(value),
              message: this.$t('trans0231')
            },
            {
              rule: value => isValidMask(value),
              message: this.$t('trans0231')
            }           
          ],
          gateway: [
            {
              rule: value => !/^\s*$/g.test(value),
              message: this.$t('trans0232')               
            },
            {
              rule: value => ipReg.test(value),
              message: this.$t('trans0231')
            }            
          ],
          dns1: [
            {
              rule: value => !/^\s*$/g.test(value),
              message: this.$t('trans0232')               
            },
            {
              rule: value => checkDNS(value),
              message: this.$t('trans0231')              
            }
          ],
          dns2: [
            {
              rule: value => (value ? checkDNS(value) : true),
              message: this.$t('trans0231')             
            }
          ]
                 
        },
        // 动态 ip 验证规则
        dhcpRules: {}
      }
    },

    // 观察 pppoe，dhcp 对应表单的值
    watch: {
      'autodns.pppoe': function pppoeWatcher(val) {
          if (!val) {
            this.pppoeRules = {
              ...this.pppoeRules,
              dns1: [
                {
                  rule: value => !/^\s*$/g.test(value),
                  message: this.$t('trans0232')
                },
                {
                  rule: value => checkDNS(value),
                  message: this.$t('trans0231')
                }
              ],
              dns2: [
                {
                  rule: value => (value ? checkDNS(value) : true),
                  message: this.$t('trans0231')
                }
              ]
            };
          } else {
            delete this.pppoeRules.dns1;
            delete this.pppoeRules.dns2;
          }
        },
      'autodns.dhcp': function dhcpWatcher(val) {
        if (!val) {
          this.dhcpRules = {
            ...this.dhcpRules,
            dns1: [
              {
                rule: value => !/^\s*$/g.test(value),
                message: this.$t('trans0232')
              },
              {
                rule: value => checkDNS(value),
                message: this.$t('trans0231')
              }
            ],
            dns2: [
              {
                rule: value => (value ? checkDNS(value) : true),
                message: this.$t('trans0231')
              }
            ]
          };
        } else {
          delete this.dhcpRules.dns1;
          delete this.dhcpRules.dns2;
        }
      }
    },
    mounted() {
      this.getWanStatus();
      this.getWanNetInfo();
    },
    computed: {
      isPppoe() {
        return this.netType === CONSTANTS.WanType.pppoe;
      },
      isStatic() {
        return this.netType === CONSTANTS.WanType.static;
      },
      isDhcp() {
        return this.netType === CONSTANTS.WanType.dhcp;
      },
      localNetInfo() {
        const local = {
          type: '-',
          netinfo: {
            ip: '-',
            mask: '-',
            gateway: '-', // 可选
            dns: []
          }
        };
        if (this.netInfo && this.netInfo.netinfo) {
          return { ...local, ...this.netInfo };
        }
        return local;
      }
    },
    methods: {
      // 验证 ip
      ipChange() {
        this.$refs.ip.extraValidate(
          ipRule,
          this.$t('trans0231'),
          this.staticForm.ip,
          this.staticForm.mask
        );
      },  
      //  验证 mask
      maskChange() {
        this.$refs.ip.extraValidate(
          ipRule,
          this.$t('trans0231'),
          this.staticForm.ip,
          this.staticForm.mask
        );
        this.$refs.gateway.extraValidate(
          ipRule,
          this.$t('trans0231'),
          this.staticForm.gateway,
          this.staticForm.mask
        );
      }, 
      // 获取网络状态
      getWanStatus() {
        this.netStatus = CONSTANTS.WanNetStatus.testing;
        this.$http
          .getWanStatus()
          .then(res => {
            this.netStatus = res.data.result.status;
          })
          .catch(() => {
            this.netStatus = CONSTANTS.WanNetStatus.unlinked;
          });
      },  
      // 
      getWanNetInfo() {
        this.$http.getWanNetInfo().then(res => {
          if (res.data.result) {
            this.netInfo = res.data.result;
            this.netType = this.netInfo.type;
            if (this.isDhcp) {
              if (this.netInfo.dhcp && this.netInfo.dhcp.dns) {
                this.autodns.dhcp = false;
                [this.dhcpForm.dns1] = this.netInfo.dhcp.dns;
                this.dhcpForm.dns2 = this.netInfo.dhcp.dns[1] || '';
              }
            }
            if (this.isPppoe) {
              this.pppoeForm.account = this.netInfo.pppoe.account;
              this.pppoeForm.password = this.netInfo.pppoe.password;
              if (this.netInfo.pppoe.dns) {
                this.autodns.pppoe = false;
                [this.pppoeForm.dns1] = this.netInfo.pppoe.dns;
                this.pppoeForm.dns2 = this.netInfo.pppoe.dns[1] || '';
              }
            }
            if (this.isStatic) {
              this.staticForm = {
                ip: this.netInfo.static.netinfo.ip,
                mask: this.netInfo.static.netinfo.mask,
                gateway: this.netInfo.static.netinfo.gateway,
                dns1: this.netInfo.static.netinfo.dns[0],
                dns2: this.netInfo.static.netinfo.dns[1] || ''
              };
            }
          }
        });
      },
      // 请求数据
      save(params) {
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans0229'),
          callback: {
            ok: () => {
              this.$http.meshWanUpdate(params).then(() => {
                this.$reconnect({
                  onsuccess: () => {
                    this.$router.push({ path: '/dashboard' });
                  },
                  ontimeout: () => {
                    this.$router.push({ path: '/unconnect' });
                  },
                  timeout: 60
                });
              });
            }
          }
        });
      },
      // 提交表单
    submit() {
      const form = { type: this.netType };
      switch (this.netType) {
        case CONSTANTS.WanType.dhcp:
          if (!this.$refs.dhcpForm.validate()) {
            return;
          }
          if (!this.autodns.dhcp) {
            form.dhcp = { dns: [this.dhcpForm.dns1] };
            if (this.dhcpForm.dns2) {
              form.dhcp.dns.push(this.dhcpForm.dns2);
            }
          }
          this.save(form);
          break;
        case CONSTANTS.WanType.pppoe:
          if (!this.$refs.pppoeForm.validate()) {
            return;
          }
          form.pppoe = {
            account: this.pppoeForm.account,
            password: this.pppoeForm.password
          };
          if (!this.autodns.pppoe) {
            form.pppoe.dns = [this.pppoeForm.dns1];
            if (this.pppoeForm.dns2) {
              form.pppoe.dns.push(this.pppoeForm.dns2);
            }
          }
          this.save(form);
          break;
        case CONSTANTS.WanType.static:
          if (!this.$refs.staticForm.validate()) {
            return;
          }
          form.static = {
            netinfo: {
              ip: this.staticForm.ip,
              mask: this.staticForm.mask,
              gateway: this.staticForm.gateway,
              dns: [this.staticForm.dns1]
            }
          };
          if (this.staticForm.dns2) {
            form.static.netinfo.dns.push(this.staticForm.dns2);
          }
          this.save(form);
          break;
        default:
          break;
      }
    }
  }}
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