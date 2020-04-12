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

export async function showAddPlaylistDialog(song) {
    const isAuthenticated = await store.getState().authReducer.isAuthenticated;
    if (isAuthenticated)
        store.dispatch({
            type: "SHOW_PLAYLIST_ADD_DIALOG",
            payload: {
                showAddPlaylistDialog: true,
                currentSong: song
            }
        })
    else {
        toastActions.showMessage("Please Login to use this feature!!!")
    }
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

export async function fetchChartsPlaylist(playlistId) {
    try {
        const {
            data
        } = await axios.get(`${variables.baseUrl}/playlist/topcharts/${playlistId}`)
        return data;
    } catch (error) {
        toastActions.showMessage(error.toString());
        return null;
    }
}

export async function fetchRecentlyPlayed() {
    try {
        const isAuthenticated = await store.getState().authReducer.isAuthenticated;
        if (isAuthenticated) {
            const token = await store.getState().authReducer.userDetails.token;
            const options = {
                headers: {
                    'x-auth-token': token
                }
            };
            const {
                data
            } = await axios.get(`${variables.baseUrl}/auth/metadata/recentlyplayed`, options);
            return data;
        } else {
            throw new Error("Please Login to Use this Feature!");
        }
    } catch (error) {
        toastActions.showMessage(error.toString());
        return null;
    }
}

export async function fetchAlbumPlaylist(playlistId) {
    try {
        const {
            data
        } = await axios.get(`${variables.baseUrl}/playlist/album/${playlistId}`)
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

export async function fetchChartsPlaylistMetadata() {
    try {

        let metaData = [];
        const {
            data
        } = await axios.get(`${variables.baseUrl}/playlist/topcharts/metadata`)

        metaData = data.allcharts
        return metaData


    } catch (error) {
        console.error(error)
        return [];
    }
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

export async function removeSongFromPlaylist(playlistId, songId) {
    try {
        await axios.post(`${variables.baseUrl}/playlist/userplaylist/deletesong`, {
            playlistId,
            songId
        })
        toastActions.showMessage("Song removed to the playlsit!")
    } catch (error) {
        toastActions.showMessage(error.toString())
    }

    return true;


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

export async function deleteUserPlaylist(pId) {
    try {
        await axios.get(`${variables.baseUrl}/playlist/userplaylist/delete/${pId}`)
        toastActions.showMessage("playlist Deleted successfully");
        await fetchUserPlaylistMetadata(store.getState().authReducer.userDetails.id);
        return true;
    } catch (error) {
        toastActions.showMessage(error.toString())
        return false;
    }
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

export async function addOrRemoveAlbumFromUserCollection(albumId, isAdd = true) {
    try {
        const userId = store.getState().authReducer.userDetails.id;
        if (isAdd) {
            await axios.post(`${variables.baseUrl}/auth/metadata/myCollections`, {
                userId,
                albumId
            })
            toastActions.showMessage("Album Added to the collection!");
        } else {
            await axios.delete(`${variables.baseUrl}/auth/metadata/myCollections`, {
                userId,
                albumId
            })
            toastActions.showMessage("Album Added to the collection!");
        }
        return true;
    } catch (error) {
        toastActions.showMessage(error.toString())
        return false;
    }
}

export async function getAllAlbumsInTheCollection(albumId, isAdd = true) {
    try {
        const userId = store.getState().authReducer.userDetails.id;
        if (isAdd) {
            await axios.post(`${variables.baseUrl}/auth/metadata/myCollections`, {
                userId,
                albumId
            })
            toastActions.showMessage("Album Added to the collection!");
        } else {
            await axios.delete(`${variables.baseUrl}/auth/metadata/myCollections`, {
                userId,
                albumId
            })
            toastActions.showMessage("Album Added to the collection!");
        }
        return true;
    } catch (error) {
        toastActions.showMessage(error.toString())
        return false;
    }
}