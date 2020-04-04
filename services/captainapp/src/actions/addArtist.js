import {
    store
} from "../store";
import {
    TOGGLE_ADD_ARTIST_DIALOG,
} from "../types";
import axios from "axios";
import {
    variables
} from "../config";
import {
    toast
} from "react-toastify";

export const toggleAddArtistDialog = (isOpened, artistName = '') => {
    let promiseResolve;
    const promise = new Promise(function (resolve, reject) {
        promiseResolve = resolve;
    });

    const callBack = (data) => {
        promiseResolve(data);
    }

    store.dispatch({
        type: TOGGLE_ADD_ARTIST_DIALOG,
        payload: {
            isOpened,
            artistName,
            addArtistCallBack: callBack
        }
    })

    return promise;
}

export const addArtistHandler = async (name, url) => {
    const albumCreateUrl = `${variables.baseUrl}/playlist/artist/create`;
    const resultData = (await axios.post(albumCreateUrl, {
        name,
        thumbnail: url
    })).data;
    if (resultData.status) {
        const data = {
            status: true,
            data: resultData.data
        };
        return data;
    } else {
        toast.error(resultData.data.toString())
        const data = {
            status: false,
            data: resultData.data
        };
        return data;
    }
}