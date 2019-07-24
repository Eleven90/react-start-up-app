process.env.NODE_ENV = 'development'
process.env.devtool = 'cheap-module-source-map'

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const base = require('./webpack.config.base')
const paths = require('./paths')

module.exports = merge(base, {
  mode: 'development',
  entry: {
    demo: path.resolve(__dirname, '..', 'demo/index.js'),
  },
  devtool: process.env.devtool,
  devServer: {
    contentBase: paths.appDist,
    // openPage: 'index.html', // 指定默认启动浏览器时打开的页面
    index: 'index.html', // 指定首页位置
    // host: 'localhost',  // '0.0.0.0' 可以通过外网访问
    host: '0.0.0.0',  // '0.0.0.0' 可以通过外网访问
    port: 3000,
    inline: true,
    hot: true,
    open: true,
    compress: true,
    disableHostCheck: true,
    quiet: false,
    clientLogLevel: 'none',
    watchContentBase: true,
    stats: {
      chunks: false,
      children: false,
      modules: false,
      entrypoints: false,
      performance: false,
    },
    historyApiFallback: {
      disableDotRule: true,
    },
    watchOptions: {
      ignored: /node_modules/,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '..', 'demo/index.html'),
      inject: false,
      chunks: ['index', 'demo'],
      inject: true,
    }),
    new webpack.NamedModulesPlugin(),
  ],
})
