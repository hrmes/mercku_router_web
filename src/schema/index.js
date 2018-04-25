const routerConfig = () => {
  const config = {
    wifi: {
      ssid: '',
      password: '',
      hidden: false
    },
    admin: {
      password: ''
    },
    timezone: {
      name: '',
      timezone: '',
      position: ''
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
      const result = {
        wifi: Object.assign({}, config.wifi),
        admin: Object.assign({}, config.admin),

        timezone: {
          timezone: config.timezone.timezone,
          position: config.timezone.position
        }
      };
      // 可能没有配置wan口参数
      if (config.wan.type) {
        result.wan = Object.assign({}, config.wan);
      }
      return result;
    },
    setWIFI(ssid, pwd) {
      config.wifi.ssid = ssid;
      config.wifi.password = pwd;
    },
    getWIFI() {
      return Object.assign({}, config.wifi);
    },
    setTimezone(timename, name, timezone, position) {
      config.timezone.timename = timename;
      config.timezone.name = name;
      config.timezone.timezone = timezone;
      config.timezone.position = position || 0;
    },
    getTimezone() {
      return Object.assign({}, config.timezone);
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
