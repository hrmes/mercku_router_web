module.exports = function customerConfig(customer_id) {
  let config;
  if (customer_id === '0001') {
    config = {
      TITLE: '"Mercku"',
      IS_DEFAULT: false,
      IS_CIK: false,
      IS_MERCKU: true,
      ACCEPT: '".ma"',
      FAVICO: '"public/fav_mercku.ico"'
    };
  } else if (customer_id === '0002') {
    config = {
      TITLE: '"CIK TELECOM"',
      IS_DEFAULT: false,
      IS_CIK: true,
      IS_MERCKU: false,
      ACCEPT: '".ca"',
      FAVICO: '"public/fav_cik.ico"'
    };
  } else if (customer_id === '0000') {
    config = {
      TITLE: '"Mercku"',
      IS_DEFAULT: true,
      IS_CIK: false,
      IS_MERCKU: false,
      ACCEPT: '"*.*"',
      FAVICO: '"public/fav_mercku.ico"'
    };
  }
  return config;
};
