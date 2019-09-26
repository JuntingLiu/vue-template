/**
 *
 * ModernBuildPlugin 自定义 webpack 插件
 * @Author: Junting.liu
 * @Date: 2019-07-17 20:48:39
 * @Last Modified by: Junting.liu
 * @Last Modified time: 2019-08-01 17:31:58
 * 涉及资料：
 * [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin#configuration)
 */
const fs = require('fs-extra');
const path = require('path');

// Safari 10 的一个 bug
const safariFix = '!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()},!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();';

class ModernBuildPlugin {
  constructor({ modern }) {
    this.isModernBuild = modern;
  }
  // 供 webpack 调用
  apply(compiler) {
    if (!this.isModernBuild) {
      this.applyOld(compiler);
    } else {
      this.applyModern(compiler);
    }
  }

  applyOld(compiler) {
    const ID = 'old-bundle';
    compiler.hooks.compilation.tap(ID, compilation => {
      // 编译阶段
      // htmlWebpackPluginAlterAssetTags 钩子，这个阶段已经构建好了相关资源信息
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
        ID,
        async (data, cb) => {
          // 将构建好的资源信息对象，提取保存到一个临时文件
          const htmlName = path.basename(data.plugin.options.filename);
          const htmlPath = path.dirname(data.plugin.options.filename);
          const tempFilename = path.join(
            htmlPath,
            `old-assets-${htmlName}.json`
          );
          await fs.mkdirp(path.dirname(tempFilename)); // 创建目录
          await fs.writeFile(tempFilename, JSON.stringify(data.body));
          cb();
        }
      )
    })
  }

  applyModern(compiler) {
    const ID = 'modern-bundle';
    compiler.hooks.compilation.tap(ID, compilation => {
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
        ID,
        async (data, cb) => {
          // use <script type="module"> for modern assets
          data.body.forEach(tag => {
            if (tag.tagName === 'script' && tag.attributes) {
              tag.attributes.type = 'module';
            }
          });
          // inject Safari 10 nomodule fix
          data.body.push({
            tagName: 'script',
            closeTag: true,
            innerHTML: safariFix
          })

          // 提取旧浏览器编译生成的临时文件内容
          const htmlName = path.basename(data.plugin.options.filename);
          const htmlPath = path.dirname(data.plugin.options.filename);
          const tempFilename = path.join(
            htmlPath,
            `old-assets-${htmlName}.json`
          );
          // 提取出 script 标签内容信息
          const oldAssets = JSON.parse(
            await fs.readFile(tempFilename, 'utf-8')
          ).filter(a => a.tagName === 'script' && a.attributes);

          oldAssets.forEach(a => {
            a.attributes.nomodule = '';
          });
          // 现代模式下生成的资源信息添加旧模式下的 script 标签内容信息
          data.body.push(...oldAssets);
          await fs.remove(tempFilename); // 删除临时 old 文件
          cb();
        }
      )
      // 将两次构建的数据写入 html
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap(ID, data => {
        data.html = data.html.replace(/\snomodule="">/g, ' nomodule>');
      });
    });
  }
}

ModernBuildPlugin.safariFix = safariFix;
module.exports = ModernBuildPlugin;
