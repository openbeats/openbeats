const initialState = {
    showAddPlaylistDialog: false,
    currentSong: null,
    userPlaylistMetaData: []
}

const playlistManipulatorReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SHOW_PLAYLIST_ADD_DIALOG":
            state = {
                ...state,
                ...action.payload
            }
            break;

        case "PLAYLIST_DIALOG_RESET_TO_INITIAL":
            state = {
                ...state,
                showAddPlaylistDialog: false,
                currentSong: null
            }
            break;

        default:
            break;
    }

    return state
}

export default playlistManipulatorReducer;