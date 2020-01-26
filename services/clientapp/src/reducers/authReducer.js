let isAuthenticated = false;
let userDetails = {
  name: "",
  id: "",
  token: "",
  email: "",
  avatar: ""
};

if (localStorage.getItem("userDetails")) {
  userDetails = JSON.parse(localStorage.getItem("userDetails"));
  isAuthenticated = true;
}

const initialState = {
  isAuthenticated: isAuthenticated,
  isAuthLoading: false,
  userDetails: userDetails
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
      state = initialState
      break;
    case "LOADING_STATE_TOGGLER":
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

export default authReducer;