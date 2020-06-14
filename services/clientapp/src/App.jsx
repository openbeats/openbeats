import React, { Component } from "react";
import { Route, Switch } from "react-router";
import { Auth, Main, Reset, Forgot, Offline, ReactHelmet, Embed } from "./components";
import { Provider, connect } from "react-redux";
import { store } from "./store";
import { authActions, offlineActions } from "./actions";

class App extends Component {
  componentDidMount() {
    this.props.offlineCheckerInitiator();
    if (this.props.isAuthenticated) {
      this.props.verifyUserToken();
    }
  }

  render() {
    return (
      <Provider store={store}>
        <ReactHelmet />
        <Switch>
          <Route exact path="/auth" component={Auth} />
          <Route path="/embed/:id" component={Embed} />
          <Route path="/auth/forgot" component={Forgot} />
          <Route path="/auth/reset/:token" component={Reset} />
          <Route path="/" component={Main} />
        </Switch>
        <Offline />
      </Provider>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.authReducer.isAuthenticated,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    verifyUserToken: () => {
      authActions.verifyUserToken();
    },
    offlineCheckerInitiator: () => {
      offlineActions.offlineCheckerInitiator();
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
