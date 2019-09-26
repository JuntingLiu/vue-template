const chromeDriver = require('chromedriver');
const geckoDriver = require('geckodriver');

module.exports = {
  // 指定测试用例所在的目录
  src_folders: ['test/e2e/specs'],
  // 指定测试报告的输出目录
  output_folder: 'test/e2e/reports',
  // 设置全局模块的路径
  globals_path: 'globalsModule.js',
  // WebDriver 相关的配置
  webdriver: {
    start_process: true, // 是否自动管理 WebDriver 的进程
    // 如果只是单个环境进行测试，如 chrome 在这里配置 server_path 就好了，多环境下就需要到各环境里进行配置；test_settings里设置了规则，以下 server_path 就不适合在这里配置了
    //server_path: geckoDriver, // 指定 WebDriver 所在的目录
    //port: 9515 // 指定 WebDriver 服务所监听的端口
  },
  // 设置与测试相关的选项
  test_settings: {
    default: {
      webdriver: {
        server_path: chromeDriver.path,
        port: 9515
      },
      // 浏览器能力
      desiredCapabilities: {
        browserName: 'chrome'
      }
    },
    // 多环境，可以在命令行通过 --env 来指定需要测试的环境，
    chrome: {
      webdriver: {
        server_path: chromeDriver.path,
        port: 9515
      },
      desiredCapabilities: {
        browserName: 'chrome'
      }
    },
    firefox: {
      webdriver: {
        server_path: geckoDriver.path,
        port: 4444
      },
      desiredCapabilities: {
        browserName: 'firefox'
      }
    }
  }
};
