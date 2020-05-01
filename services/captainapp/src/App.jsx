import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Auth } from "./components";
import Main from "./components/Main";
import { connect } from "react-redux";
import "./assets/styles/core.css";
class App extends Component {
	render() {
		return (
			<div className="core-wrapper">
				<Switch>
					<Route
						exact
						path="/auth"
						component={() => {
							if (!this.props.isAuthenticated) return <Auth />;
							else return <Redirect to="/" />;
						}}
					/>
					<Route
						path="/"
						component={() => {
							if (this.props.isAuthenticated) return <Main />;
							else return <Redirect to="/auth" />;
						}}
					/>
				</Switch>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		isAuthenticated: state.auth.isAuthenticated,
	};
};

const mapDispatchToProps = () => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
