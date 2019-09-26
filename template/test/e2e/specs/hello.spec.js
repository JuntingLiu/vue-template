module.exports = {
  '对 Hello.vue 组件进行功能测试': function (browser) {
    browser.url('http://localhost:3000').waitForElementVisible('#app', 1000);
    browser.expect.element('.title').to.be.present;
    browser.expect.element('.title').text.to.equal('Follow your instincts.');
    browser.end();
  }
}
