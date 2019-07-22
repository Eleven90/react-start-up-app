/*
 * @Desc: 从浏览器H5启动手机App
 * @Author: Eleven
 * @Date: 2019-07-21 23:40:56
 * @Last Modified by: Eleven
 * @Last Modified time: 2019-07-22 10:48:09
 */

import React from 'react'
import PropTypes from 'prop-types'
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
    text: '打开App',  // 按钮文案
    isDisabled: false,  // 是否禁用按钮
    link: '', // URL scheme
    timeout: 2300, // 预留的 app 启动时间
    funcInWeixin() {
      // 微信屏蔽了直接唤起app => 所以需要自己去做一点操作，例如：区分安卓、IOS，选择跳转对应下载页。
    },
    fail() {
      // 启动失败，默认启动下载
    }
  }

  static propTypes = {
    text: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    link: PropTypes.string.isRequired,
    timeout: PropTypes.number,
    funcInWeixin: PropTypes.func,
    fail: PropTypes.func.isRequired,
  }

  componentDidMount() {
    // 绑定页面切换事件
    this.bindPageChange()
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  openApp = () => {
    // loading,并禁用(防重复点击).
    this.setState({
      isDisabled: 'disabled',
      loadingClass: 'loading',
    })

    const link = this.props.link
    const isIos = detect.os.ios
    const isAndroid = detect.os.android
    const isWeixin = detect.browser.weixin
    const startTime = Date.now()
    const timeout = this.props.timeout
    const { resetBtn, handlerFail } = this

    // 微信屏蔽了直接唤起app，所以需要执行特殊操作。
    if (isWeixin) {
      const { funcInWeixin } = this.props
      typeof funcInWeixin === 'function' && funcInWeixin()
      return
    }

    // ios直接启动更好
    if (isIos) {
      window.location.href = link
    }

    // 安卓通过iframe启动更好
    if (isAndroid) {
      let iframe = document.createElement('iframe')

      iframe.src = link
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
