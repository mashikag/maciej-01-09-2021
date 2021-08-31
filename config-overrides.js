const WorkerPlugin = require("worker-plugin");

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  config.plugins.push(new WorkerPlugin());

  return config;
};