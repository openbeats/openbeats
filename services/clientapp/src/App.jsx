import React, { Component } from "react";
import { Route, Switch } from "react-router";
import { Auth, Main, Forget, Reset } from "./components";
import { Provider } from "react-redux";
import { store } from "./store";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Switch>
          <Route exact path="/auth" component={Auth} />
          <Route path="/auth/forget" component={Forget} />
          <Route path="/auth/reset" component={Reset} />
          <Route path="/" component={Main} />
        </Switch>
      </Provider>
    );
  }
}
export default App;
