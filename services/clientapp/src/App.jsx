import React, { Component } from "react";
import { Route, Switch } from "react-router";
import { Auth, Main, Reset, Forgot } from "./components";
import { Provider } from "react-redux";
import { store } from "./store";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Switch>
          <Route exact path="/auth" component={Auth} />
          <Route path="/auth/forget" component={Forgot} />
          <Route path="/auth/reset/:token" component={Reset} />
          <Route path="/" component={Main} />
        </Switch>
      </Provider>
    );
  }
}
export default App;
