/**
 * 路由和数据的聚合
 * @Author: Junting.liu
 * @Date: 2019-07-15 14:52:25
 * @Last Modified by: Junting.liu
 * @Last Modified time: 2019-07-15 16:23:33
 */

const api = require('./api');
const getUserInfo = require("./data/getUserInfo.js");

const config = [
  {
    method: 'get',
    url: api.getUserInfo,
    data: getUserInfo
  }
];

module.exports = config;
