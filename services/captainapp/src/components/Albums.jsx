import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/albums.css";
import { coreActions } from "../actions";
import { connect } from "react-redux";
import axios from "axios";
import { variables } from "../config";
import { store } from "../store";
import { push } from "connected-react-router";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";

class Albums extends Component {
	constructor(props) {
		super(props);
		this.state = {
			albumsCollection: [],
			isLoading: true,
		};
	}

	componentDidMount() {
		this.props.setCurrentNavItem("albums");
		this.fetchAlbums();
	}

	async fetchAlbums() {
		try {
			const albumsFetchUrl = `${variables.baseUrl}/playlist/album/all?page=1&limit=1000`;
			const resultData = (await axios.get(albumsFetchUrl)).data;
			if (resultData.status) {
				this.setState({ albumsCollection: resultData.data.result });
			} else {
				this.setState({ albumsCollection: [] });
			}
			this.setState({ isLoading: false });
		} catch (error) {
			console.error(error);
		}
	}

	editAlbum(index) {
		const editAlbumId = this.state.albumsCollection[index]._id;
		this.props.pushpath(`/albums/dashyard?editalbum=${editAlbumId}`);
	}

	editDeletePermission(createdBy) {
		return [2, 3].includes(this.props.adminDetails.accessLevel) || createdBy === this.props.adminDetails.id;
	}

	async deleteAlbum(index) {
		try {
			const deleteAlbumId = this.state.albumsCollection[index]._id;
			const deleteAlbumUrl = `${variables.baseUrl}/playlist/album/${deleteAlbumId}`;
			const resultData = (await axios.delete(deleteAlbumUrl)).data;
			if (resultData.status) {
				await this.fetchAlbums();
				toast.success("Album Deleted Successfully!");
			} else toast.error(resultData.data.toString());
		} catch (error) {
			toast.error(error.toString());
		}
	}

	render() {
		return (
			<div className="albums-wrapper">
				<div className="albums-header">
					<div className="album-indicator d-flex align-items-center font-weight-bold base-color h5-responsive">
						<i className="fas fa-angle-right mr-1 right-angel"></i>Albums
					</div>
					<div className="album-search-input">
						<input className="input input-sm red-border" type="text" placeholder="Search Albums, Artists, Languages..." aria-label="Search" />
						<i className="fas fa-search text-grey cursor-pointer" aria-hidden="true"></i>
					</div>
					<Link className="create-album-link font-weight-bold cursor-pointer text-white" to="/albums/dashyard">
						<i className="far fa-plus mr-1"></i>&nbsp;Create Album
					</Link>
				</div>
				{this.state.isLoading ? (
					<div className="width-100 height-100 d-flex align-items-center justify-content-center">
						<Loader type="ThreeDots" color="#F32C2C" height={80} width={80} />
					</div>
				) : (
					<Fragment>
						<div className="albums-container">
							{this.state.albumsCollection.map((item, key) => (
								<div className="album-holder" style={{ backgroundImage: `url(${item.thumbnail})` }} key={key}>
									{this.editDeletePermission(item.createdBy._id) ? (
										<Fragment>
											<div className="album-btn-rounded album-edit-button cursor-pointer" onClick={e => this.editAlbum(key)}>
												<i className="fas fa-pencil-alt"></i>
											</div>
											<div className="album-btn-rounded album-delete-button cursor-pointer" onClick={e => this.deleteAlbum(key)}>
												<i className="far fa-trash-alt"></i>
											</div>
										</Fragment>
									) : (
										<a
											className="album-btn-rounded album-view-button cursor-pointer"
											title={`View on ${variables.clientUrl}`}
											href={`${variables.clientUrl}/playlist/album/${item._id}`}
											target="_blank"
											rel="noopener noreferrer">
											<i className="fas fa-eye"></i>
										</a>
									)}
									<div className="album-btn-rounded album-song-count p-events-none">{item.totalSongs}</div>
									<div className="album-description">
										<div className="album-title">{item.name}</div>
										<div className="album-creation-date">{new Date(item.createdAt).toDateString()}</div>
										<div className="album-created-by">by {item.createdBy.name}</div>
									</div>
								</div>
							))}
							{this.state.albumsCollection.length === 0 && (
								<div className="font-weight-bold h5-responsive w-100 h-100 d-flex align-items-center text-dark justify-content-center">
									No Albums found in the Server!
								</div>
							)}
						</div>
					</Fragment>
				)}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		adminDetails: state.auth.adminDetails,
		currentNavItem: state.core.currentNavItem,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setCurrentNavItem: item => {
			coreActions.setCurrentNavItem(item);
		},
		pushpath: path => {
			store.dispatch(push(path));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Albums);
