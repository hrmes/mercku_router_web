/*
  note: name will be add to config as boolean `is${name}`.
  so the name is canse senitive
*/
const Customers = {
  '0001': {
    name: 'Mercku',
    conf: require('./mercku.json')
  },
  '0002': {
    name: 'Cik',
    conf: require('./cik.json')
  }
};

function getSpecialConf(customerId) {
  const customer = Customers[customerId];
  if (!customer) {
    console.log(`error: this customer id(${customerId}) is invalid`);
    return null;
  }
  return customer.conf;
}

function getBaseConf(customerId) {
  const result = {};
  Object.keys(Customers).forEach(key => {
    const customer = Customers[key];
    if (key === customerId) {
      result[`is${customer.name}`] = true;
    } else {
      result[`is${customer.name}`] = false;
    }
  });
  return result;
}

module.exports = function getCustomerConf(customerId) {
  const base = getBaseConf(customerId);
  const special = getSpecialConf(customerId);
  const config = Object.assign({}, base, special);
  return config;
};
