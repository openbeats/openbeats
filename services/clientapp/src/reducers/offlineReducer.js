const initialState = {
    isOnline: true,
    isSafari: false,
}

const offlineReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_ONLINE_STATUS":
            state = {
                ...state,
                isOnline: action.payload
            }
            break;
        case "SET_SAFARI_STATUS":
            state = {
                ...state,
                isSafari: action.payload
            }
            break;
        case "RESET_CORE":
            state = initialState
            break;
        default:
            break;
    }

    return state
}

export default offlineReducer;