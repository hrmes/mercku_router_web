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
    // timezone: {
    //   name: '',
    //   timezone: '',
    //   position: ''
    // },
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
        wan: Object.assign({}, config.wan),
        // timezone: {
        //   timezone: config.timezone.timezone,
        //   position: config.timezone.position
        // }
      };
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
        const wan = {};
        wan.type = type;
        switch (type) {
          case wanType.static:
            wan.static = {
              ip: options.ip,
              mask: options.mask,
              gateway: options.gateway,
              dns: options.dns
            };
            break;
          case wanType.pppoe:
            wan.pppoe = {
              account: options.account,
              password: options.password
            };
            break;
          default:
            break;
        }
        config.wan = wan;
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
