module.exports = {
  // 是一个以缩进为基础的语法，类似于 Sass 和 Stylus
  // https://github.com/postcss/sugarss
  // parser: 'sugarss',
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {},
    'cssnano': {},
    'postcss-flexbugs-fixes': {},
  }
}