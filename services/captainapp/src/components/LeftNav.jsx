import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logo } from "../assets/images";
import "../assets/styles/leftnav.css";
import { authActions, coreActions, hangingPlayerActions } from "../actions";
import { HangingPlayer } from ".";

class LeftNav extends Component {
	constructor(props) {
		super(props);
		this.state = {
			itemName: "home",
			profileOptionsShow: false,
			openMobileLeftNav: false
		};
		this.menuRef = null;
	}

	componentWillUnmount() {
		document.removeEventListener("click", this.closeMenu);
	}

	toggleProfielMenu() {
		if (!this.state.profileOptionsShow) {
			this.setState({ profileOptionsShow: true });
			document.addEventListener("click", this.closeMenu);
		} else {
			this.setState({ profileOptionsShow: false });
			document.removeEventListener("click", this.closeMenu);
		}
	}

	closeMenu = e => {
		if (!this.menuRef.contains(e.target)) {
			this.setState({ profileOptionsShow: false });
			document.removeEventListener("click", this.closeMenu);
		}
	};

	toggleMobileLeftNav = () => {
		console.log("hits here")
		this.setState({ openMobileLeftNav: !this.state.openMobileLeftNav })
	}

	render() {
		return (
			<div className={`leftnav-wrapper ${this.state.openMobileLeftNav ? "open-mobile-leftnav" : ''}`}>
				<div className="hamburger-holder" onClick={this.toggleMobileLeftNav}>
					<i className="far fa-bars"></i>
				</div>
				<ul className="leftnav-menu">
					<div className="leftnav-item hanging-music-player-holder">
						<img
							className="leftnav-logo-img cursor-pointer"
							onClick={() => this.props.toggleHangingPlayer(!this.props.showHangingPlayer)}
							src={logo}
							alt=""
							srcSet=""
						/>
						<HangingPlayer />
					</div>
					<Link to="/" onClick={() => this.props.setCurrentNavItem("home")} className={`leftnav-item`} title="Home - view insights and more">
						<div className={`content ${this.props.currentNavItem === "home" ? "item-active" : ""}`} title="Home">
							<i className="far fa-home"></i>
							<span>Home</span>
						</div>
					</Link>
					<Link to="/albums" onClick={() => this.props.setCurrentNavItem("albums")} className={`leftnav-item`} title="Create, View and Update Albums">
						<div className={`content ${this.props.currentNavItem === "albums" ? "item-active" : ""}`}>
							<i className="fas fa-album-collection"></i>
							<span>Albums</span>
						</div>
					</Link>
					<Link
						to="/artists"
						onClick={() => this.props.setCurrentNavItem("artists")}
						className={`leftnav-item`}
						title="Add, Update and delete Artists">
						<div className={`content ${this.props.currentNavItem === "artists" ? "item-active" : ""}`}>
							<i className="fas fa-user-music"></i>
							<span>Artists</span>
						</div>
					</Link>
					{[2, 3].includes(this.props.adminDetails.accessLevel) &&
						<Link to="userbase" onClick={() => this.props.setCurrentNavItem("userbase")} className={`leftnav-item`} title="View users">
							<div className={`content ${this.props.currentNavItem === "userbase" ? "item-active" : ""}`}>
								<i className="fas fa-users"></i>
								<span>Users</span>
							</div>
						</Link>
					}
					<li className="leftnav-item">
						<div
							ref={d => (this.menuRef = d)}
							className={`leftnav-item profile-options ${this.state.profileOptionsShow ? "profile-options-show" : ""}`}>
							<div className="content" onClick={() => this.props.logoutHandler()}>
								<i className="fas fa-sign-out-alt"></i>
								<span>Logout</span>
							</div>
						</div>
						<div className="content" title={this.props.adminDetails.name + " - Profile settings and Logout"} onClick={() => this.toggleProfielMenu()}>
							<img className="leftnav-profile-img" src={this.props.adminDetails.avatar} alt="" srcSet="" />
						</div>
					</li>
				</ul>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		adminDetails: state.auth.adminDetails,
		currentNavItem: state.core.currentNavItem,
		showHangingPlayer: state.hangingPlayer.showHangingPlayer,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		logoutHandler: () => {
			authActions.logoutHandler();
		},
		setCurrentNavItem: item => {
			coreActions.setCurrentNavItem(item);
		},
		toggleHangingPlayer: bool => {
			hangingPlayerActions.toggleHangingplayer(bool);
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftNav);
