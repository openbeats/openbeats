import {
    TOGGLE_ADD_ARTIST_DIALOG
} from "../types";

const initialState = {
    isOpened: false,
    artistName: "home"
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
        default:
            break;
    }
    return state;
}