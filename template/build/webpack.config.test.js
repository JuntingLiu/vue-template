const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');
const { configureBabelLoader } = require('./utils');

let testConfig = merge(baseConfig, {
  devtool: 'inline-source-map',
  module: {
    rules: [
      configureBabelLoader()
    ]
  }
});

// 不需要 webpack 的入口, 在 karma 配置文件里已经指定
delete testConfig.entry;
module.exports = testConfig;
