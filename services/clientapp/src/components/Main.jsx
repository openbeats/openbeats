import React, { Component, Fragment } from "react";
import "../assets/css/core.css";
import "../assets/css/mainbody.css";
import {
	Player,
	TopNav,
	PlaylistDisplay,
	LeftNav,
	Home,
	MyPlaylists,
	Artists,
	ArtistAlbums,
	TopCharts,
	PlaylistManipulator,
	Result,
	NowPlaying,
	MyCollections,
	Albums,
	NoPage,
	Languages,
	Emotions,
	LanguageAlbums,
	EmotionAlbums
} from ".";
import { toastActions, coreActions, playlistManipulatorActions } from "../actions";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Switch, Route, Redirect } from "react-router";
import Disclaimer from "./Disclaimer";

class Main extends Component {
	componentDidMount() {
		if (this.props.isAuthenticated) this.props.updateAlbumsInTheCollectionMetaData();
	}

	render() {
		return (
			<Fragment>
				{this.props.showAddPlaylistDialog && <PlaylistManipulator />}
				<LeftNav />
				<main>
					<TopNav />
					<section className="main-body" id="main-body">
						<Switch>
							<Route exact path="/" component={Home} />
							<Route path="/nowplaying" component={NowPlaying} />
							<Route path="/playlist/:type/:id" component={PlaylistDisplay} />
							<Route
								path="/myplaylists"
								component={() => {
									if (this.props.isAuthenticated) return <MyPlaylists />;
									else {
										this.props.notify("please login to use this feature!!!");
										this.props.push("/");
										return null;
									}
								}}
							/>
							<Route
								path="/mycollections"
								component={() => {
									if (this.props.isAuthenticated) return <MyCollections />;
									else {
										this.props.notify("please login to use this feature!!!");
										this.props.push("/");
										return null;
									}
								}}
							/>
							<Route exact path="/search" component={Result} />
							<Route exact path="/topcharts" component={TopCharts} />
							<Route exact path="/artists" component={Artists} />
							<Route exact path="/artist/:id/:type" component={ArtistAlbums} />
							<Route exact path="/languages" component={Languages} />
							<Route exact path="/languages/:id" component={LanguageAlbums} />
							<Route exact path="/emotions" component={Emotions} />
							<Route exact path="/disclaimer" component={Disclaimer} />
							<Route exact path="/emotions/:id" component={EmotionAlbums} />
							<Route
								exact
								path="/artist"
								component={() => {
									this.props.push("/artist/all");
									return null;
								}}
							/>
							<Route exact path="/albums/:type" component={Albums} />
							<Route
								exact
								path="/albums"
								component={() => {
									this.props.push("/albums/all");
									return null;
								}}
							/>
							<Route path="/404" component={NoPage} />
							<Route
								component={() => {
									return <Redirect to="/404" />;
								}}
							/>
						</Switch>
					</section>
				</main>
				<Player />
			</Fragment>
		);
	}
}

const mapStateToProps = state => {
	return {
		showAddPlaylistDialog: state.playlistManipulatorReducer.showAddPlaylistDialog,
		isAuthenticated: state.authReducer.isAuthenticated,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		push: path => {
			dispatch(push(path));
		},
		notify: message => {
			toastActions.showMessage(message);
		},
		featureNotify: () => {
			toastActions.featureNotify();
		},
		setCurrentAction: action => {
			dispatch(coreActions.setCurrentAction(action));
		},
		updateAlbumsInTheCollectionMetaData: () => {
			playlistManipulatorActions.updateAlbumsInTheCollectionMetaData();
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
