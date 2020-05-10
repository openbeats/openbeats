import axios from "axios";

const setAuthToken = adminDetails => {
	if (adminDetails) {
		const token = adminDetails["token"];
		axios.defaults.headers.common["x-auth-token"] = token;
	} else {
		delete axios.defaults.headers.common["x-auth-token"];
	}
};

export default setAuthToken;
