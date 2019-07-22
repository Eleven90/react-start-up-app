const path = require('path')
const os = require('os')
const HappyPack = require('happypack')
const HappyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const paths = require('./paths')
// 抽离css的hash命名与热更新有冲突，热更新时使用style-loader。
const styleLoader = process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader

module.exports = {
  entry: {
    index: path.resolve(__dirname, '..', 'src/index.js'),
  },
  output: {
    path: paths.appDist,
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/',
  },
  stats: {
    chunks: false,
    children: false,
    modules: false,
    entrypoints: false,
    performance: false,
  },
  performance: {
    hints: false, // 关闭文件体积较大提示
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css', '.less'],
    alias: {
      src: paths.appSrc,
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // use: [styleLoader, 'css-loader', 'postcss-loader'],
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.less$/,
        // use: [styleLoader, 'css-loader', 'postcss-loader', 'less-loader'],
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        include: paths.appSrc,
        exclude: /node_modules/,
        options: {
          formatter: require('eslint-friendly-formatter'),
        },
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'happypack/loader',
        include: [paths.appSrc, paths.appDemo],
        exclude: /node_modules/,
        options: {
          id: 'happy-babel',
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'images/[name].[hash:7].[ext]',
        },
      }
    ],
  },
  plugins: [
    // 将babel-loader需要执行的动作，交给happypack
    new HappyPack({
      id: 'happy-babel',
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        }
      ],
      threadPool: HappyThreadPool,
      verbose: true   // 允许happypack输出日志
    })
  ],
}
