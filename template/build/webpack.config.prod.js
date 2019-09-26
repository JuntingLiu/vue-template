const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');
const webpack = require('webpack');
// const TerserPlugin = require('terser-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ModernBuildPlugin = require('./modernBuildPlugin');
const {
  configureBabelLoader,
  getEnv
} = require('./utils');
const config = require('../app.config');

// browserslist: 为 babel-loader 指定浏览器范围，用以划分现代浏览器和旧浏览器
let browserslist = {
  old: ['> 1%', 'last 2 versions', 'Firefox ESR'],
  modern: [
    'last 2 Chrome versions',
    'not Chrome < 60',
    'last 2 Safari versions',
    'not Safari < 10.1',
    'last 2 iOS versions',
    'not iOS < 10.3',
    'last 2 Firefox versions',
    'not Firefox < 54',
    'last 2 Edge versions',
    'not Edge < 15'
  ]
};

Object.keys(config.browserslist).forEach(key =>{
  if(typeof config.browserslist[key] == 'string' ){
    browserslist[key] = [config.browserslist[key]]
  } else if(Array.isArray(config.browserslist[key])) {
    browserslist[key] = config.browserslist[key]
  }
});

// env: 构建的环境
// buildMode: 表示生产普通构建包、现代浏览器构建包还是兼容旧浏览器构建包；取值范围 common、modern、old， 默认 common
module.exports = function (env = 'test', buildMode = 'common') {
  env = env === 'prod' ? env : 'test';

  if (buildMode !== 'old' && buildMode !== 'modern') {
    buildMode = 'common';
  }

  // 输出目录地址，文件名
  let filename = 'js/[name].js';
  // 插件集
  let plugins = [
    // JS 压缩
    // new TerserPlugin(),
    // css 压缩
    new OptimizeCSSPlugin(),
    // 模块 ID 基于文件名或者文件内容的哈希值,避免 vendors.js 三方库的 hash 值会因为修改了业务代码而放生变更，从而最大化利用浏览器缓存机制降低请求数（解决的是同步引入的包，异步引入的模块，还是会导致 hash 值变化）
    new webpack.HashedModuleIdsPlugin()
  ];

  // modern 模式下，需要给构建的资源加上后缀
  let postfix = buildMode === 'common' ? '' : `-${buildMode}`; // 打包后文件名前缀标识

  // 从 JS 文件中提取 css 来
  // 根据不同的构建环境，添加不同的 ExtractTextPlugin
  if (getEnv(env) === 'prod') {
    filename = `js/[name]${postfix}.[chunkhash:8].js`;
    plugins.push(new ExtractTextPlugin('css/[name].[hash:8].css'));
  } else {
    filename = `js/[name]${postfix}.js`;
    plugins.push(new ExtractTextPlugin('css/[name].css'));
  }

  // 构建模式是 modern 时
  if (buildMode === 'modern') {
    browserslist = browserslist.modern;
    plugins.push(
      new ModernBuildPlugin({ modern: true }),
      new CleanWebpackPlugin({
        // old 模式下所生成的 js 文件需要保留，所以只需要清除 js 文件以外的文件即可
        cleanOnceBeforeBuildPatterns: ['**/*', '!js', '!js/*']
      })
    );
  }

  // 构建模式是 old 时
  if (buildMode === 'old') {
    browserslist = browserslist.old;
    plugins.push(
      new ModernBuildPlugin({ modern: false }),
      new CleanWebpackPlugin()
    );
  }

  // 构建模式是普通构建
  if (buildMode === 'common') {
    plugins.push(new CleanWebpackPlugin());
  }

  // 规则
  let rules = [ configureBabelLoader(browserslist) ];

  // 生产环境配置
  const prodConfig = {
    // 启用 production 模式，启用该模式下内置的优化。
    mode: 'production',
    output: {
      filename
    },
    module: {
      rules
    },
    plugins,
    // 分离公共代码
    optimization: {
      // 采取 DllPlugin 开启预先编译，与 splitChunks 功能起到相似的作用，可以移除此优化
      // splitChunks: {
      //   cacheGroups: {
      //     // 缓存组,凡是符合缓存组中的条件的模块都被打包到以缓存组的 key 命名的包里
      //     vendors: {
      //       // 将代码中用到的所有位于 node_modules 中的模块都抽离到 vendors.js 中
      //       test: /[\\/]node_modules[\\/]/,
      //       name: 'vendors',
      //       chunks: 'all',
      //       reuseExistingChunk: true // 重用代码块
      //     }
      //   }
      // },
      // 运行时代码抽离到独立的 runtime.js 中
      runtimeChunk: 'single'
    }
  };

  return merge(baseConfig, prodConfig)
}
