import { store } from "../store";
import { toastActions } from ".";
import { push } from "connected-react-router";
import { variables } from "../config";

export function loginHandler(email, password) {
  setAuthLoader(true);
  console.log(email, password);
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
    .then(data => data.json())
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log(err);
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
        // set user state authenticated
      } else {
        let err = data.errors;
        console.log(err);

        toastActions.showMessage(err);
      }
    })
    .catch(err => {
      toastActions.showMessage(err);
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
