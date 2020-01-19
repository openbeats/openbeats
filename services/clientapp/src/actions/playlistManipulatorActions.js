import {
    store
} from "../store";
// import {
//     variables
// } from "../config";

export function showAddPlaylistDialog(song) {
    store.dispatch({
        type: "SHOW_PLAYLIST_ADD_DIALOG",
        payload: {
            showAddPlaylistDialog: true,
            currentSong: song
        }
    })
    return true;
}

export function clearAddPlaylistDialog() {
    store.dispatch({
        type: "PLAYLIST_DIALOG_RESET_TO_INITIAL",
        payload: {}
    })
    return true;
}

export function fetchUserPlaylist() {

    return true;
}

export function deleteUserPlaylist(params) {

    return true;
}

export function changeUserPlaylistName(params) {

    return true;
}