import axios from "axios";
import {
    variables
} from "../config";
import {
    toast
} from "react-toastify";
import {
    store
} from "../store";
import {
    push
} from "connected-react-router";
import {
    LOGIN_USER
} from "../types";

export const loginHandler = async (email, password) => {
    try {
        let {
            data
        } = (await axios.post(`${variables.baseUrl}/auth/login?admin=true`, {
            email,
            password
        })).data;

        if (data && data.admin && data.admin.status) {
            toast.success("Login succes redirecting to your dashboard!")
            const adminDetails = {
                email: data.email,
                name: data.name,
                token: data.token,
                avatar: data.avatar,
                id: data.id
            };
            await store.dispatch({
                type: LOGIN_USER,
                payload: {
                    adminDetails,
                    isAuthenticated: true,
                }
            })
            localStorage.setItem("adminDetails", JSON.stringify(adminDetails))
            store.dispatch(push("/"))
        } else {
            throw new Error("userEmail or password is incorrect - or you don't have admin privilages!");
        }
    } catch (error) {
        toast.error(error.toString())
    }
}