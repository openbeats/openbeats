import { store } from "../store";
import { toastActions } from ".";
import { push } from "connected-react-router";

export function loginHandler(email, password) {
  setAuthLoader(true);
  let loginSuccess = false;
  if (loginSuccess) {
    console.log(email, password);
    setAuthLoader(false);
    store.dispatch(push("/"));
  } else {
    toastActions.showMessage("Invalid username or password!");
    setAuthLoader(false);
  }
}

export function registerHandler(userName, email, password) {
  setAuthLoader(true);
  let registerSuccess = true;
  let payload = {
    name: "",
    id: "",
    token: "",
    mail: ""
  };
  if (registerSuccess) {
    console.log(userName, email, password);
    store.dispatch({
      type: "LOGIN_USER",
      payload
    });
    setAuthLoader(false);
    store.dispatch(push("/"));
  } else {
    toastActions.showMessage("something went wrong try again later!");
    setAuthLoader(false);
  }
}

function setAuthLoader(val) {
  store.dispatch({
    type: "LOADING_STATE_TOGGLER",
    payload: {
      isAuthLoading: val
    }
  });
}
