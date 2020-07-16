import {
    store
} from "../store"
import { nowPlayingActions } from "."

export const setOnlinestatus = (status = true) => {
    store.dispatch({
        type: "SET_ONLINE_STATUS",
        payload: status
    })
}
export const setSafaristatus = (status = false) => {
    store.dispatch({
        type: "SET_SAFARI_STATUS",
        payload: status
    })
}

const isSafari = () => (/^((?!chrome|android).)*safari/i.test(navigator.userAgent));

export const offlineCheckerInitiator = () => {
    window.addEventListener("load", () => {
        setSafaristatus(isSafari());
        window.addEventListener("online", advancedOfflineChecker);
        window.addEventListener("offline", advancedOfflineChecker);
    });
}


export const advancedOfflineChecker = () => {
    const isReachable = (url) => {
        return fetch(url, {
            method: 'HEAD',
            mode: 'no-cors'
        })
            .then(function (resp) {
                return resp && (resp.ok || resp.type === 'opaque');
            })
            .catch(function (err) {
                console.warn('[conn test failure]:', err);
            });
    }

    const getServerUrl = () => {
        return window.location.origin;
    }

    if (navigator.onLine) {
        isReachable(getServerUrl()).then(async function (online) {
            if (online) {
                // online
                setOnlinestatus(true);
                const state = await store.getState();
                console.log(state)
                if (state.nowPlayingReducer.playerQueue.length)
                    nowPlayingActions.selectFromPlaylist(state.nowPlayingReducer.currentIndex)
                // window.location.reload();
            } else {
                // offline
                setOnlinestatus(false);
            }
        });
    } else {
        // offline
        setOnlinestatus(false);
    }
}