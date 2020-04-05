import {
    TOGGLE_HANGING_PLAYER,
    SET_HANGING_PLAYER_SONG_DATA,
    RESET_HANGING_PLAYER,
    SET_HANGING_PLAYER_INIT_CALLBACK
} from "../types";

const initialState = {
    showHangingPlayer: false,
    songData: {},
    hangingPlayerInitCallback: null
}

export const hangingPlayer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_HANGING_PLAYER:
            state = {
                ...state,
                showHangingPlayer: action.payload
            };
            break;
        case SET_HANGING_PLAYER_SONG_DATA:
            state = {
                ...state,
                songData: action.payload
            };
            break;
        case SET_HANGING_PLAYER_INIT_CALLBACK:
            state = {
                ...state,
                hangingPlayerInitCallback: action.payload
            };
            break;
        case RESET_HANGING_PLAYER:
            state = {
                showHangingPlayer: false,
                songData: {}
            };
            break;
        default:
            break;
    }
    return state;
}