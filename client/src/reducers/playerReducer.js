import { musicDummy } from "../images"

const initialState = {
    masterUrl: null,
    fallBackUrl: null,
    isMusicPlaying: false,
    isMuted: false,
    playerVolume: localStorage.getItem("playerVolume") || 0.5,
    currentProgress: 0,
    currentTimeText: '0:00',
    durationTimeText: '0:00',
    thumbnail: musicDummy,
    songTitle: "OpenBeats Stream Unlimited Music!",
    id: null,
    isAudioBuffering: false,
    downloadProcess: false,
}

const playerReducer = (state = initialState, action) => {
    switch (action.type) {
        case "PLAY_PAUSE_TOGGLE":
            state = {
                ...state,
                isMusicPlaying: action.payload
            };
            break;
        case "MUTE_TOGGLE":
            state = {
                ...state,
                ...action.payload
            };
            break;
        case "SEEK_VOLUME":
            state = {
                ...state,
                ...action.payload
            };
            break;
        case "SET_TOTAL_DURATION":
            state = {
                ...state,
                ...action.payload
            };
            break;
        case "UPDATE_VOLUME":
            state = {
                ...state,
                ...action.payload
            };
            break;
        case "AUDIO_PROGRESS_UPDATE":
            state = {
                ...state,
                ...action.payload
            };
            break;
        case "MUSIC_END_HANDLER":
            state = {
                ...state,
                ...action.payload
            };
            break;
        case "LOAD_AUDIO_DATA":
            state = {
                ...state,
                ...action.payload
            };
            break;
        case "PLAYER_DOWNLOAD_HANDLE":
            state = {
                ...state,
                ...action.payload
            };
            break;
        default:
            break;
    }

    return state;

}

export default playerReducer;