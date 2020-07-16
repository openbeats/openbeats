import { store } from "../store";

export function updateHelment(payload, force = false) {
    if (!store.getState().playerReducer.isMusicPlaying || force)
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