import React, { Component } from "react";
import { musicDummy } from "../assets/images";
import { connect } from "react-redux";
import "../assets/css/artistholder.css";
import { push } from "connected-react-router";
import { toastActions, coreActions } from "../actions";

class ArtistHolder extends Component {

	constructor(props) {
		super(props);
		this.shareRef = null;
	}

	shareArtist = () => {
		if (this.shareRef) {
			const url = `${window.location.origin}/artist/${this.props.id}/all`
			if (coreActions.copyToClipboard(url)) {
				this.shareRef.classList.add("copied-to-clipboard");
				setTimeout(() => {
					if (this.shareRef) this.shareRef.classList.remove("copied-to-clipboard");
				}, 3000)
				this.props.notify("Artist's Link copied to your clipboard!");
			} else {
				this.props.notify("Cannot Copy Artist's Link to your clipboard Automatically, you can manually copy the link from the url!");
			}
		}
	}

	aritstClickHandler = async id => {
		this.props.push(`/artist/${id}/all`);
	};


	Main = () => {
		return <div className="artist-display-holder" onClick={(e) => {
			if (this.shareRef.contains(e.target))
				return;
			this.aritstClickHandler(this.props.id)
		}}>
			<div className="artist-holer-share-icon-wrapper cursor-pointer">
				<i className="fas fa-share-alt master-color"
					ref={d => this.shareRef = d}
					title="Click to copy this Artist's link to your clipboard!"
					onClick={this.shareArtist}
				></i>
			</div>
			<div className="artist-rounded-circle-holder cursor-pointer" style={{ backgroundImage: `url('${this.props.thumbnail}'), url(${musicDummy})` }}></div>
			<div className="artist-name cursor-pointer">{this.props.name}</div>
			<div className="artist-description cursor-pointer">Artist</div>
		</div>

	}


	ExploreMore = () => {
		return <div className="artist-display-holder Artist-explore-more cursor-pointer" onClick={() => this.props.push(this.props.exploreMoreUrl)}>
			<div className="explore-more-icon-holer">
				<i className="fas fa-compass"></i>
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
