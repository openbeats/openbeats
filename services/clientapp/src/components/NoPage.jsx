import React from "react";
import NoPageIllustration from "../assets/images/NoPage.svg";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import "../assets/css/nopage.css";

function NoPage({ push }) {
	return (
		<div className="nopage-center width-100 height-100 display-flex align-items-center justify-content-center">
			<img src={NoPageIllustration} alt="" />
			<span className="error-msg mt-5">
				<strong>Oops! </strong>Looks like you have been lost in music...
			</span>
			<button type="submit" className="native-login-button cursor-pointer ghost-button-semi-transparent mt-5" onClick={() => push()}>
				Take me Home
     	   </button>
		</div>
	);
}
const mapDispatchToProps = dispatch => {
	return {
		push: () => dispatch(push("/")),
	};
};

export default connect(null, mapDispatchToProps)(NoPage);
