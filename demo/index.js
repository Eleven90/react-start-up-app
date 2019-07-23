
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'
import StartUpApp from 'src/components/start-up-app'
import vConsole from 'vconsole'

// 网页 reset
import('@eleven.xi/reset.css')
import('./style')

new vConsole()


class App extends Component {
  fail = isWeChat => {
    // isWeChat，回调参数，是否是微信
    if(isWeChat) {
      alert('微信屏蔽了直接唤起app（即使已安装了 App，也无法唤起），并且安卓、IOS微信有不同的限制策略，所以需要自己去做一点操作，例如：区分安卓、IOS，选择跳转对应下载页，或者跳app store、安卓应用市场，或其它操作。')
      return
    }

    alert('启动失败（未安装 App）需要执行的操作，大多数时候是跳转app下载页.')
  }
  
  render() {
    return (
      <div className="demo-wrap">
        <StartUpApp 
          text="打开支付宝App"
          isDisabled={false}
          autoLoading={true}
          link={'alipays://'}
          timeout={2300}
          fail={this.fail}
        />
      </div>
    )
  }
}

hot(module)(App)
ReactDOM.render(<App />, document.getElementById('app'))
