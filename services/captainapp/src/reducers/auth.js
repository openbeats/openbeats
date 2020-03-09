import {
    LOGIN_USER,
    LOGOUT_USER,
    LOADING_STATE_TOGGLER
} from "../types";

let isAuthenticated = false;
let adminDetails = {
    name: "",
    id: "",
    token: "",
    email: "",
    avatar: ""
};

if (localStorage.getItem("adminDetails")) {
    adminDetails = JSON.parse(localStorage.getItem("adminDetails"));
    isAuthenticated = true;
}

const resetState = {
    isAuthenticated: false,
    isAuthLoading: false,
    adminDetails: null
}

const initialState = {
    isAuthenticated: isAuthenticated,
    isAuthLoading: false,
    adminDetails: adminDetails
};

const auth = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_USER:
            state = {
                ...state,
                ...action.payload
            };
            break;
        case LOGOUT_USER:
            state = resetState;
            break;
        case LOADING_STATE_TOGGLER:
            state = {
                ...state,
                ...action.payload
            };
            break;
        default:
            break;
    }

    return state;
};

export default auth;