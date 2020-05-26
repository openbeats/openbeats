import { store } from "../store"
import { push } from "connected-react-router";

export const setOnlinestatus = (status = true) => {
    store.dispatch({
        type: "SET_ONLINE_STATUS",
        payload: status
    })
}

export const offlineCheckerInitiator = () => {
    advancedOfflineChecker();
    window.addEventListener("load", () => {
        window.addEventListener("online", advancedOfflineChecker);
        window.addEventListener("offline", advancedOfflineChecker);
    });
}


export const advancedOfflineChecker = () => {
    const isReachable = (url) => {
        return fetch(url, { method: 'HEAD', mode: 'no-cors' })
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
        isReachable(getServerUrl()).then(function (online) {
            if (online) {
                // online
                setOnlinestatus(true);
                store.dispatch(push("/404"));
                store.dispatch(push("/"));
            } else {
                console.log('no connectivity');
                // offline
                setOnlinestatus(false);
            }
        });
    } else {
        // offline
        setOnlinestatus(false);
    }
}