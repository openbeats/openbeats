import { store } from "../store";

export function updateHelment(payload) {
    store.dispatch({
        type: "UPDATE_HELMET",
        payload: payload
    })
}

export function resetHelment() {
    store.dispatch({
        type: "RESET_HELMET"
    })
}