import {
    store
} from "../store";
import {
    TOGGLE_ADD_ARTIST_DIALOG,
    SET_LAST_UPDATED_ARTIST
} from "../types";
import axios from "axios";
import {
    variables
} from "../config";
import {
    toast
} from "react-toastify";

export const toggleAddArtistDialog = (isOpened, artistName = '') => {
    store.dispatch({
        type: TOGGLE_ADD_ARTIST_DIALOG,
        payload: {
            isOpened,
            artistName
        }
    })
}

export const addArtistHandler = async (name, url) => {
    const albumCreateUrl = `${variables.baseUrl}/playlist/artist/create`;
    const resultData = (await axios.post(albumCreateUrl, {
        name,
        thumbnail: url
    })).data;
    if (resultData.status) {
        await store.dispatch({
            type: SET_LAST_UPDATED_ARTIST,
            payload: resultData.data
        })
        return true;
    } else {
        toast.error(resultData.data.toString())
        return false;
    }
}