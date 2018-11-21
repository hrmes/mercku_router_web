module.exports = function getCustomerConfig(customer_id) {
  let config = {};
  if (customer_id === '0001') {
    config = {
      IS_DEFAULT: false,
      IS_CIK: false,
      IS_MERCKU: true,
      ACCEPT: '".ma"'
    };
  } else if (customer_id === '0002') {
    config = {
      IS_DEFAULT: false,
      IS_CIK: true,
      IS_MERCKU: false,
      ACCEPT: '".ca"'
    };
  } else if (customer_id === '0000') {
    config = {
      IS_DEFAULT: true,
      IS_CIK: false,
      IS_MERCKU: false,
      ACCEPT: '"*.*"'
    };
  }
  return config;
};
