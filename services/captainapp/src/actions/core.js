import {
    store
} from "../store"
import {
    SET_CURRENT_NAV_ITEM
} from "../types"

export const setCurrentNavItem = (item) => {
    store.dispatch({
        type: SET_CURRENT_NAV_ITEM,
        payload: item
    })
}