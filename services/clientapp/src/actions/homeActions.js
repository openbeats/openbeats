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
import { push } from "connected-react-router";

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

export const fetchLatestAlbums = async (page = 1, limit = 10, advanced = false) => {
    try {
        const {
            data
        } = await axios.get(`${variables.baseUrl}/playlist/album/all?type=latest&page=${page}&limit=${limit}`);
        if (data.status)
            if (!advanced)
                return data.data.result;
            else
                return data.data;
        else
            throw new Error(data.data.toString());
    } catch (error) {
        toastActions.showMessage(error.toString());
        return [];
    }
}

export const fetchLanguageAlbums = async (languageId, type = "latest", page = 1, limit = 10, advanced = false) => {
    try {
        const languageAlbumsFetchUrl = `${variables.baseUrl}/playlist/language/${languageId}/albums?page=${page}&limit=${limit}`;
        const data = (await axios.get(languageAlbumsFetchUrl)).data;
        if (data.status) {
            if (!advanced)
                return data.data.result;
            else
                return data.data
        } else {
            throw new Error(data.data);
        }
    } catch (error) {
        toastActions.showMessage(error.message.toString());
        store.dispatch(push("/"))
    }
    return []
}

export const fetchPopularAlbums = async (page = 1, limit = 10, advanced = false) => {
    try {
        const {
            data
        } = await axios.get(`${variables.baseUrl}/playlist/album/all?type=popular&page=${page}&limit=${limit}`);
        if (data.status)
            if (!advanced)
                return data.data.result;
            else
                return data.data;
        else
            throw new Error(data.data.toString());
    } catch (error) {
        toastActions.showMessage(error.toString());
        return [];
    }
}

export const fetchPopularArtists = async () => {
    try {
        const {
            data
        } = await axios.get(`${variables.baseUrl}/playlist/artist/all?type=popular&page=1&limit=10`);
        if (data.status)
            return data.data.result;
        else
            throw new Error(data.data.toString());
    } catch (error) {
        toastActions.showMessage(error.toString());
        return [];
    }
}
export const fetchLanguages = async () => {
    try {
        const {
            data
        } = await axios.get(`${variables.baseUrl}/playlist/language/all?type=popular&page=1&limit=10`);
        if (data.status)
            return data.data.result;
        else
            throw new Error(data.data.toString());
    } catch (error) {
        toastActions.showMessage(error.toString());
        return [];
    }
}
export const fetchEmotions = async () => {
    try {
        const {
            data
        } = await axios.get(`${variables.baseUrl}/playlist/emotion/all?type=popular&page=1&limit=10`);
        if (data.status)
            return data.data.result;
        else
            throw new Error(data.data.toString());
    } catch (error) {
        toastActions.showMessage(error.toString());
        return [];
    }
}