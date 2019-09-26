/**
 * 构建工具配置文件
 * @Author: Junting.liu
 * @Date: 2019-09-04 16:11:14
 * @Last Modified by: Junting.liu
 * @Last Modified time: 2019-09-04 17:02:54
 */

module.exports = {
  // 配置 dll 入口
  dllEntry: {

  },
  // 静态资源的路径
  publicPath: '',
  // 资源输出目录，默认为 dist
  outputDir: 'dist',
  // 是否启用页面调试工具
  enableDebugTool: true,
  // 配置代理
  proxy: {},
  // 是否默认打开浏览器
  autoOpenBrowser: true,

  // devServer 默认端口号
  devServerPort: 3000,

  // mock 服务端口
  mockServerPort: 8000,

  // 部署的服务器类型： ecs|oss 默认 osss
  deployType: '',
  // 只有当 deployType 为 ecs 时才需要配置该选项
  ECSAccount: {
    host: '',
    port: '',
    user: ''
  },
  // 只有当 deployType 为 oss 时才需要配置该选项
  ftpAccount: {
    host: '',
    port: '',
    user: '',
    password: ''
  },

  // 部署的目录
  deployDir: '',

  // 指定浏览器的范围
  browserslist: {
    legacy: '',
    modern: ''
  }
};
