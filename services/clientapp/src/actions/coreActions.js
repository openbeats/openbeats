export function setCurrentAction(action) {
    return {
        type: "SET_CURRENT_ACTION",
        payload: {
            currentActionTitle: action,
        }
    }

}