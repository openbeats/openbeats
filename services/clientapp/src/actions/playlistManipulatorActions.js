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
import {
    UPDATE_LIKED_PLAYLISTS_METADATA
} from "../types";

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

export async function fetchAlbumPlaylist(playlistId, type = "album") {
    try {
        let url = '';
        let options = {};
        const isAuthenticated = await store.getState().authReducer.isAuthenticated;
        if (isAuthenticated) {
            const token = await store.getState().authReducer.userDetails.token;
            options = {
                headers: {
                    'x-auth-token': token
                }
            };
        }
        switch (type) {
            case 'album':
                url = `${variables.baseUrl}/playlist/album/${playlistId}`;
                break;
            case 'topchart':
                url = `${variables.baseUrl}/playlist/topcharts/${playlistId}`;
                break;
            case 'user':
                url = `${variables.baseUrl}/playlist/userplaylist/getplaylist/${playlistId}`;
                break;
            case 'recentlyplayed':
                url = `${variables.baseUrl}/auth/metadata/recentlyplayed`;
                break;
            default:
                break;
        }
        if (url.length === 0) throw new Error("Inavalid Album url");
        const {
            data
        } = await axios.get(url, options)
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
            const {
                data
            } = await axios.post(`${variables.baseUrl}/auth/metadata/myCollections`, {
                userId,
                albumId
            });
            if (data.status)
                toastActions.showMessage("Album Added to the collection!");
            else
                throw new Error(data.data.toString());
        } else {
            const {
                data
            } = await axios.delete(`${variables.baseUrl}/auth/metadata/myCollections`, {
                data: {
                    userId,
                    albumId
                }
            });
            if (data.status)
                toastActions.showMessage("Album Deleted from the collection!");
            else
                throw new Error(data.data.toString());
        }
        updateAlbumsInTheCollectionMetaData();
        return true;
    } catch (error) {
        toastActions.showMessage(error.toString())
        return false;
    }
}

export async function fetchAllAlbumsInTheCollection() {
    try {
        const token = await store.getState().authReducer.userDetails.token;
        const options = {
            headers: {
                'x-auth-token': token
            }
        };
        const {
            data
        } = await axios.get(`${variables.baseUrl}/auth/metadata/mycollections`, options);
        return data;
    } catch (error) {
        toastActions.showMessage(error.toString());
        return null;
    }
}

export async function updateAlbumsInTheCollectionMetaData() {
    const token = await store.getState().authReducer.userDetails.token;
    const options = {
        headers: {
            'x-auth-token': token
        }
    };
    const {
        data
    } = await axios.get(`${variables.baseUrl}/auth/metadata/mycollections?metadata=true`, options);
    if (data.status)
        store.dispatch({
            type: UPDATE_LIKED_PLAYLISTS_METADATA,
            payload: data.data
        })
}