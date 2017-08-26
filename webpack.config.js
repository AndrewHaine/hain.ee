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

const uglify = new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}});

const extractCss = new ExtractTextPlugin({filename: 'styles.min.css'});

/*
  Loaders
*/

const javascript = {
  test: /\.js$/i,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader',
      options: {presets: ['es2015']}
    },
    {
      loader: 'eslint-loader'
    }
]
};

const css = {
  test: /\.sass$/i,
  use: extractCss.extract({
    fallback: 'style-loader',
    use: [
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
            ]
          }
        }
      },
      {
        loader: 'sass-loader',
        options: {sourceMap: true}
      }
    ]
  })
};

const svg = {
  test: /\.svg$/i,
  use: 'svg-url-loader'
};

/*
  Config
*/

const conf = {
  entry: './public/js/bundle.js',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: 'scripts.min.js'
  },
  module: {
    rules: [javascript, css, svg]
  },
  plugins: [
    extractCss,
    uglify
  ]
};

module.exports = conf;
