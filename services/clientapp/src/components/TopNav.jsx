import React, { Component } from "react";
import "../assets/css/topnav.css";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import { toastActions, searchActions, authActions } from "../actions";
import { angleright } from "../assets/images";
import { store } from "../store";

class TopNav extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showUserOptions: false,
		};
		this.userOpt = this.userOpt.bind(this);
	}
	componentDidMount() {
		this.initListeners();
	}

	initListeners() {
		const searchBarRef = document.getElementsByClassName("search-input")[0];
		searchBarRef.addEventListener(
			"focusin",
			function (e) {
				this.props.updateTyping(true);
			}.bind(this)
		);
		searchBarRef.addEventListener(
			"focusout",
			function (e) {
				this.props.updateTyping(false);
			}.bind(this)
		);

		document.addEventListener(
			"keydown",
			function (e) {
				if (e.keyCode === 27) {
					this.props.emptyKeywordSuggestion();
				}
			}.bind(this)
		);
	}

	userOpt(e) {
		if (e.target.classList.contains("usr-opt")) {
		} else {
			this.setState({ showUserOptions: false });
			document.removeEventListener("click", this.userOpt);
		}
	}

	componentWillUnmount() {
		this.setState({ showUserOptions: false });
		document.removeEventListener("click", this.userOpt);
	}

	render() {
		return (
			<section className="main-header">
				<div className="container-action-notifier">
					<img src={angleright} alt="" srcSet="" />
					<span>{this.props.currentActionTitle}</span>
				</div>
				<div className="master-search-bar">
					<form
						action=""
						onSubmit={async e => {
							e.preventDefault();
							await this.props.fetchResults();
						}}>
						<input
							type="text"
							onKeyUp={async e => {
								await this.props.onKeyUpHandler(e);
							}}
							value={this.props.suggestionText}
							onChange={async e => {
								await this.props.getKeywordSuggestion(e.target.value);
							}}
							className="search-input"
							placeholder="Search Artists, Albums, Films, Songs...."
						/>
						<div className="search-icon" type="submit">
							<i className="far fa-search"></i>
						</div>
					</form>
					<div className="suggestion-keyword-holder">
						{this.props.keywordSuggestions.map((item, key) => (
							<div
								onClick={async e => {
									await this.props.updateSuggestionText(item[0]);
									await this.props.fetchResults();
								}}
								key={key}
								className={`suggested-keyword ${this.props.currentTextIndex === key + 1 ? "highlight-current" : ""}`}>
								{item[0]}
							</div>
						))}
					</div>
				</div>
				<div className="main-user-profile-holder">
					{this.props.isAuthenticated ? (
						<div className="login-user-display">
							<img
								className="cursor-pointer"
								onClick={() => {
									this.setState({ showUserOptions: true });
									document.addEventListener("click", this.userOpt);
								}}
								src={`${this.props.userDetails.avatar}`}
								alt=""
								srcSet=""
							/>
							<div className={`usr-opt user-option-display-holder ${this.state.showUserOptions ? "" : "make-invisible"}`}>
								<div className="usr-opt list user-name-holder">{this.props.userDetails.name}</div>
								<hr />
								<div
									onClick={() => {
										this.props.logoutHandler();
									}}
									className="usr-opt list logout-button-holder cursor-pointer">
									<div>
										<i className="usr-opt fas fa-sign-out-alt toast-base-color logout-icon"></i>
									</div>
									<div>logout</div>
								</div>
							</div>
						</div>
					) : (
							<div className="auth-login-register-holder cursor-pointer" onClick={async (e) => {
								const state = await store.getState();
								const currentPath = `${state.router.location.pathname}${state.router.location.search}`;
								/* eslint-disable-next-line */
								this.props.push(`/auth?queue=${Base64.encodeURI(currentPath)}`);
							}}>
								<i className="fas fa-power-off red-color auth-power-on"></i>
								<span className="hide-me">&nbsp;&nbsp;Login/Register</span>
							</div>
						)}
				</div>
			</section >
		);
	}
}

const mapStateToProps = state => {
	return {
		currentActionTitle: state.coreReducer.currentActionTitle,
		suggestionText: state.searchReducer.suggestionText,
		keywordSuggestions: state.searchReducer.keywordSuggestions,
		currentTextIndex: state.searchReducer.currentTextIndex,
		actualText: state.searchReducer.actualText,
		isAuthenticated: state.authReducer.isAuthenticated,
		userDetails: state.authReducer.userDetails,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		push: path => {
			dispatch(push(path));
		},
		featureNotify: () => {
			toastActions.featureNotify();
		},
		updateSuggestionText: text => {
			dispatch(searchActions.updateSuggestionText(text));
		},
		onKeyUpHandler: e => {
			dispatch(searchActions.onKeyUpHandler(e));
		},
		updateTyping: isTyping => {
			dispatch(searchActions.updateTyping(isTyping));
		},
		emptyKeywordSuggestion: () => {
			dispatch(searchActions.emptyKeywordSuggestion());
		},
		fetchResults: () => {
			searchActions.fetchResults();
			dispatch(push("/search"));
		},
		getKeywordSuggestion: key => {
			searchActions.getKeywordSuggestion(key);
		},
		logoutHandler: () => {
			authActions.logoutHandler();
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TopNav);
