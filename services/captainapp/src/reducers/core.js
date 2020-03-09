const initialState = {
    isLoading: false
}

export const core = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_STATE_TOGGLER:
            state = {
                ...state,
                isLoading: action.payload
            };
            break;
        default:
            break;
    }
    return state;
}