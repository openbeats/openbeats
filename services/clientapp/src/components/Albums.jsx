import React, { Component, Fragment } from "react";
import { toastActions, coreActions, playlistManipulatorActions, homeActions } from "../actions";
import "../assets/css/albums.css";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import Loader from "react-loader-spinner";
import { AlbumHolder, HorizontalView } from ".";

class Albums extends Component {
	_isMounted = false;
	constructor(props) {
		super(props);
		this.initialState = {
			popularAlbums: [],
			latestAlbums: [],
			type: "all",
			isLoading: true,
		};
		this.state = { ...this.initialState };
	}

	componentDidMount() {
		this._isMounted = true;
		this.albumsMainHandler();
	}

	albumsMainHandler = () => {
		if (this._isMounted) this.setState({ isLoading: true });
		const type = this.props.match.params.type;
		let albumType = "Albums";
		switch (type) {
			case "all":
				albumType = "All " + albumType;
				if (this._isMounted) this.setState({ type: "all" });
				this.fetchPopularAlbumsHandler();
				this.fetchLatestAlbumsHandler();
				break;
			case "popular":
				albumType = "Popular " + albumType;
				if (this._isMounted) this.setState({ type: "popular" });
				this.fetchPopularAlbumsHandler(true);
				break;
			case "latest":
				albumType = "Latest " + albumType;
				if (this._isMounted) this.setState({ type: "latest" });
				this.fetchLatestAlbumsHandler(true);
				break;

			default:
				this.props.push("/404");
				break;
		}
		this.props.setCurrentAction(albumType);
	};

	fetchPopularAlbumsHandler = async (fetchFull = false) => {
		let data = [];

		if (fetchFull) data = await this.props.fetchPopularAlbums(1, 10000);
		else data = await this.props.fetchPopularAlbums(1, 10);

		if (this._isMounted) this.setState({ isLoading: false, popularAlbums: data });
	};

	fetchLatestAlbumsHandler = async (fetchFull = false) => {
		let data = [];

		if (fetchFull) data = await this.props.fetchLatestAlbums(1, 10000);
		else data = await this.props.fetchLatestAlbums(1, 10);

		if (this._isMounted) this.setState({ isLoading: false, latestAlbums: data });
	};

	addOrRemoveAlbumFromCollectionHandler = (isAdd = true, albumId) => {
		this.props.addOrRemoveAlbumFromUserCollection(albumId, isAdd);
	};

	// List Preparing Part
	getAlbumsList(arrayList) {
		return arrayList.map((item, key) => (
			<AlbumHolder
				key={key}
				albumName={item.name}
				albumThumbnail={item.thumbnail}
				albumTotalSongs={item.totalSongs}
				albumId={item._id}
				albumCreationDate={new Date(item.createdAt).toDateString()}
				albumCreatedBy={"OpenBeats"}
				type={"album"}
				addOrRemoveAlbumFromCollectionHandler={this.addOrRemoveAlbumFromCollectionHandler}
				isAuthenticated={this.props.isAuthenticated}
				isAlbumIsInCollection={this.props.likedPlaylists.indexOf(item._id) === -1 ? false : true}
			/>
		));
	}

	PopularAlbums = () => {
		return (
			this.state.popularAlbums.length > 0 && (
				<div className="home-section">
					<div className="home-section-header">
						<div className="left-section cursor-pointer" onClick={() => this.props.push("/albums/popular")}>
							<i className="fad fa-album-collection"></i>
							<span className="">Popular Albums</span>
							<i className="fas fa-angle-double-right"></i>
						</div>
					</div>
					<div className="home-section-body">
						<HorizontalView elementList={this.getAlbumsList(this.state.popularAlbums)} />
					</div>
				</div>
			)
		);
	};

	LatestAlbums = () => {
		return (
			this.state.latestAlbums.length > 0 && (
				<div className="home-section">
					<div className="home-section-header">
						<div className="left-section cursor-pointer" onClick={() => this.props.push("/albums/latest")}>
							<i className="fad fa-star"></i>
							<span className="">Latest Albums</span>
							<i className="fas fa-angle-double-right"></i>
						</div>
					</div>
					<div className="home-section-body">
						<HorizontalView elementList={this.getAlbumsList(this.state.latestAlbums)} />
					</div>
				</div>
			)
		);
	};

	AllAlbums = () => {
		const currentAlbums = this.state.type === "latest" ? this.state.latestAlbums : this.state.popularAlbums;
		return this.getAlbumsList(currentAlbums);
	};

	componentDidUpdate(nProps) {
		if (nProps.match.params.type !== this.props.match.params.type) this.albumsMainHandler();
	}

	componentWillUnmount() {
		this.setState({ ...this.initialState });
		this._isMounted = false;
	}

	render() {
		return this.state.isLoading ? (
			<div className="width-100 height-100 d-flex align-items-center justify-content-center">
				<Loader type="ThreeDots" color="#F32C2C" height={80} width={80} />
			</div>
		) : (
				<div className="albums-wrapper">
					{this.state.type === "all" ? (
						<Fragment>
							<this.LatestAlbums />
							<this.PopularAlbums />
						</Fragment>
					) : (
							<this.AllAlbums />
						)}
				</div>
			);
	}
}

const mapStateToProps = state => {
	return {
		isAuthenticated: state.authReducer.isAuthenticated,
		likedPlaylists: state.authReducer.likedPlaylists,
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
		addOrRemoveAlbumFromUserCollection: async (albumId, isAdd = true) => {
			return await playlistManipulatorActions.addOrRemoveAlbumFromUserCollection(albumId, isAdd);
		},
		fetchPopularAlbums: async (page, limit) => {
			return await homeActions.fetchPopularAlbums(page, limit);
		},
		fetchLatestAlbums: async (page, limit) => {
			return await homeActions.fetchLatestAlbums(page, limit);
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Albums);
