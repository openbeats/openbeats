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

        case "RECIEVE_USER_PLAYLIST_METADATA":
            state = {
                ...state,
                ...action.payload
            }
            break;
        case "RESET_PLAYLIST_MANIPULATOR":
            state = initialState
            break;

        default:
            break;
    }

    return state
}

export default playlistManipulatorReducer;