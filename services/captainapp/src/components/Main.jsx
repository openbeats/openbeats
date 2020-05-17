import React, { Component } from "react";
import { LeftNav, Albums, Artists, Emotions, Users, AlbumsDash, ResourceAddDialog, Languages } from ".";
import { Switch, Route } from "react-router";
import Home from "./Home";
import "../assets/styles/main.css";
import { connect } from "react-redux";

class Main extends Component {
	render() {
		return (
			<div className="main-wrapper">
				<LeftNav />
				<div className="main-view">
					<Switch>
						<Route exact path="/" component={Home} />
						<Route exact path="/albums" component={Albums} />
						<Route path="/albums/dashyard" component={AlbumsDash} />
						<Route path="/artists" component={Artists} />
						<Route path="/emotions" component={Emotions} />
						<Route path="/languages" component={Languages} />
						{[2, 3].includes(this.props.adminDetails.accessLevel) && <Route path="/userbase" component={Users} />}
					</Switch>
					{this.props.isAddArtistOpended && <ResourceAddDialog />}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		isAddArtistOpended: state.addResource.isOpened,
		adminDetails: state.auth.adminDetails,
	};
};

const mapDispatchToProps = dispatch => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
