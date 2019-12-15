import React, { Component } from 'react'
import { Route, Switch } from "react-router"
import { Auth, Main } from "./containers"

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/auth" component={Auth} />
        <Route path="/" component={() => {
          // check for authentication logic.. goes here
          return <Main />
        }
        } />
      </Switch>
    )
  }
}


export default App;