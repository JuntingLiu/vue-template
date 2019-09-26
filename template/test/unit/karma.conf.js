const webpackConfig = require('../../build/webpack.config.test');

module.exports = function (config) {
  config.set({
    frameworks: ['mocha'], // 指定测试框架
    // 需要将 dll 文件添加到入口文件的前面，否则会报错。
    files: ['../../dll/*.js', './index.js'], // 运行测试时文件入口
    // 预处理，前置执行
    preprocessors: {
      // 执行 index.js 测试入口文件前先预处理
      './index.js': ['webpack']
    },
    browsers: ['Chrome'], // 指定浏览器进行测试
    webpack: webpackConfig, // 为 Karma 指定 webpack 配置文件
    reporters: ['spec', 'coverage'], // 生成测试报告工具,再激活覆盖率报告生成器
    port: 9876
  })
};
