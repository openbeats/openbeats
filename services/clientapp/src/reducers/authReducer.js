const initialState = {
  isAuthenticated: false,
  isAuthLoading: false,
  userDetails: {
    name: "",
    id: "",
    token: "",
    mail: ""
  }
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
      state = {
        ...state,
        ...action.payload
      };
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
