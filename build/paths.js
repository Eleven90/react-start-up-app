const { resolveApp } = require('./utils')

module.exports = {
  appDist: resolveApp('dist'),
  appSrc: resolveApp('src'),
  appDemo: resolveApp('demo'),
}
