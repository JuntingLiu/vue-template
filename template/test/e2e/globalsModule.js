var HtmlReporter = require('nightwatch-html-reporter');

module.exports = {
  reporter(results, done) {
    let moduleKey = Object.keys(results.modules)[0];
    const reporter = new HtmlReporter({
      openBrowser: true,
      reportsDirectory: __dirname + '/reports/',
      reportFilename: results.modules[moduleKey].reportPrefix + 'report.html'
    });
    reporter.fn(results, done)
  }
}
