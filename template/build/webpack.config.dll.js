const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { dllEntry } = require('../app.config');

const dllEntryKeys = Object.keys(dllEntry);
dllEntryKeys.forEach(key =>{
  if(typeof dllEntry[key] == 'string'){
    dllEntry[key] = [dllEntry[key]]
  }
})
let entry = Object.assign(
  {
    // 把 vue 模块放到一个单独的 dll 文件中
    vue: ['vue']
  },
  dllEntry
);


module.exports = {
  // 将mode设置为production
  // production模式下，webpack默认使用TerserPlugin对js进行压缩。
  mode: 'production',
  entry,
  output: {
    // 输出的 dll 文件的名称，[name] 代表当前dll文件的名称，
    // 也就是 entry 中配置的 vue
    filename: '[name].dll.js',
    // 输出的文件都放在 dll 目录下
    path: path.resolve(__dirname, '../dll'),
    // 存放dll文件的全局变量名称，例如对应 vue 来说就是 vue_[8位的hash值]
    // 拼接一个8位hash的目的是为了防止全局变量冲突
    library: '[name]_[hash:8]'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      // 描述 manifest.json 文件输出的目录及文件名称
      path: path.resolve(__dirname, '../dll','[name].manifest.json'),
      // dll 文件的全局变量名称，需要和 output.library 中保持一致
      // 该字段的值也就是输出的 manifest.json 文件中 name 字段的值
      // 例如：vue.manifest.json 中可能有形如 "name":"vue_6723as23" 这样的内容
      name: '[name]_[hash:8]'
    })
  ]
};
