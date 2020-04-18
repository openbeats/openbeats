import axios from "axios";
import {
    variables
} from "../config";
import {
    store
} from "../store";
import {
    toastActions
} from ".";

export const fetchTopCharts = async () => {
    try {
        let metaData = [];
        const {
            data
        } = await axios.get(`${variables.baseUrl}/playlist/topcharts/metadata`)
        metaData = data.allcharts
        return metaData
    } catch (error) {
        console.error(error)
        return [];
    }
}

export const fetchMyCollections = async () => {
    try {
        const authReducer = await store.getState().authReducer;
        const isAuthenticated = authReducer.isAuthenticated;
        if (!isAuthenticated) throw new Error("Authentication Required!");
        const token = authReducer.userDetails.token;
        const options = {
            headers: {
                'x-auth-token': token
            }
        };
        const {
            data
        } = await axios.get(`${variables.baseUrl}/auth/metadata/mycollections`, options);
        if (data.status)
            return data.data;
        else
            throw new Error(data.data.toString());
    } catch (error) {
        toastActions.showMessage(error.toString());
        return [];
    }
}