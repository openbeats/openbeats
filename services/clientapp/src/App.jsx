import React, { Component } from "react";
import { Route, Switch } from "react-router";
import { Auth, Main, Reset, Forgot } from "./components";
import { Provider, connect } from "react-redux";
import { store } from "./store";
import { authActions } from "./actions";

class App extends Component {
  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.verifyUserToken();
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Switch>
          <Route exact path="/auth" component={Auth} />
          <Route path="/auth/forgot" component={Forgot} />
          <Route path="/auth/reset/:token" component={Reset} />
          <Route path="/" component={Main} />
        </Switch>
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
