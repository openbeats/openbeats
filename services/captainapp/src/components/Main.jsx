import React, { Component } from "react";
import { LeftNav, Albums, Artists, Users, AlbumsDash, ArtistAddDialog } from ".";
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
						{[2, 3].includes(this.props.adminDetails.accessLevel) && <Route path="/userbase" component={Users} />}
					</Switch>
					{this.props.isAddArtistOpended && <ArtistAddDialog />}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		isAddArtistOpended: state.addArtist.isOpened,
		adminDetails: state.auth.adminDetails,
	};
};

const mapDispatchToProps = dispatch => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
