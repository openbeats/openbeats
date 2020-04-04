import {
    TOGGLE_ADD_ARTIST_DIALOG,
} from "../types";

const initialState = {
    isOpened: false,
    artistName: "home",
    addArtistCallBack: null
}

export const addArtist = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_ADD_ARTIST_DIALOG:
            state = {
                ...state,
                isOpened: action.payload.isOpened,
                artistName: action.payload.artistName,
                addArtistCallBack: action.payload.addArtistCallBack
            };
            break;
        default:
            break;
    }
    return state;
}