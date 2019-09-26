const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 处理路径
const resolve = (dir) => {
  return path.resolve(__dirname, '..', dir);
}

// css-loader
// 生产环境需要安装 ExtractTextPlugin 插件
const configureCSSLoader = env => {
  env = getEnv(env);
  if (env === 'prod') {
    return {
      test: /\.(sc|c)ss$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [ // 从右向左依次调用
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('postcss-preset-env')()]
            }
          },
          'sass-loader'
        ]
      })
    }
  }
  return {
    test: /\.scss$/,
    exclude: /node_modules/,
    use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
  }
}

// url-loader 配置
const configureURLLoader = env => {
  env = getEnv(env);
  const rules = [
    { test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, type: 'img' },
    { test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, type: 'media' },
    { test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, type: 'font' }
  ];

  return rules.map(rule => {
    const { test, type } = rule;
    let name = env === 'prod' ? `${type}/[name].[hash:8].[ext]` : `${type}/[name].[ext]`;
    return {
      test,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8092,
            name
          }
        }
      ]
    }
  });
};

// babel-loader 配置
const configureBabelLoader = (browserslist = null) => {
  let options = {
    cacheDirectory: true
  };
  if (browserslist) {
    options = Object.assign(options, {
      babelrc: false, // 禁止使用 babelrc 配置文件
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            corejs: '2',
            useBuiltIns: 'usage',
            targets: {
              // 其规则，区分现代浏览器和旧浏览器
              browsers: browserslist
            }
          }
        ]
      ]
    });
  }
  let babelLoader = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: [ 'thread-loader', { loader: 'babel-loader' , options } ]
  }
  return babelLoader;
};

/**
 * 返回合法的环境值
 * @param {String} env
 */
const getEnv = function(env) {
  if (env === 'test' || env === 'prod') {
    return env;
  }
  return 'dev';
};

// 对比原图生成 1/2 尺寸相关 css
const spritesTemplateFunction = (data) => {
  const shared = '.ico { background-image: url(I); background-size: Wpx Hpx;}'
    .replace('I', data.spritesheet.image)
    .replace('W', data.spritesheet.width / 2)
    .replace('H', data.spritesheet.height / 2);
  const perSprite = data.sprites.map(sprite => {
    return '.ico-N { width: Wpx; height: Hpx; background-position: Xpx Ypx; }'
      .replace('N', sprite.name)
      .replace('W', sprite.width / 2)
      .replace('H', sprite.height /2)
      .replace('X', sprite.offset_x / 2)
      .replace('Y', sprite.offset_y / 2);
  }).join('\n');

  return shared + '\n' + perSprite;
}

module.exports = {
  configureCSSLoader,
  configureURLLoader,
  configureBabelLoader,
  spritesTemplateFunction,
  resolve,
  getEnv
}
