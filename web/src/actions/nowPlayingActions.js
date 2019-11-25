import { playerActions } from "../actions"
// import { toastActions } from "../actions";
import { store } from "../store";

export function updateCurrentPlaying(audioData) {
    store.dispatch({
        type: "UPDATE_CURRENT_PLAYING",
        payload: {
            currentPlaying: audioData,
            playedSongs: [],
            playerQueue: [],
            playlistId: null,
            isPlaylist: false,
            playlistName: null,
            playlistThumbnail: null
        }
    })
    playerActions.initPlayer(audioData);
}

export function updatePlayerQueue(queueData) {
    console.log("updating queue");

    let songsList = queueData.playlistData;
    let audioData = songsList.shift()
    let playlistId = queueData.playlistId;
    let playlistName = queueData.playlistName;
    let playlistThumbnail = queueData.playlistThumbnail;
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
            playlistThumbnail
        }
    })
    playerActions.initPlayer(audioData)
}

export function playNextSong() {
    console.log("next song");
    
    let state = store.getState().nowPlayingReducer;
    if (state.playerQueue.length > 0 && state.isPlaylist) {
        let queue = state.playerQueue;
        let audioData = queue.shift();
        store.dispatch({
            type: "UPDATE_PLAYER_QUEUE",
            payload: {
                playerQueue: queue,
                currentPlaying: audioData,
                playedSongs: [
                    ...state.playedSongs,
                    audioData
                ]
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