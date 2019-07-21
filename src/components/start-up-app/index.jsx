/*
 * @Desc: 从浏览器H5打开喜马拉雅App
 * @Author: Eleven
 * @Date: 2019-07-21 23:40:56
 * @Last Modified by: Eleven
 * @Last Modified time: 2019-07-22 01:16:08
 */

import React from 'react'
import PropTypes from 'prop-types'
// 判断浏览器和系统种类: https://github.com/QLFE/mars-detect
import detect from 'mars-detect'
import './style'

export default class StartUpApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isDisabled: this.props.isDisabled,  // 是否禁用按钮
      loadingClass: '', // 按钮loading class
    }

    this.timer = null // 定时器,用于判定唤起app失败
  }

  static defaultProps = {
    text: '打开喜马拉雅App',  // 按钮文案
    isDisabled: false,  // 是否禁用按钮
    link: 'iting://open', // iting地址
    fail() {  // 启动失败，默认启动下载
      // 下载链接
      window.location.href = '//www.ximalaya.com/down'
      // 公用下载页面地址
      // window.location.href = '//m.ximalaya.com/applink'
    }
  }

  static propTypes = {
    text: PropTypes.string,
    isDisabled: PropTypes.bool,
    link: PropTypes.string,
    fail: PropTypes.func,
  }

  componentDidMount() {
    // 绑定页面切换事件
    this.bindPageChange()
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  /**
   * 启动喜马拉雅app:
   *  1.微信屏蔽了直接唤起app,所以选择跳转对应下载页;
   *  2.不通过以下方式,直接暴力跳往'//m.ximalaya.com/applink',也可以;
   *
   * 不错的参考实践: https://www.cnblogs.com/simba-lkj/p/8027809.html
   */
  openApp = () => {
    // loading,并禁用(防重复点击).
    this.setState({
      isDisabled: 'disabled',
      loadingClass: 'loading',
    })

    const itingLink = this.props.link
    const isIos = detect.os.ios
    const isAndroid = detect.os.android
    const isWeixin = detect.browser.weixin
    const startTime = Date.now()
    const timeout = 2300
    const { resetBtn, handlerFail } = this

    // 微信屏蔽了直接唤起app,所以选择跳转对应下载页.
    if (isWeixin) {
      // 安卓前往应用宝下载页,其他进入另一种下载页
      const url = isAndroid ? '//www.ximalaya.com/down' : '//m.ximalaya.com/applink'

      window.location.href = url
      return
    }

    // ios直接启动更好
    if (isIos) {
      window.location.href = itingLink
    }

    // 安卓通过iframe启动更好
    if (isAndroid) {
      let iframe = document.createElement('iframe')

      iframe.src = itingLink
      iframe.style.display = 'none'
      document.body.appendChild(iframe)

      // 2秒后移除iframe
      setTimeout(() => {
        iframe && document.body.removeChild(iframe)
      }, 2000)
    }

    /**
     * 启动定时器,几秒后(大约2300毫秒比较合适)执行唤起失败逻辑.
     *  1.成功唤起了app,会将当前浏览器切到后台,导致浏览器的定时器变慢;
     *  2.唤起失败: 浏览器未被切到后台,定时器运行正常,以此来判定唤起失败;
     */
    this.timer = setTimeout(() => {
      // 定时器没有变慢,判定唤起失败.
      if (Date.now() - startTime < timeout + 300) {
        handlerFail()
        resetBtn()
      }
    }, timeout)
  }

  /**
   * 重置启动按钮
   */
  resetBtn = () => {
    // 移除禁用、loading
    this.setState({
      isDisabled: false,
      loadingClass: '',
    })
  }

  /**
   * 绑定页面切换事件,第一次触发时移除启动失败定时器,重置按钮.
   */
  bindPageChange = () => {
    const _this = this

    document.addEventListener('visibilitychange', function() {
      const tag = document.hidden || document.webkitHidden
      tag && _this.timer && clearTimeout(_this.timer)
      _this.resetBtn()
    })
    document.addEventListener('webkitvisibilitychange', function() {
      const tag = document.hidden || document.webkitHidden
      tag && _this.timer && clearTimeout(_this.timer)
      _this.resetBtn()
    })
    window.addEventListener('pagehide', function() {
      _this.timer && clearTimeout(_this.timer)
      _this.resetBtn()
    })
  }

  /**
   * 唤起失败执行
   */
  handlerFail = () => {
    const { fail } = this.props

    fail()
  }

  render() {
    const { openApp } = this
    const { isDisabled, loadingClass } = this.state
    const { text } = this.props

    return (
      <button
        className={`open-app ${loadingClass}`}
        disabled={isDisabled}
        onClick={openApp}
      >
        {text}
      </button>
    )
  }
}
