const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');
const {
  resolve,
  configureBabelLoader
} = require('./utils.js');
const config = require('../app.config');

// 本地开发服务器配置
const devServer = {
  proxy: config.proxy || {},
  contentBase: resolve('dist'),
  hot: true, // 开启热更新
  clientLogLevel: 'warning',
  compress: true,
  overlay: true,
  open: config.autoOpenBrowser || true, // 自动打开浏览器新窗口
  port: config.devServerPort || 3000
};

module.exports = merge(baseConfig, {
  // 将 mode 设置为 development，启用 webpack 内置的优化
  mode: 'development',
  devtool: 'eval-source-map',
  devServer,
  module: {
    rules: [
      configureBabelLoader()
    ]
  }
});
