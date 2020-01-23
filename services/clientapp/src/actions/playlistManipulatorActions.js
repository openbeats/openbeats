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

export async function fetchUserPlaylist(playlistId) {
    try {
        const {
            data
        } = await axios.get(`${variables.baseUrl}/playlist/userplaylist/getplaylist/${playlistId}`)
        return data;
    } catch (error) {
        toastActions.showMessage(error.toString());
        return null;
    }
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
    try {
        await axios.post(`${variables.baseUrl}/playlist/userplaylist/addsongs`, {
            playlistId: pId,
            songs: [song]
        })
        toastActions.showMessage("Song added to the playlsit!")
    } catch (error) {
        toastActions.showMessage(error.toString())
    }

    return true;
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

export async function changeUserPlaylistName(playlistId, name) {
    try {
        await axios.post(`${variables.baseUrl}/playlist/userplaylist/updatename`, {
            name,
            playlistId
        })
        toastActions.showMessage("playlist name updated successfully");
        fetchUserPlaylistMetadata(store.getState().authReducer.userDetails.id);
        return true;
    } catch (error) {
        toastActions.showMessage(error.toString())
        return false;
    }
}