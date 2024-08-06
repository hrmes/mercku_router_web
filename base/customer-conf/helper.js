const path = require('path');

function defineConf(rawConf, dirname) {
  const conf = {
    ...rawConf,
  };

  if (conf.images) {
    for (const [key, value] of Object.entries(conf.images)) {
      conf.images[key] = path.resolve(dirname, value);
    }
  }

  return conf;
}

module.exports = { defineConf };
