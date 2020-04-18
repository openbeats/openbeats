import {
    TOGGLE_HANGING_PLAYER,
    SET_HANGING_PLAYER_SONG_DATA,
    SET_HANGING_PLAYER_INIT_CALLBACK,
    RESET_HANGING_PLAYER
} from "../types";
import {
    store
} from "../store";

export const toggleHangingplayer = (bool) => {
    store.dispatch({
        type: TOGGLE_HANGING_PLAYER,
        payload: bool
    })
}

export const setHangingPlayerSongData = async (songData) => {
    await store.dispatch({
        type: SET_HANGING_PLAYER_SONG_DATA,
        payload: songData
    })
}

export const setHangingPlayerInitCallback = async (callback) => {
    await store.dispatch({
        type: SET_HANGING_PLAYER_INIT_CALLBACK,
        payload: callback
    })
}

export const initHangingPlayer = async () => {
    const initPlayerCallBack = await store.getState().hangingPlayer.hangingPlayerInitCallback;
    if (initPlayerCallBack) initPlayerCallBack();
}

export const resetHangingPlayer = () => {
    store.dispatch({
        type: RESET_HANGING_PLAYER
    })
}