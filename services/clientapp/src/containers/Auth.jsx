import React, { Component } from "react";
import "../css/auth.css";
import { toastActions } from "../actions";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { store } from "../store";
import { musicIllustration, masterLogo } from "../images";
// import * as qs from 'query-string';

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayRegister: false
    };
    this.Toggler = this.Toggler.bind(this);
    this.Login = this.Login.bind(this);
    this.Register = this.Register.bind(this);
  }

	Login() {
		return (
			<div
				className={`login-holder ${
					this.state.displayRegister ? "hide-me" : ""
				}`}>
				<img className="responsive-master-logo" src={masterLogo} alt="" />
				<div className="login-header">Login</div>
				<div className="native-login-input">
					<input placeholder="Email" type="text" name="" id="" />
				</div>
				<div className="native-login-input">
					<input placeholder="Password" type="password" name="" id="" />
				</div>
				<div className="remaind-me">
					<input type="checkbox" name="" id="" />
					Remember Me
				</div>
				<button className="native-login-button cursor-pointer">Login</button>
				<div className="responsive-link-creator">
					Don't have a OpenBeats Accont yet?{" "}
				</div>
				<div
					onClick={() =>
						this.setState({
							displayRegister: !this.state.displayRegister,
						})
					}
					className="responsive-custom-link cursor-pointer">
					Create One
				</div>
			</div>
		);
	}

	Register() {
		return (
			<div
				className={`register-holder ${
					!this.state.displayRegister ? "hide-me" : ""
				}`}>
				<img className="responsive-master-logo" src={masterLogo} alt="" />

				<div className="login-header">Register</div>
				<div className="native-login-input">
					<input placeholder="Username" type="text" name="" id="" />
				</div>
				<div className="native-login-input">
					<input placeholder="Email" type="text" name="" id="" />
				</div>
				<div className="native-login-input">
					<input placeholder="Password" type="password" name="" id="" />
				</div>
				<div className="native-login-input">
					<input placeholder="Confirm Password" type="password" name="" id="" />
				</div>
				<button className="native-login-button cursor-pointer">Register</button>
				<div className="responsive-link-creator">
					Already have a OpenBeats Accont?
				</div>
				<div
					onClick={() =>
						this.setState({
							displayRegister: !this.state.displayRegister,
						})
					}
					className="responsive-custom-link cursor-pointer">
					Login
				</div>
			</div>
		);
	}

	Toggler() {
		return (
			<div
				className={`toggle-slider ${
					this.state.displayRegister ? "display-register" : ""
				}`}>
				{this.state.displayRegister ? (
					<div className="toggle-content-holder">
						<img
							className="music-master-logo"
							src={masterLogo}
							alt=""
							srcSet=""
						/>
						<img
							className="music-illustration"
							src={musicIllustration}
							alt=""
							srcSet=""
						/>
						<div className="toggler-content-holder">
							Already have a OpenBeats Account ?
						</div>
						<button
							onClick={() =>
								this.setState({
									displayRegister: !this.state.displayRegister,
								})
							}
							className="toggler-login-register-button cursor-pointer">
							Login
						</button>
					</div>
				) : (
					<div className="toggle-content-holder">
						<img
							className="music-master-logo"
							src={masterLogo}
							alt=""
							srcSet=""
						/>
						<img
							className="music-illustration"
							src={musicIllustration}
							alt=""
							srcSet=""
						/>
						<div className="toggler-content-holder">
							Don't have a OpenBeats Account Yet?
						</div>
						<button
							onClick={() =>
								this.setState({
									displayRegister: !this.state.displayRegister,
								})
							}
							className="toggler-login-register-button cursor-pointer">
							Register
						</button>
					</div>
				)}
			</div>
		);
	}

	render() {
		return (
			<div className="auth-wrapper">
				<this.Toggler />
				<this.Register />
				<this.Login />
			</div>
		);
	}
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    push: path => {
      if (path !== store.getState().router.location.pathname)
        dispatch(push(path));
    },
    notify: message => {
      toastActions.showMessage(message);
    },
    featureNotify: () => {
      toastActions.featureNotify();
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
