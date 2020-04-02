import {
    store
} from "../store"
import {
    TOGGLE_ADD_ARTIST_DIALOG
} from "../types"

export const toggleAddArtistDialog = (isOpened, artistName = '') => {
    store.dispatch({
        type: TOGGLE_ADD_ARTIST_DIALOG,
        payload: {
            isOpened,
            artistName
        }
    })
}