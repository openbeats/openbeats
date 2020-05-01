import axios from "axios";
import { variables } from "../config";
import { toast } from "react-toastify";
import { store } from "../store";
import { push } from "connected-react-router";
import { LOGIN_USER, LOGOUT_USER, SET_CURRENT_NAV_ITEM } from "../types";
import setAuthToken from "../utils/setAuthToken";

export const loginHandler = async (email, password) => {
	try {
		let { data } = (
			await axios.post(`${variables.baseUrl}/auth/login?admin=true`, {
				email,
				password,
			})
		).data;
		if (data && data.admin && data.admin.status && data.admin.accessLevel) {
			toast.success("Login succes redirecting to your dashboard!");
			const adminDetails = {
				email: data.email,
				accessLevel: data.admin.accessLevel,
				name: data.name,
				token: data.token,
				avatar: data.avatar,
				id: data.id,
			};
			await store.dispatch({
				type: LOGIN_USER,
				payload: {
					adminDetails,
					isAuthenticated: true,
				},
			});
			localStorage.setItem("adminDetails", JSON.stringify(adminDetails));
			setAuthToken(adminDetails);
			store.dispatch(push("/"));
		} else {
			throw new Error("userEmail or password is incorrect - or you don't have admin privilages!");
		}
	} catch (error) {
		toast.error(error.toString());
	}
};

export const logoutHandler = async () => {
	localStorage.clear();
	store.dispatch({
		type: LOGOUT_USER,
	});
	store.dispatch({
		type: SET_CURRENT_NAV_ITEM,
		payload: "home",
	});
	store.dispatch(push("/auth"));
};
