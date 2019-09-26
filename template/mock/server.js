/**
 * 使用 Express 搭建 Mock 服务
 * @Author: Junting.liu
 * @Date: 2019-07-15 14:00:34
 * @Last Modified by: Junting.liu
 * @Last Modified time: 2019-09-04 17:27:21
 */

const express = require('express');
const bodyParser = require('body-parser'); // 解析请求体
const multipart = require('connect-multiparty'); // 处理文件上传的模块中间件
const Mock = require('mockjs');
const config = require('./config');
const appConfig = require('../app.config')
const multipartMiddleware = multipart();
const app = express();

// 定义 mock 方法
const mock = (data, params) => {
  if (Object.prototype.toString.call(data) === '[object Object]') {
    return Mock.mock(data);
  } else if (typeof data === 'function') {
    return Mock.mock(data(params));
  } else {
    return 'error: data should be an object or a function.'
  }
};

// 使用中间件，过滤数据
app.use(bodyParser.urlencoded({ extended: false })); // 只接收字符串和数组
app.use(bodyParser.json());
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', 'mock');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

// 绑定路由信息
config.forEach(({ method, url, data }) => {
  if (method === 'get') {

    app.get(url, (req, res) => {
      res.json(mock(data, req.body));
    })
  } else if (method === 'post') {
    app.post(url, multipartMiddleware, (req, res) => {
      res.json(mock(data, req.body));
    })
  } else if (method === 'post') {
    app.get(url, (req, res) => {
      const query = req.query;
      const mockData = JSON.stringify(mock(data, req.query));

      const callback = `
        typeof ${query.callback} === function && ${query.callback} ("${mockData}")
      `;
      res.send(callback);
    })
  }
})


// 支持自定义接口
let port = appConfig.mockServerPort ||  8081;
process.argv.forEach((arg, index, arr) => {
  if (arg === '--port') {
    port = arr[index + 1] || 8081;
    return false;
  }
});

module.exports = app.listen(port, () => {
  console.log('Mock Server listening on http://localhost:' + port);
});
