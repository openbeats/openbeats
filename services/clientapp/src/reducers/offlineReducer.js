const initialState = {
    isOnline: true,
}

const coreReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_ONLINE_STATUS":
            state = {
                ...state,
                isOnline: action.payload
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

export default coreReducer;