/**
 * Webpack 构建器
 * @Author: Junting.liu
 * @Date: 2019-07-17 20:48:10
 * @Last Modified by: Junting.liu
 * @Last Modified time: 2019-09-04 17:10:32
 */
const parseArgs = require('minimist'); // 轻量级命令行参数解析
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.prod')

const argv = parseArgs(process.argv.slice(2)); // 取出相关参数，并解析为对象格式
const { modern, env } = argv; // 提取模式、环境，用于判断现代构建还是旧浏览器构建形式

// 调用 webpack 进行编译代码
const createCompiler = config => {
  let compiler = webpack(config);
  return () => {
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) return reject(err);
        console.log(stats.toString({
          colors: true // 输出信息需要高亮
        }) + '\n');
        resolve();
      })
    })
  }
};

// 构建入口
const build = async () => {
  if (!modern) {
    // 生产环境普通包
    await createCompiler(webpackConfig(env, 'common'))();
  } else {
    // 生产环境 old 模式包
    await createCompiler(webpackConfig(env, 'old'))(); // 旧浏览器
    // 生产环境 modern 模式包
    await createCompiler(webpackConfig(env, 'modern'))(); // 现代浏览器
  }
};

build();
