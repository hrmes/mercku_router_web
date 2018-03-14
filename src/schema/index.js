const routerConfig = () => {
  const config = {
    wifi: {
      ssid: '',
      password: ''
    },
    admin: {
      password: ''
    },
    wan: {
      type: '' // static,dhcp,pppoe
      /*
        static:{
          ip:'',
          mask:'',
          gateway:'',
          dns:''
        }
        pppoe:{
          account:'',
          password:''
        }
      */
    }
  };
  const wanType = {
    static: 'static',
    dhcp: 'dhcp',
    pppoe: 'pppoe'
  };
  return {
    getConfig() {
      return {
        wifi: Object.assign({}, config.wifi),
        admin: Object.assign({}, config.admin),
        wan: Object.assign({}, config.wan)
      };
    },
    setWIFI(ssid, pwd) {
      config.wifi.ssid = ssid;
      config.wifi.password = pwd;
    },
    getWIFI() {
      return Object.assign({}, config.wifi);
    },
    setAdminPwd(pwd) {
      config.admin.password = pwd;
    },
    getAdminPwd() {
      return config.admin.password;
    },
    setWan(type, options) {
      if (!Object.keys(wanType).includes(type)) {
        console.log('wan type not support!');
      } else {
        config.wan.type = type;
        switch (type) {
          case wanType.static:
            config.wan.static = {
              ip: options.ip,
              mask: options.mask,
              gateway: options.gateway,
              dns: options.dns
            };
            break;
          case wanType.pppoe:
            config.wan.pppoe = {
              account: options.account,
              password: options.password
            };
            break;
          default:
            break;
        }
      }
    },
    getWan() {
      const result = {
        type: config.wan.type
      };
      switch (config.wan.type) {
        case wanType.static:
          Object.assign(result, config.wan.static);
          break;
        case wanType.pppoe:
          Object.assign(result, config.wan.pppoe);
          break;
        default:
          break;
      }
      return result;
    }
  };
};

export default routerConfig();
