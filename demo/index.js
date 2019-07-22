
import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'
import StartUpApp from 'src/components/start-up-app'

// 网页 reset
import('@eleven.xi/reset.css')

class App extends Component {
  render() {
    return (
      <Fragment>
        <StartUpApp 
          text="打开微信App"
          isDisabled={false}
          link={'weixin://'} // 填写需要启动的 App 的 URL scheme，例如微信的是 'weixin://'
          timeout={2300} // 预留的 app 启动时间
          funcInWeixin={() => alert('微信屏蔽了直接唤起app，并且安卓、IOS微信有不同的限制策略，所以需要自己去做一点操作，例如：区分安卓、IOS，选择跳转对应下载页，或者跳app store、安卓应用市场。')}
          fail={() => alert('启动失败需要执行的操作，大多数时候是跳转app下载页')}
        />
      </Fragment>
    )
  }
}

hot(module)(App)
ReactDOM.render(<App />, document.getElementById('app'))
