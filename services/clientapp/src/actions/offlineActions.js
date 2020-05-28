import { store } from "../store"

export const setOnlinestatus = (status = true) => {
    store.dispatch({
        type: "SET_ONLINE_STATUS",
        payload: status
    })
}

export const offlineCheckerInitiator = () => {
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
                window.location.reload();
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