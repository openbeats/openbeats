import { playerActions } from "../actions"
import { store } from "../store";

export function updateCurrentPlaying(audioData, playMusic = true) {
    store.dispatch({
        type: "UPDATE_CURRENT_PLAYING",
        payload: {
            currentPlaying: audioData,
            playedSongs: [],
            playerQueue: [],
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

export function updatePlayerQueue(queueData) {
    const playlistData = { ...queueData, playlistData: [...queueData.playlistData] }
    let songsList = [...queueData.playlistData];
    let audioData = songsList.shift()
    let playlistId = queueData.playlistId;
    let playlistName = queueData.playlistName;
    let playlistThumbnail = queueData.playlistThumbnail;
    let isNextAvailable = songsList.length > 0 ? true : false
    let isPreviousAvailable = false
    store.dispatch({
        type: "UPDATE_PLAYER_QUEUE",
        payload: {
            isPlaylist: true,
            playlistId: playlistId,
            playerQueue: songsList,
            currentPlaying: audioData,
            playedSongs: [
                audioData
            ],
            playlistName,
            playlistThumbnail,
            isNextAvailable,
            isPreviousAvailable,
            playlistData
        }
    })
    playerActions.initPlayer(audioData)
}
export function reQueue() {
    let queueData = store.getState().nowPlayingReducer.playlistData;
    const playlistData = { ...queueData, playlistData: [...queueData.playlistData] };
    let songsList = [...queueData.playlistData];
    let audioData = songsList.shift()
    let playlistId = queueData.playlistId;
    let playlistName = queueData.playlistName;
    let playlistThumbnail = queueData.playlistThumbnail;
    let isNextAvailable = songsList.length > 0 ? true : false
    let isPreviousAvailable = false
    store.dispatch({
        type: "UPDATE_PLAYER_QUEUE",
        payload: {
            isPlaylist: true,
            playlistId: playlistId,
            playerQueue: songsList,
            currentPlaying: audioData,
            playedSongs: [
                audioData
            ],
            playlistName,
            playlistThumbnail,
            isNextAvailable,
            isPreviousAvailable,
            playlistData
        }
    })
    playerActions.initPlayer(audioData, false)
}

export function playNextSong() {
    let state = store.getState().nowPlayingReducer;
    if (state.playerQueue.length > 0 && state.isPlaylist) {
        let queue = state.playerQueue;
        let playedQueue = state.playedSongs;
        let audioData = queue.shift();
        let isNextAvailable = queue.length > 0 ? true : false
        let isPreviousAvailable = playedQueue.length + 1 > 1 ? true : false

        store.dispatch({
            type: "UPDATE_PLAYER_QUEUE",
            payload: {
                playerQueue: queue,
                currentPlaying: audioData,
                playedSongs: [
                    ...state.playedSongs,
                    audioData
                ],
                isNextAvailable,
                isPreviousAvailable
            }
        })
        playerActions.initPlayer(audioData)
    }
}

export function clearQueue() {
    store.dispatch({
        type: "CLEAR_PLAYER_QUEUE"
    })
    playerActions.resetPlayer()

}