import {
    TOGGLE_ADD_ARTIST_DIALOG,
    SET_LAST_UPDATED_ARTIST,
    CLEAR_LAST_UPDATED_ARTIST
} from "../types";

const initialState = {
    isOpened: false,
    artistName: "home",
    lastAddedArtist: null
}

export const addArtist = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_ADD_ARTIST_DIALOG:
            state = {
                ...state,
                isOpened: action.payload.isOpened,
                artistName: action.payload.artistName
            };
            break;

        case SET_LAST_UPDATED_ARTIST:
            state = {
                ...state,
                lastAddedArtist: action.payload
            };
            break;
        case CLEAR_LAST_UPDATED_ARTIST:
            state = {
                ...state,
                lastAddedArtist: null
            };
            break;
        default:
            break;
    }
    return state;
}