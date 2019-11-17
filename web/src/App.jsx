import React, { Component } from 'react'
import { Route, Switch } from "react-router-dom"
import { Home, Auth } from "./containers"


class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/auth" component={Auth} />
      </Switch>
    )
  }
}


export default App;