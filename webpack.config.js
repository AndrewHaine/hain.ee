/*
  Webpack - for the frontend build
 */

const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/*
  Plugins
*/

const defineProduction = new webpack.DefinePlugin({'process.env': {NODE_ENV: JSON.stringify('production')}});
const uglify = new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}, minimize: true});
const extractCss = new ExtractTextPlugin({filename: 'styles.min.css'});
const hotReload = new webpack.HotModuleReplacementPlugin();
const commonsChunk = new webpack.optimize.CommonsChunkPlugin({
  name: 'vendors',
  minChunks: function(module) {
    return module.context && module.context.includes("node_modules");
  }
});

/*
  Loaders
*/

const javascript = {
  test: /\.js(x)?$/i,
  exclude: /node_modules(?!\/webpack-dev-server)/,
  use: [
    {
      loader: 'babel-loader'
    },
    {
      loader: 'eslint-loader'
    }
  ]
};

let css;
const standardCssLoaders = [
  {
    loader: 'css-loader',
    options: {sourceMap: true}
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      plugins() {
        return [
          autoprefixer({
            'browsers': ['last 2 versions']
          }),
          cssnano()
        ];
      }
    }
  },
  {
    loader: 'sass-loader',
    options: {sourceMap: true}
  }
];

if(process.env.NODE_ENV === 'eject') {
  css = {
    test: /\.sass$/i,
    use: extractCss.extract({
      fallback: 'style-loader',
      use: standardCssLoaders
    })
  };
} else {
  const cssToJs = ['style-loader'].concat(standardCssLoaders);
  css = {
    test: /\.sass$/i,
    include: /public\/sass/,
    exclude: /node_modules/,
    use: cssToJs
  };
}

const svg = {
  test: /\.svg$/i,
  use: 'svg-url-loader'
};

const devServer = {
  contentBase: path.join(__dirname, '/dist/'),
  host: '0.0.0.0',
  hot: true,
  inline: true,
  port: 3202,
  proxy: {
    '*': {
      target: 'https://localhost:3204',
      protocol: 'https'
    }
  },
  publicPath: '/dist/'
};

let plugins;
if(process.env.NODE_ENV === 'eject') {
  plugins = [defineProduction, uglify, extractCss, hotReload, commonsChunk];
} else {
  plugins = [hotReload];
}

/*
  Config
*/

const conf = {
  entry: process.env.NODE_ENV === 'eject' ? './public/js/index.js' : [
    'react-hot-loader/patch',
    'webpack-dev-server/client?https://localhost:3204',
    'webpack/hot/only-dev-server',
    './public/js/index.js',
  ],
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: '[name].min.js',
    publicPath: '/dist/'
  },
  module: {
    rules: [javascript, css, svg]
  },
  devServer: devServer,
  plugins: plugins
};

module.exports = conf;
