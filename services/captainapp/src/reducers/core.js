import {
    SET_CURRENT_NAV_ITEM,
    LOADING_STATE_TOGGLER
} from "../types";

const initialState = {
    isLoading: false,
    currentNavItem: "home"
}

export const core = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_STATE_TOGGLER:
            state = {
                ...state,
                isLoading: action.payload
            };
            break;
        case SET_CURRENT_NAV_ITEM:
            state = {
                ...state,
                currentNavItem: action.payload
            };
            break;
        default:
            break;
    }
    return state;
}