import React, { Component } from "react";
import { musicDummy } from "../assets/images";
import { connect } from "react-redux";
import "../assets/css/artistholder.css";
import { push } from "connected-react-router";
import { toastActions, coreActions } from "../actions";

class ArtistHolder extends Component {
	aritstClickHandler = async id => {
		this.props.push(`/artist/${id}/all`);
	};

	Main = () => {
		return <div className="artist-display-holder cursor-pointer" onClick={() => this.aritstClickHandler(this.props.id)}>
			<div className="artist-rounded-circle-holder" style={{ backgroundImage: `url('${this.props.thumbnail}'), url(${musicDummy})` }}></div>
			<div className="artist-name">{this.props.name}</div>
			<div className="artist-description">Artist</div>
		</div>

	}


	ExploreMore = () => {
		return <div className="artist-display-holder album-explore-more cursor-pointer" onClick={() => this.props.push(this.props.exploreMoreUrl)}>
			<div className="explore-more-icon-holer">
				<i class="fas fa-compass"></i>
			</div>
			<div className="explore-more-text-holer">
				Explore More
            </div>
		</div>
	}


	render() {
		return !this.props.exploreMore ? <this.Main /> : <this.ExploreMore />;
	}
}

const mapStateToProps = state => {
	return {};
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
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ArtistHolder);
