import { store } from "../store";
import { toastActions } from ".";
import { push } from "connected-react-router";
import { variables } from "../config";

export function loginHandler(email, password) {
  setAuthLoader(true);
  fetch(`${variables.baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  })
    .then(async res => {
      let data = await res.json();
      if (res.status !== 400) {
        let userDetails = {
          name: data.name,
          email: data.email,
          id: data.id,
          token: data.token,
          avatar: data.avatar
        };
        localStorage.setItem("userDetails", JSON.stringify(userDetails));
        store.dispatch({
          type: "LOGIN_USER",
          payload: {
            userDetails,
            isAuthenticated: true
          }
        });
        setAuthLoader(false);
        store.dispatch(push("/"));
      } else {
        let err = data.error;
        toastActions.showMessage(err.toString());
        setAuthLoader(false);
      }
    })
    .catch(err => {
      toastActions.showMessage(
        "Internal server error!\n please try again later or\n  email to support@openbeats.live"
      );
    });
}

export function registerHandler(name, email, password) {
  setAuthLoader(true);
  fetch(`${variables.baseUrl}/auth/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      email,
      password,
      name
    })
  })
    .then(async res => {
      let data = await res.json();
      if (res.status !== 400) {
        let userDetails = {
          name: data.name,
          email: data.email,
          id: data.id,
          token: data.token,
          avatar: data.avatar
        };
        localStorage.setItem("userDetails", JSON.stringify(userDetails));
        store.dispatch({
          type: "LOGIN_USER",
          payload: {
            userDetails,
            isAuthenticated: true
          }
        });
        setAuthLoader(false);
        store.dispatch(push("/"));
      } else {
        let err = data.error;
        toastActions.showMessage(err.toString());
        setAuthLoader(false);
      }
    })
    .catch(err => {
      toastActions.showMessage(
        "Internal server error!\n please try again later or\n  email to support@openbeats.live"
      );
    });
}

function setAuthLoader(val) {
  store.dispatch({
    type: "LOADING_STATE_TOGGLER",
    payload: {
      isAuthLoading: val
    }
  });
}

export function logoutHandler() {
  let userDetails = {
    name: "",
    id: "",
    token: "",
    email: "",
    avatar: ""
  };
  localStorage.removeItem("userDetails");
  store.dispatch({
    type: "LOGOUT_USER",
    payload: {
      userDetails,
      isAuthenticated: false
    }
  });
}
