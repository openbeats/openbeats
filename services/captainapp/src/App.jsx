import React, {
  Component
} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import {
  Auth,
  Home
} from './components';

class App extends Component {

  constructor(props) {
    super(props);
    this.initialState = {
      isAuthenticated: false,
      userName: '',
      userEmail: '',
      avatar: '',
      token: '',
      userId: ''
    };
    this.state = {
      ...this.initialState
    }

    this.setAuthDetails = this.setAuthDetails.bind(this);
  }

  componentDidMount() {
    // validate login (localstorage strategy)
    let authData = localStorage.getItem("admin") || null;
    if (authData) {
      authData = JSON.parse(authData);
      this.setState({ ...authData })
    }
  }

  setAuthDetails(details) {
    localStorage.setItem("admin", JSON.stringify(details));
    this.setState({
      ...details
    })
  }

  logoutHandler() {
    this.setState({ ...this.initialState })
    localStorage.clear();
  }

  render() {
    return (<div className="core-wrapper" >
      <Router >
        <Switch >
          <Route exact path="/" component={() => {
            if (this.state.isAuthenticated)
              return <Home />
            else
              return <Redirect to="/auth" />
          }} />
          <Route path="/auth" component={() => {
            if (!this.state.isAuthenticated) {
              return <Auth setAuthDetails={this.setAuthDetails} />
            } else
              return <Redirect to="/" />
          }} />
        </Switch >
      </Router>
    </div >
    );
  }

}

export default App;