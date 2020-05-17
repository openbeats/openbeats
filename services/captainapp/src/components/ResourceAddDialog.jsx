import React, { Component } from "react";
import "../assets/styles/artistadddialog.css";
import { connect } from "react-redux";
import { addArtistActions, toggleResourceDialog } from "../actions";

class ResourceAddDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isEdit: this.props.isEdit,
			resourceType: this.props.resourceType,
			resourceId: this.props.resourceId || "",
			resourceName: this.props.resourceName || "",
			resourceImageUrl: this.props.resourceImageUrl || "",
		};
	}
	checkURL = e => {
		this.setState({ resourceImageUrl: e.target.value });
	};

	saveActionHandler = async () => {
		const addArtistResult = await this.props.addArtistHandler(
			this.state.resourceName,
			this.state.resourceImageUrl,
			this.state.isEdit,
			this.state.resourceId
		);
		if (addArtistResult) {
			if (this.props.resourceCreateCallBack) this.props.resourceCreateCallBack(addArtistResult);
			this.props.toggleResourceDialog(false);
		}
	};

	cancelActionHandler = () => {
		if (this.props.resourceCreateCallBack) this.props.resourceCreateCallBack({ status: false, data: "cancelled" });
		this.props.toggleResourceDialog(false);
	};

	componentWillUnmount() {
		this.setState({
			resourceName: "",
			resourceImageUrl: "",
			resourceId: "",
		});
	}

	render() {
		return (
			<div className="artist-add-dialog-container">
				<div className="artist-add-dialog-wrapper">
					<div className="artist-add-dialog-header">
						<div className="artist-add-dialog-header-left-items">
							<i className="fas fa-angle-right mr-1 right-angel mr-2"></i>
							<span>Add Artist</span>
						</div>
						<div className="artist-add-dialog-header-right-items">
							<div className="d-flex">
								<div className="create-album-link font-weight-bold mr-3 cursor-pointer" onClick={this.saveActionHandler}>
									save
								</div>
								<div className="create-album-link bg-danger font-weight-bold cursor-pointer" onClick={this.cancelActionHandler}>
									cancel
								</div>
							</div>
						</div>
					</div>
					<div className="artist-add-dialog-content-holder">
						<div className="artist-add-dialog-input-container">
							<div className="artist-name-input d-flex flex-column align-items-center justify-content-center mb-4">
								<div className="font-weight-bold mb-2 add-artist-input-title">Artist Name</div>
								<input
									className="input input-sm rounded artist-name-input"
									required
									value={this.state.artistName}
									onChange={e => this.setState({ artistName: e.target.value })}
									placeholder="Anirudh Ravichandar"
									type="text"
								/>
							</div>
							<div className="artist-name-input d-flex flex-column align-items-center justify-content-center mt-4">
								<div className="font-weight-bold mb-2 add-artist-input-title">Artist Image Url</div>
								<input
									className="input input-sm rounded artist-name-input"
									required
									value={this.state.artistImageUrl}
									onChange={e => this.checkURL(e)}
									placeholder="https://imageurl.com/image.jpg"
									type="text"
								/>
							</div>
						</div>
						<div className="artist-add-dialog-image-display-container">
							<div
								className="add-artist-image-display-panel"
								style={{
									backgroundImage: `url(${this.state.artistImageUrl}), url(${this.state.fallbackArtistImageUrl})`,
								}}>
								{" "}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		isEdit: state.addResource.isEdit,
		resourceType: state.addResource.resourceType,
		resourceId: state.addResource.resourceId,
		resourceName: state.addResource.resourceName,
		resourceImageUrl: state.addResource.resourceImageUrl,
		resourceCreateCallBack: state.addResource.resourceCreateCallBack,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		toggleResourceDialog: value => {
			toggleResourceDialog.toggleResorceDialog({ isOpened: value });
		},
		addArtistHandler: (name, url, isEdit, artistId) => {
			return addArtistActions.addArtistHandler(name, url, isEdit, artistId);
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ResourceAddDialog);
