import React, { Component } from "react";
import "../assets/styles/artistadddialog.css";
import { connect } from "react-redux";
import { addResourceActions, toggleResource } from "../actions";

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
		const addResourceResult = await this.props.addResourceHandler(
			this.state.resourceType,
			this.state.resourceId,
			this.state.resourceName,
			this.state.resourceImageUrl,
			this.state.isEdit,
		);
		if (addResourceResult) {
			if (this.props.resourceCreateCallBack) this.props.resourceCreateCallBack(addResourceResult);
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
							<span>Add {this.state.resourceType}</span>
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
								<div className="font-weight-bold mb-2 add-artist-input-title">{this.state.resourceType} Name</div>
								<input
									className="input input-sm rounded artist-name-input"
									required
									value={this.state.resourceName}
									onChange={e => this.setState({ resourceName: e.target.value })}
									placeholder={`Enter ${this.state.resourceType.toLowerCase()} name here`}
									type="text"
								/>
							</div>
							<div className="artist-name-input d-flex flex-column align-items-center justify-content-center mt-4">
								<div className="font-weight-bold mb-2 add-artist-input-title">{this.state.resourceType} Image Url</div>
								<input
									className="input input-sm rounded artist-name-input"
									required
									value={this.state.resourceImageUrl}
									onChange={e => this.checkURL(e)}
									placeholder={`Enter thumbnail image url here`}
									type="text"
								/>
							</div>
						</div>
						<div className="artist-add-dialog-image-display-container">
							<div
								className="add-artist-image-display-panel"
								style={{
									backgroundImage: `url(${this.state.resourceImageUrl}), url(${`https://via.placeholder.com/500/F3F3F3/000000/?text=${this.state.resourceType}+image+appears+here...`})`,
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
			const payload = {
				isOpened: value,
				isEdit: false,
				resourceType: null,
				resourceId: null,
				resourceName: "",
				resourceImageUrl: "",
				resourceCreateCallBack: null
			};
			toggleResource.toggleResorceDialog(payload);
		},
		addResourceHandler: (resourceType, resourceId, resourceName, resourceImageUrl, isEdit) => {
			return addResourceActions.addResourceHandler(resourceType, resourceId, resourceName, resourceImageUrl, isEdit);
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ResourceAddDialog);
