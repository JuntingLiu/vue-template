/**
 * Webpack 基础通用配置文件
 * @Author: Junting.liu
 * @Date: 2019-07-17 17:51:22
 * @Last Modified by: Junting.liu
 * @Last Modified time: 2019-09-05 10:19:53
 */
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

{{#stylelint}}
// 样式检查插件
const StyleLintPlugin = require('stylelint-webpack-plugin');
{{/stylelint}}
// 雪碧图插件
const SpritesmithPlugin = require('webpack-spritesmith');
// 调试工具插件
const DebugPlugin = require('jt-vconsole-webpack-plugin');
// 性能优化插件 - 缓存编译过程中的中间结果，利于下次编译
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
// 自动将资源插入 html 插件
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');

// 雪碧图样式模板函数
const { configureURLLoader, configureCSSLoader, spritesTemplateFunction, resolve } = require('./utils.js');

// 用户指定的配置
const config = require('../app.config');
// 轻量级命令行参数解析
const parseArgs = require('minimist');
const { env } = parseArgs(process.argv.slice(2));
const { entry } = require('./webpack.config.dll');
const dllNames = Object.keys(entry);
const dllRefs = dllNames.map(dllName => {
  return new webpack.DllReferencePlugin({
    manifest: require('../dll/' + dllName + '.manifest.json')
  });
});

const baseConfig = {
  mode: 'development',
  // 启用缓存
  cache: true,
  entry: {
    app: resolve('src/app.js')
  },
  output: {
    filename: '[name].js',
    path: resolve(config.outputDir || 'dist'),
    publicPath: config.publicPath || ''
  },
  resolve: {
    extensions: ['.vue', '.js'],
    // 解析模块时应该搜索的目录
    modules: ['../node_modules', '../src/assets/generated']
  },
  module: {
    rules: [
      {{#eslint}}
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/, // 忽略
        enforce: 'pre', // 未经其他 loader 转换的源代码，前置处理
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {{/eslint}}
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader'
      },
      // 添加 css-loader
      configureCSSLoader(env),
      // 添加 url-loader
      ...configureURLLoader(env),
    ]
  },
  plugins: [
    // 将其他规则复制并应用到 .vue 文件里相应的块中
    new VueLoaderPlugin(),
    // 缓存编译过程中的中间结果，利于下次编译
    new HardSourceWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: resolve('public/index.html')
    }),
    // webpack 需要根据 manifest.json 找到对应 dll 文件中的模块
    ...dllRefs,
    // 将 dll 文件添加到 html 中，必须在 HtmlWebpackPlugin 后面使用
    new AddAssetHtmlWebpackPlugin({
      // 需要将哪些文件插入到 html 中
      filepath: resolve('../dll/*.dll.js'),
      // 将 dll 文件输出到哪个目录
      outputPath: 'js',
      // dll 文件在页面中最终的引用路径
      publicPath: 'js'
    }),
    {{#stylelint}}
    // 样式检查
    new StyleLintPlugin({
      // 需要检查的文件
      files: ['src/**/*.{vue, css, sass, scss, less}', '!src/assets/generated/']
    }),
    {{/stylelint}}
    // 自动生成雪碧图
    new SpritesmithPlugin({
      src: { // 用来指定哪些图片需要合并成雪碧图
        cwd: resolve('src/assets/sprites'), // 原始图片所在目录
        glob: '*.png' // 符合规则的需要合并
      },
      customTemplates: {
        function_based_template: spritesTemplateFunction
      },
      target: { // 指定文件的输出
        image: resolve('src/assets/generated/sprite.png'), // 生成后雪碧图存放的路径
        css: [
          [
            resolve('src/assets/generated/sprite2.scss'), // 生成后样式文件存放路径
            {
              format: 'function_based_template'
            }
          ],
          resolve('src/assets/generated/sprite.scss'), // 生成后样式文件存放路径
        ]
      },
      apiOptions: {
        cssImageRef: '~sprite.png' // 雪碧图的路径
      },
      // 各小图之间的边距设置
      spritesmithOptions: {
        padding: 2,
      }
    }),
    // 是否启用调试工具, vConsole
    new DebugPlugin({ enable: config.enableDebugTool })
  ]
};

module.exports = baseConfig;
