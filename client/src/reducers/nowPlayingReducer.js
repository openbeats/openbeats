const initialState = {
    isPlaylist: false,
    currentPlaying: {
        videoId: "dummy"
    },
    playlistName: null,
    playlistId: null,
    playlistThumbnail: null,
    isNextAvailable: false,
    isPreviousAvailable: false,
    playerQueue: [],
    currentIndex: 0,
}

const nowPlayingReducer = (state = initialState, action) => {
    switch (action.type) {
        case "UPDATE_CURRENT_PLAYING":
            state = {
                ...state,
                ...action.payload
            };
            break;
        case "CLEAR_PLAYER_QUEUE":
            state = initialState;
            break;
        case "UPDATE_PLAYER_QUEUE":
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

export default nowPlayingReducer;