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
			next: true,
			previous: false,
			page: 1,
			limit: 3,
			isScrollFetchInProcess: false,
		};
		this.state = { ...this.initialState };
	}

	componentDidMount() {
		this._isMounted = true;
		this.albumsMainHandler();
		const type = this.props.match.params.type
		if (type !== 'all')
			this.initiateScrollFetcher();
	}

	initiateScrollFetcher() {
		const mainBodyRef = document.getElementById("main-body");
		mainBodyRef.addEventListener('scroll', this.scrollFetch);
	}

	scrollFetch = (e) => {
		const totalHeight = e.target.scrollHeight - e.target.offsetHeight;
		if (e.target.scrollTop === totalHeight) {
			if (this.state.type === "popular")
				this.fetchPopularAlbumsHandler(true);
			if (this.state.type === "latest")
				this.fetchLatestAlbumsHandler(true);
		}
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
		if (fetchFull && this.state.next && !this.state.isScrollFetchInProcess) {
			this.setState({ isScrollFetchInProcess: true })
			const getData = await this.props.fetchPopularAlbums(this.state.page, this.state.limit, true);
			if (this._isMounted) this.setState({
				isLoading: false,
				popularAlbums: [...this.state.popularAlbums, ...getData.result],
				page: getData.next ? this.state.page + 1 : this.state.page,
				next: getData.next ? true : false,
				previous: getData.previous ? true : false,
				isScrollFetchInProcess: false
			});
		} else {
			const data = await this.props.fetchPopularAlbums(1, 10);
			if (this._isMounted) this.setState({ isLoading: false, popularAlbums: data });
		}
	};

	fetchLatestAlbumsHandler = async (fetchFull = false) => {
		if (fetchFull && this.state.next && !this.state.isScrollFetchInProcess) {
			this.setState({ isScrollFetchInProcess: true })
			const getData = await this.props.fetchLatestAlbums(this.state.page, this.state.limit, true);
			if (this._isMounted) this.setState({
				isLoading: false,
				latestAlbums: [...this.state.latestAlbums, ...getData.result],
				page: getData.next ? this.state.page + 1 : this.state.page,
				next: getData.next ? true : false,
				previous: getData.previous ? true : false,
				isScrollFetchInProcess: false
			});
		} else {
			const data = await this.props.fetchLatestAlbums(1, 10);
			if (this._isMounted) this.setState({ isLoading: false, latestAlbums: data });
		}
	};

	addOrRemoveAlbumFromCollectionHandler = (isAdd = true, albumId) => {
		this.props.addOrRemoveAlbumFromUserCollection(albumId, isAdd);
	};

	// List Preparing Part
	getAlbumsList(arrayList, exploreMore = { enabled: false, url: '' }) {
		return (<>
			{arrayList.map((item, key) => (
				<AlbumHolder
					key={key}
					albumName={item.name}
					albumThumbnail={item.thumbnail}
					albumTotalSongs={item.totalSongs}
					albumId={item._id}
					albumCreationDate={new Date().toDateString()}
					albumCreatedBy={"OpenBeats"}
					type={'album'}
					addOrRemoveAlbumFromCollectionHandler={this.addOrRemoveAlbumFromCollectionHandler}
					isAuthenticated={this.props.isAuthenticated}
					isAlbumIsInCollection={this.props.likedPlaylists.indexOf(item._id) === -1 ? false : true}
				/>))}
			{exploreMore.enabled &&
				<AlbumHolder
					exploreMore={true}
					exploreMoreUrl={exploreMore.url}
				/>}
		</>)
	}


	PopularAlbums = () => {
		return (
			this.state.popularAlbums.length > 0 && (
				<div className="home-section">
					<div className="home-section-header">
						<div className="left-section cursor-pointer" onClick={() => this.props.push("/albums/popular")}>
							<i className="master-color fad fa-album-collection"></i>
							<span className="">Popular Albums</span>
							<i className="master-color fas fa-angle-double-right"></i>
						</div>
					</div>
					<div className="home-section-body">
						<HorizontalView elementList={this.getAlbumsList(this.state.popularAlbums, { enabled: true, url: "/albums/popular" })} />
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
							<i className="master-color fad fa-star"></i>
							<span className="">Latest Albums</span>
							<i className="master-color fas fa-angle-double-right"></i>
						</div>
					</div>
					<div className="home-section-body">
						<HorizontalView elementList={this.getAlbumsList(this.state.latestAlbums, { enabled: true, url: "/albums/latest" })} />
					</div>
				</div>
			)
		);
	};

	AllAlbums = () => {
		const currentAlbums = this.state.type === "latest" ? this.state.latestAlbums : this.state.popularAlbums;
		return <div className="home-section">
			<div className="home-section-header">
				<div className="left-section cursor-pointer">
					<i className="master-color fad fa-star"></i>
					<span className="">{this.state.type === "latest" ? "Latest" : "Popular"} Albums</span>
				</div>
			</div>
			<div className="albums-wrapper">
				{this.getAlbumsList(currentAlbums)}
			</div>
		</div>
	};

	componentDidUpdate(nProps) {
		if (nProps.match.params.type !== this.props.match.params.type) this.albumsMainHandler();
	}

	componentWillUnmount() {
		this.setState({ ...this.initialState });
		this._isMounted = false;
		const mainBodyRef = document.getElementById("main-body");
		mainBodyRef.removeEventListener("scroll", this.scrollFetch);
	}

	render() {
		return this.state.isLoading ? (
			<div className="width-100 height-100 d-flex align-items-center justify-content-center">
				<Loader type="ThreeDots" color="#F32C2C" height={80} width={80} />
			</div>
		) : (<>
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
			{this.state.isScrollFetchInProcess && <div className="mt-2 width-100 d-flex align-items-center justify-content-center">
				<Loader color="#F32C2C" type="TailSpin" height={30} width={30} />
			</div>}
		</>);
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
		fetchPopularAlbums: async (page, limit, advanced = false) => {
			return await homeActions.fetchPopularAlbums(page, limit, advanced);
		},
		fetchLatestAlbums: async (page, limit, advanced = false) => {
			return await homeActions.fetchLatestAlbums(page, limit, advanced);
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Albums);
