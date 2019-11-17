export function showNotification(message) {
    return {
        type: "NOTIFY_TOAST",
        payload: message
    }
}