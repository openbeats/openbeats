import {
    store
} from "../store";
import axios from "axios";
import {
    variables
} from "../config";
import {
    toastActions
} from ".";

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

export async function fetchUserPlaylistMetadata(userId) {
    try {

        let metaData = [];
        const {
            data
        } = await axios.get(`${variables.baseUrl}/playlist/userplaylist/getallplaylistmetadata/${userId}`)

        metaData = data.data
        console.log(metaData);


        store.dispatch({
            type: "SHOW_PLAYLIST_ADD_DIALOG",
            payload: {
                userPlaylistMetaData: metaData
            }
        })

    } catch (error) {
        console.error(error)
    }
    return true;
}

export async function addSongToPlaylist(pId, song) {
    console.log(pId, song);
    toastActions.showMessage(pId.toString() + " " + song.videoId.toString())


}
export async function removeSongFromPlaylist(pId, song) {
    console.log(pId, song);
    toastActions.showMessage(pId.toString() + " " + song.videoId.toString())

}

export async function createNewPlaylist(userId, name) {
    try {
        await axios.post(`${variables.baseUrl}/playlist/userplaylist/create`, {
            name,
            userId
        })
        toastActions.showMessage("Playlist created successfully!")
        await fetchUserPlaylistMetadata(userId)
    } catch (error) {
        toastActions.showMessage(error.toString())
    }

    return true

}

export function deleteUserPlaylist(params) {

    return true;
}

export function changeUserPlaylistName(params) {

    return true;
}