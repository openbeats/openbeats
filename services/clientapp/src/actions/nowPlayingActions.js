import {
    playerActions,
    toastActions
} from "../actions"
import {
    store
} from "../store";
// import {
//     push
// } from "connected-react-router";

export function updateCurrentPlaying(audioData, playMusic = true) {
    store.dispatch({
        type: "UPDATE_CURRENT_PLAYING",
        payload: {
            currentPlaying: audioData,
            currentIndex: 0,
            playerQueue: [audioData],
            playlistId: null,
            isPlaylist: false,
            playlistName: null,
            playlistThumbnail: null,
            isNextAvailable: false,
            isPreviousAvailable: false
        }
    })
    playerActions.initPlayer(audioData, playMusic);
}

export async function updatePlayerQueue(playlistData, key = 0) {
    const playerQueue = [...playlistData.playlistData]
    const playlistId = playlistData.playlistId;
    const playlistName = playlistData.playlistName;
    const playlistThumbnail = playlistData.playlistThumbnail;
    const isNextAvailable = playerQueue.length - 1 > 0 ? true : false
    const isPreviousAvailable = false
    await store.dispatch({
        type: "UPDATE_PLAYER_QUEUE",
        payload: {
            isPlaylist: true,
            playlistId,
            playerQueue,
            currentIndex: 0,
            playlistName,
            currentPlaying: playerQueue[key],
            playlistThumbnail,
            isNextAvailable,
            isPreviousAvailable,
        }
    })
    selectFromPlaylist(key)
}

export function reQueue(playTrigger = false) {
    let state = store.getState().nowPlayingReducer;
    const audioData = state.playerQueue[0]
    const isNextAvailable = state.playerQueue.length > 0 ? true : false
    const isPreviousAvailable = false
    store.dispatch({
        type: "UPDATE_PLAYER_QUEUE",
        payload: {
            currentPlaying: audioData,
            currentIndex: 0,
            isNextAvailable,
            isPreviousAvailable,
        }
    })
    playerActions.initPlayer(audioData, playTrigger)
}

export async function playNextSong(isRepeat = false) {

    let state = store.getState().nowPlayingReducer;
    if (state.isPlaylist && state.currentIndex + 1 < state.playerQueue.length && !isRepeat) {
        let audioData = state.playerQueue[state.currentIndex + 1];
        let isNextAvailable = state.playerQueue.length - (state.currentIndex + 2) > 0 ? true : false;
        let isPreviousAvailable = state.currentIndex + 1 > 0 ? true : false
        await store.dispatch({
            type: "UPDATE_PLAYER_QUEUE",
            payload: {
                currentIndex: state.currentIndex + 1,
                currentPlaying: audioData,
                isNextAvailable,
                isPreviousAvailable
            }
        })
        playerActions.initPlayer(audioData)
    } else {
        let audioData = state.playerQueue[state.currentIndex];
        playerActions.initPlayer(audioData)
    }
}

export async function playPreviousSong() {
    let state = store.getState().nowPlayingReducer;

    if (state.isPlaylist && state.currentIndex - 1 >= 0) {
        let audioData = state.playerQueue[state.currentIndex - 1];
        let isNextAvailable = state.playerQueue.length - (state.currentIndex) > 0 ? true : false;
        let isPreviousAvailable = state.currentIndex - 1 !== 0 ? true : false

        await store.dispatch({
            type: "UPDATE_PLAYER_QUEUE",
            payload: {
                currentIndex: state.currentIndex - 1,
                currentPlaying: audioData,
                isNextAvailable,
                isPreviousAvailable
            }
        })
        playerActions.initPlayer(audioData)

    }

}

export async function selectFromPlaylist(key) {

    let state = store.getState().nowPlayingReducer;

    let audioData = state.playerQueue[key];

    let isNextAvailable = state.playerQueue.length - key > 1 ? true : false;

    let isPreviousAvailable = key > 0 ? true : false

    await store.dispatch({
        type: "UPDATE_PLAYER_QUEUE",
        payload: {
            currentIndex: key,
            currentPlaying: audioData,
            isNextAvailable,
            isPreviousAvailable,
            isPlaylist: true,
        }
    })

    playerActions.initPlayer(audioData)

}

export function clearQueue() {
    store.dispatch({
        type: "CLEAR_PLAYER_QUEUE"
    })
    playerActions.resetPlayer()
}

export async function addSongsToQueue(songs) {
    if (!store.getState().authReducer.isAuthenticated) {
        toastActions.showMessage("Please Login to use this feature!")
        // store.dispatch(push("/auth"))
        return
    }

    let state = store.getState().nowPlayingReducer;
    let queueIds = state.playerQueue.map(item => item.videoId)
    let songsToBeAdded = songs.filter(item => !queueIds.includes(item.videoId))
    store.dispatch({
        type: "UPDATE_PLAYER_QUEUE",
        payload: {
            playerQueue: [...state.playerQueue, ...songsToBeAdded],
            isPlaylist: true
        }
    })
    if (!state.currentPlaying.videoId)
        await selectFromPlaylist(0)

    updatePreviousNext();
    toastActions.showMessage("Songs added to queue!")
}

function updatePreviousNext() {
    let state = store.getState().nowPlayingReducer;
    let isNextAvailable = false;
    let isPreviousAvailable = false;

    let currentIndex = state.currentIndex;
    let queueLength = state.playerQueue.length - 1;
    if (currentIndex > 0) {
        isPreviousAvailable = true
    }

    if ((queueLength - currentIndex) > 0) {
        isNextAvailable = true
    }

    store.dispatch({
        type: "UPDATE_PREVIOUS_NEXT",
        payload: {
            isPreviousAvailable,
            isNextAvailable
        }
    })
}