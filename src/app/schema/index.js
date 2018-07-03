const routerConfig = () => {
  const config = {
    wifi: {
      ssid: '',
      password: '',
      hidden: false,
      admin_password: ''
    },
    wan: {
      type: '' // static,dhcp,pppoe
      /*
        netinfo: {
          ip:'',
          mask:'',
          gateway:'',
          dns:[]
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
        wan: Object.assign({}, config.wan)
      };
      return result;
    },
    setWIFI(ssid, pwd, adminPassword) {
      config.wifi.ssid = ssid;
      config.wifi.password = pwd;
      config.wifi.admin_password = adminPassword;
    },
    getWIFI() {
      return Object.assign({}, config.wifi);
    },
    setWan(type, options) {
      if (!Object.keys(wanType).includes(type)) {
        console.log('wan type not support!');
      } else {
        const wan = {};
        wan.type = type;
        config.wan = wan;
        if (!options) {
          return;
        }
        if (wanType.static === type) {
          wan.netinfo = {
            ip: options.ip,
            mask: options.mask,
            gateway: options.gateway,
            dns: options.dns
          };
        } else if (wanType.pppoe === type) {
          wan.pppoe = {
            account: options.account,
            password: options.password
          };
        }
      }
    },
    getWan() {
      const result = {
        type: config.wan.type
      };
      switch (config.wan.type) {
        case wanType.static:
          Object.assign(result, config.wan.netinfo);
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
