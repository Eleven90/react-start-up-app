
import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'
import StartUpApp from 'src/components/start-up-app'

class App extends Component {
  render() {
    return (
      <Fragment>
        <StartUpApp />
      </Fragment>
    )
  }
}

hot(module)(App)
ReactDOM.render(<App />, document.getElementById('app'))
