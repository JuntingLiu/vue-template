/**
 * Karma 指定的入口文件
 * @Author: Junting.liu
 * @Date: 2019-08-19 19:37:18
 * @Last Modified by: Junting.liu
 * @Last Modified time: 2019-08-21 16:29:53
 */

import Vue from 'vue';

Vue.config.productionTip = false;

// // 加载 test/unit/specs 目录中所有以 .spec.js 结尾的文件
const testContext = require.context('./specs', true, /\.spec.js$/);
// 动态加载所有后缀 .spec.js 测试文件
testContext.keys().forEach(testContext);

// 加载除 app.js 外所有源文件，这些文件将用作覆盖率测试
const srcContext = require.context('../../src', true, /^\.\/(?!app(\.js)?$)/);
srcContext.keys().forEach(srcContext);
