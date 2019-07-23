/*
 * @Desc: 从浏览器H5启动手机App
 * @Author: Eleven
 * @Date: 2019-07-21 23:40:56
 * @Last Modified by: Eleven
 * @Last Modified time: 2019-07-23 20:51:19
 */

import React from 'react'
import PropTypes from 'prop-types'
import './style'

const ua = window.navigator.userAgent
const isIOS = /(ipad|iphone|ipod)/i.test(ua)
const isAndroid = /android/i.test(ua)
const isWeChat = /MicroMessenger/i.test(ua)


export default class StartUpApp extends React.Component {
  static defaultProps = {
    text: '打开App',  // 按钮文案
    link: '', // URL scheme
    isDisabled: false,  // 初始是否禁用按钮
    autoLoading: true, // 启动过程中是否启用 loading
    timeout: 2300, // 预留的 app 启动时间
    fail() {
      // 启动失败时执行
      // 微信环境中直接执行
      // 微信屏蔽了直接唤起app => 所以需要自己去做一点操作，例如：区分安卓、IOS，选择跳转对应下载页。
    }
  }

  static propTypes = {
    text: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    autoLoading: PropTypes.bool,
    timeout: PropTypes.number,
    fail: PropTypes.func.isRequired,
  }
  
  constructor(props) {
    super(props)

    this.state = {
      isDisabled: this.props.isDisabled,  // 是否禁用按钮
      loadingClass: '', // 按钮loading class
    }

    this.timer = null // 定时器,用于判定唤起app失败
  }

  componentDidMount() {
    // 绑定页面切换事件
    this.bindPageChange()
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  /**
   * 启动 app
   */
  openApp = () => {
    // loading,并禁用(防重复点击).
    this.setState({
      isDisabled: 'disabled',
      loadingClass: this.props.autoLoading ? 'loading' : '',
    })

    const link = this.props.link
    const startTime = Date.now()
    const timeout = this.props.timeout
    const { resetBtn, handlerFail } = this

    // 微信屏蔽了直接唤起app，所以需要执行特殊操作。
    if (isWeChat) {
      handlerFail()
      return
    }

    // ios直接启动更好
    if (isIOS) {
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
   * 唤起失败执行
   */
  handlerFail = () => {
    const { fail } = this.props
    typeof fail === 'function' && fail(isWeChat)
    this.resetBtn()
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
    this.timer && clearTimeout(this.timer)
  }

  /**
   * 绑定页面切换事件,第一次触发时移除启动失败定时器,重置按钮.
   */
  bindPageChange = () => {
    const _this = this

    document.addEventListener('visibilitychange', function() {
      const isHidden = document.hidden || document.webkitHidden
      isHidden && _this.resetBtn()
    })
    document.addEventListener('webkitvisibilitychange', function() {
      const isHidden = document.hidden || document.webkitHidden
      isHidden && _this.resetBtn()
    })
    window.addEventListener('pagehide', function() {
      _this.resetBtn()
    })
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
