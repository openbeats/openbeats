import React, { Component } from "react";
import { Route, Switch } from "react-router";
import { Auth, Main } from "./containers";
import { Provider } from "react-redux";
import { store } from "./store";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Switch>
          <Route path="/auth" component={Auth} />
          <Route path="/" component={Main} />
        </Switch>
      </Provider>
    );
  } 
}
export default App;
