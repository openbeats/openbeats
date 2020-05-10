import axios from "axios";

const setAuthToken = async userDetails => {
	if (userDetails) {
		const token = userDetails["token"];
		axios.defaults.headers.common["x-auth-token"] = token;
	} else {
		delete axios.defaults.headers.common["x-auth-token"];
	}
};

export default setAuthToken;