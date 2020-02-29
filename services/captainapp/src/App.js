import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Auth, Home } from './components';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      userName: '',
      email: ''
    }

    this.setAuthDetails = this.setAuthDetails.bind(this);
  }

  setAuthDetails(details) {
    this.setState({
      isAuthenticated: details.status,
      userName: details.userName,
      email: details.mail
    })
  }


  render() {
    return (
      <div className="core-wrapper">
        <Router>
          <Switch>
            <Route exact path="/" component={() => {
              if (this.state.isAuthenticated)
                return <Home />
              else
                return <Redirect to="/auth" />
            }} />
            <Route path="/auth" component={() => {
              if (!this.state.isAuthenticated) {
                return <Auth
                  setAuthDetails={this.setAuthDetails}
                />
              } else
                return <Redirect to="/" />
            }} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
