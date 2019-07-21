const fs = require('fs')
const path = require('path')
const appDirectory = fs.realpathSync(process.cwd()) // 项目根路径

/**
 * 解析路径
 * @param {String} relativePath 相对路径
 */
const resolveApp = relativePath => {
  return path.resolve(appDirectory, relativePath)
}

module.exports = {
  resolveApp,
}