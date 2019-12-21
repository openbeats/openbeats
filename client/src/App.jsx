import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router";
import { Auth, Main } from "./containers";

class App extends Component {
	render() {
		return (
			<Switch>
				<Route
					path="/auth/callback/:token"
					render={props => {
						console.log(props.match.params);
						return <Redirect to="/playlist" />;
					}}
				/>
				<Route path="/auth" component={Auth} />
				<Route
					path="/"
					component={() => {
						// check for authentication logic.. goes here
						return <Main />;
					}}
				/>
			</Switch>
		);
	}
}

export default App;