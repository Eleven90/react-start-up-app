# [react-start-up-app](https://www.npmjs.com/package/@eleven.xi/react-start-up-app)

> 从浏览器 H5 启动手机 App，微信限制了启动 App，所以需要单独传入 callback 去执行自己的逻辑，例如：区分安卓、IOS，选择跳转对应下载页，或者跳app store、安卓应用市场。

## Installation

#### NPM

```js
npm i @eleven.xi/react-start-up-app
```

#### Yarn

```js
yarn i @eleven.xi/react-start-up-app
```

## Getting Started

```js
// 导入
import StartUpApp from '@eleven.xi/react-start-up-app'

// 组件调用、参数示例
<StartUpApp 
  text="打开支付宝App" // 按钮文案（默认：打开App）
  isDisabled={false} // 初始是否禁用按钮（默认：false）
  autoLoading={true} // 过程中是否启用按钮loading（默认：true）
  link={'alipays://'} // 填写需要启动的 App 的 URL scheme，例如支付宝的是 'alipays://'（必填）
  timeout={2300} // 预留的 app 启动时间（单位：毫秒，默认2300）
  funcInWeixin={isWeiXin} // 微信中执行传入的方法，受微信限制，无法启动 App（必填）
  fail={fail} // 启动失败时执行的回调（必填）
/>

// 微信中需要特殊处理，请传入 callback，检测到微信环境会自动执行
function isWeiXin() {
  alert('在微信中的 callback 方法，如果在微信环境，将自动执行此传入的方法；微信屏蔽了直接唤起app，并且安卓、IOS微信有不同的限制策略，所以需要自己去做一点操作，例如：区分安卓、IOS，选择跳转对应下载页，或者跳app store、安卓应用市场。')
}

// 如果用户没有安装 app，那么会启动失败，自动执行传入的 fail callback
function fail() {
  alert('启动失败需要执行的 callback 方法，传入后将在启动失败时自动执行，例如：window.location.href 去跳转app下载页')
}
```
