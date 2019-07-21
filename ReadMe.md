# react-start-up-app

> 从 H5 页面启动手机 App。

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
import StartUpApp from '@eleven.xi/react-start-up-app'

<StartUpApp 
  text="打开App"
  isDisabled={false}
  link={'URL scheme'}
  funcInWeixin={() => alert('微信屏蔽了直接唤起app，并且安卓、IOS微信有不同的限制策略，所以需要自己去做一点操作，例如：区分安卓、IOS，选择跳转对应下载页。')}
  fail={() => alert('启动失败需要执行的操作，大多数时候是跳转app下载页')}
/>
```
