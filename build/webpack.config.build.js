process.env.NODE_ENV = 'production'
process.env.devtool = false

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.config.base')
const CleanPlugin = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const safePostCssParser = require('postcss-safe-parser')

const shouldUseSourceMap = process.env.devtool

module.exports = merge(base, {
  mode: 'production',
  output: {
    filename: '[name].min.js',
    chunkFilename: '[name].min.js',
    libraryTarget: 'umd',
    // library: 'reactStartUpApp', // 不设置 => 不挂载到 window/global
    libraryExport: 'default',
  },
  devtool: shouldUseSourceMap,
  externals: {
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    }
  },
  plugins: [
    new CleanPlugin([path.resolve(__dirname, '..', 'dist/*')], {
      allowExternal: true,
    }),
    // new MiniCssExtractPlugin({
    //   filename: '[name].min.css',
    //   chunkFilename: '[name].min.css',
    // }),
    new webpack.HashedModuleIdsPlugin(),
  ],
  optimization: {
    minimizer: [
      // cheap-source-map选项不适用于此插件（TerserPlugin）
      new TerserPlugin({
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
            drop_debugger: true, // 删除debugger
            drop_console: true, // 删除console
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,  // 移除注释
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
            beautify: false, // 不美化输出
          },
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: false,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,  // https://github.com/postcss/postcss-safe-parser
          map: shouldUseSourceMap
            ? {
                // `inline: false` forces the sourcemap to be output into a
                // separate file
                inline: false,
                // `annotation: true` appends the sourceMappingURL to the end of
                // the css file, helping the browser find the sourcemap
                annotation: true,
              }
            : false,
        },
      }),
    ],
  },
})
