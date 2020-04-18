import {
  UPDATE_LIKED_PLAYLISTS_METADATA
} from "../types";

let isAuthenticated = false;
let userDetails = {
  name: "",
  id: "",
  token: "",
  email: "",
  avatar: "",
};
let likedPlaylists = [];

if (localStorage.getItem("userDetails")) {
  userDetails = JSON.parse(localStorage.getItem("userDetails"));
  isAuthenticated = true;
  likedPlaylists = [];
}

const resetState = {
  isAuthenticated: false,
  isAuthLoading: false,
  userDetails: null,
  likedPlaylists: []
}

const initialState = {
  isAuthenticated: isAuthenticated,
  isAuthLoading: false,
  userDetails: userDetails,
  likedPlaylists: likedPlaylists
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_USER":
      state = {
        ...state,
        ...action.payload
      };
      break;
    case "LOGOUT_USER":
      state = resetState;
      break;
    case "LOADING_STATE_TOGGLER":
      state = {
        ...state,
        ...action.payload
      };
      break;
    case UPDATE_LIKED_PLAYLISTS_METADATA:
      state = {
        ...state,
        likedPlaylists: action.payload
      };
      break;
    default:
      break;
  }

  return state;
};

export default authReducer;