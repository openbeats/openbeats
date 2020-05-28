import React, { Component, Fragment } from "react";
import { musicDummy, spaceImage } from "../assets/images";
import { toastActions, coreActions, playlistManipulatorActions } from "../actions";
import "../assets/css/artistalbums.css";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import Loader from "react-loader-spinner";
import { AlbumHolder, HorizontalView } from ".";
import axios from "axios";
import { variables } from "../config";

class Albums extends Component {
	_isMounted = false;
	constructor(props) {
		super(props);
		this.initialState = {
			artistName: "",
			isLoading: true,
			artistThumbnail: "",
			artistId: "",
			releases: [],
			featuring: [],
			type: "all",
			next: true,
			previous: false,
			page: 1,
			limit: 20,
			isScrollFetchInProcess: false,
		};
		this.observer = null;
		this.intersectElement = null;
		this.state = { ...this.initialState };
	}

	componentDidMount() {
		this.props.setCurrentAction("Artists");
		this._isMounted = true;
		this.albumsMainHandler();
		const type = this.props.match.params.type
		if (type !== 'all')
			this.initiateScrollFetcher();
	}
	initiateScrollFetcher() {
		let options = {
			root: document.getElementById("main-body"),
			rootMargin: '0px',
			threshold: 1
		}

		this.observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					if (entry.intersectionRatio >= 0.95) {
						if (this.state.type === "featuring")
							this.fetchFeaturingHandler(true);
						if (this.state.type === "releases")
							this.fetchReleasesHandler(true);
					}
				}
			});
		}, options);

		if (this.intersectElement)
			this.observer.observe(this.intersectElement);

	}

	albumsMainHandler = async () => {
		const artistFetchUrl = `${variables.baseUrl}/playlist/artist/fetch?tagId=${this.props.match.params.id}`;
		const artistData = (await axios.get(artistFetchUrl)).data;
		if (artistData.status) {
			const { name, thumbnail, _id } = artistData.data;
			this.setState({ artistName: name, artistThumbnail: thumbnail, artistId: _id });
		} else {
			throw new Error(artistData.data);
		}
		if (this._isMounted) this.setState({ isLoading: true });
		const type = this.props.match.params.type;
		switch (type) {
			case "all":
				if (this._isMounted) this.setState({ type: "all" });
				this.fetchReleasesHandler();
				this.fetchFeaturingHandler();
				break;
			case "featuring":
				if (this._isMounted) this.setState({ type: "featuring", featuring: [] });
				this.fetchFeaturingHandler(true);
				break;
			case "releases":
				if (this._isMounted) this.setState({ type: "releases", releases: [] });
				this.fetchReleasesHandler(true);
				break;
			default:
				this.props.push("/404");
				break;
		}
		this.setState({ isLoading: false });
	};

	fetchFeaturingHandler = async (fetchFull = false) => {
		try {
			if (fetchFull && this.state.next && !this.state.isScrollFetchInProcess) {
				this.setState({ isScrollFetchInProcess: true })
				const artistFeaturingFetchUrl = `${variables.baseUrl}/playlist/artist/${this.state.artistId}/featuring?page=${this.state.page}&limit=${this.state.limit}`;
				const artistFeaturing = (await axios.get(artistFeaturingFetchUrl)).data;
				if (artistFeaturing.status) {
					if (this._isMounted) this.setState({
						isLoading: false,
						featuring: [...this.state.featuring, ...artistFeaturing.data.result],
						page: artistFeaturing.data.next ? this.state.page + 1 : this.state.page,
						next: artistFeaturing.data.next ? true : false,
						previous: artistFeaturing.data.previous ? true : false,
						isScrollFetchInProcess: false
					});
				} else {
					throw new Error(artistFeaturing.data);
				}
			} else {
				const artistFeaturingFetchUrl = `${variables.baseUrl}/playlist/artist/${this.state.artistId}/featuring?page=1&limit=10`;
				const artistFeaturing = (await axios.get(artistFeaturingFetchUrl)).data;
				if (artistFeaturing.status) {
					this.setState({ featuring: artistFeaturing.data.result });
				} else {
					throw new Error(artistFeaturing.data);
				}
			}

		} catch (error) {
			this.props.notify(error.message.toString());
			this.props.push("/");
		}
	};

	fetchReleasesHandler = async (fetchFull = false) => {
		try {
			if (fetchFull && this.state.next && !this.state.isScrollFetchInProcess) {
				this.setState({ isScrollFetchInProcess: true })
				const artistReleasesFetchUrl = `${variables.baseUrl}/playlist/artist/${this.state.artistId}/releases?page=${this.state.page}&limit=${this.state.limit}`;
				const artistReleases = (await axios.get(artistReleasesFetchUrl)).data;
				if (artistReleases.status) {
					if (this._isMounted) this.setState({
						isLoading: false,
						releases: [...this.state.releases, ...artistReleases.data.result],
						page: artistReleases.data.next ? this.state.page + 1 : this.state.page,
						next: artistReleases.data.next ? true : false,
						previous: artistReleases.data.previous ? true : false,
						isScrollFetchInProcess: false
					});
				} else {
					throw new Error(artistReleases.data);
				}
			} else {
				const artistReleasesFetchUrl = `${variables.baseUrl}/playlist/artist/${this.state.artistId}/releases?page=1&limit=10`;
				const artistReleases = (await axios.get(artistReleasesFetchUrl)).data;
				if (artistReleases.status) {
					this.setState({ releases: artistReleases.data.result });
				} else {
					throw new Error(artistReleases.data);
				}
			}

		} catch (error) {
			this.props.notify(error.message.toString());
			this.props.push("/");
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

	ReleasedAlbums = () => {
		return (
			this.state.releases.length > 0 && (
				<div className="home-section">
					<div className="home-section-header">
						<div className="left-section cursor-pointer" onClick={() => this.props.push(`/artist/${this.state.artistId}/releases`)}>
							<i className="fad fa-album-collection"></i>
							<span className="">Released Albums</span>
							<i className="fas fa-angle-double-right"></i>
						</div>
					</div>
					<div className="home-section-body">
						<HorizontalView elementList={this.getAlbumsList(this.state.releases, { enabled: true, url: `/artist/${this.state.artistId}/releases` })} />
					</div>
				</div>
			)
		);
	};

	FeaturingAlbum = () => {
		return (
			this.state.featuring.length > 0 && (
				<div className="home-section">
					<div className="home-section-header">
						<div className="left-section cursor-pointer" onClick={() => this.props.push(`/artist/${this.state.artistId}/featuring`)}>
							<i className="fad fa-star"></i>
							<span className="">Featuring Albums</span>
							<i className="fas fa-angle-double-right"></i>
						</div>
					</div>
					<div className="home-section-body">
						<HorizontalView elementList={this.getAlbumsList(this.state.featuring, { enabled: true, url: `/artist/${this.state.artistId}/featuring` })} />
					</div>
				</div>
			)
		);
	};

	AllAlbums = () => {
		const currentAlbums = this.state.type === "featuring" ? this.state.featuring : this.state.releases;
		return <div className="home-section">
			<div className="home-section-header">
				<div className="left-section cursor-pointer">
					<i className="fad fa-star"></i>
					<span className="">{this.state.type === "featuring" ? "Featuring" : "Released"} Albums</span>
				</div>
			</div>
			<div className="albums-wrapper">
				{this.getAlbumsList(currentAlbums)}
				<div ref={d => this.intersectElement = d} className="intersection-holder"></div>
			</div>
		</div>
	};

	componentDidUpdate(nProps) {
		if (nProps.match.params.type !== this.props.match.params.type) this.albumsMainHandler();
	}

	componentWillUnmount() {
		this.setState({ ...this.initialState });
		this._isMounted = false;
		if (this.observer) this.observer.disconnect();
	}

	render() {
		return this.state.isLoading ? (
			<div className="width-100 height-100 d-flex align-items-center justify-content-center">
				<Loader type="ThreeDots" color="#F32C2C" height={80} width={80} />
			</div>
		) : (
				<div className="artist-albums-wrapper">
					<div className="artist-albums-header-image-holder" style={{ backgroundImage: `url(${spaceImage})` }}>
						<div
							className="artist-albums-header-artist-display-holder"
							style={{ backgroundImage: `url(${this.state.artistThumbnail}), url(${musicDummy})` }}></div>
						<div className="artist-albums-artist-name">{this.state.artistName}</div>
					</div>
					<div className="albums-wrapper">
						{this.state.type === "all" ? (
							<Fragment>
								<this.ReleasedAlbums />
								<this.FeaturingAlbum />
							</Fragment>
						) : (
								<this.AllAlbums />
							)}
					</div>
					{this.state.featuring.length === 0 && this.state.releases.length === 0 && (
						<div className="height-200px font-weight-bold d-flex align-items-center justify-content-center text-align-center">
							No Albums Found! <br />
							<br /> Stay Tuned For Updates!
						</div>
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
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Albums);
