import {
  store
} from "../store";
import {
  toastActions,
  playerActions
} from ".";
import {
  push
} from "connected-react-router";
import {
  variables
} from "../config";
import Axios from "axios";

export function loginHandler(email, password) {
  setAuthLoader(true);
  fetch(`${variables.baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        email,
        password
      })
    })
    .then(async res => {
      let resData = await res.json();
      const {
        status,
        data
      } = resData;
      if (status !== false) {
        let userDetails = {
          name: data.name,
          email: data.email,
          id: data.id,
          token: data.token,
          avatar: data.avatar,
          likedPlaylists: data.likedPlaylists
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
        toastActions.showMessage(data.toString());
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
      let resData = await res.json();
      const {
        status,
        data
      } = resData;

      if (status !== false) {
        let userDetails = {
          name: data.name,
          email: data.email,
          id: data.id,
          token: data.token,
          avatar: data.avatar,
          likedPlaylists: data.likedPlaylists,
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
        toastActions.showMessage(data.toString());
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

export async function resetPassword(password, token) {
  try {
    const {
      data
    } = await Axios.post(`${variables.baseUrl}/auth/resetpassword`, {
      password,
      reset_password_token: token
    })
    if (data && data.status) {
      toastActions.showMessage(data.data.toString());
      return true;
      // store.dispatch(push("/auth"));
    } else {
      toastActions.showMessage(data.data.toString());
      store.dispatch(push("/auth"))
      return false
    }
  } catch (error) {
    console.error(error)
    toastActions.showMessage(error.message.toString())
    return false
  }
}

export async function resetEmailHandler(email) {
  try {
    const {
      data
    } = await Axios.post(`${variables.baseUrl}/auth/forgotpassword`, {
      email
    })
    if (data && data.status) {
      toastActions.showMessage(data.data.toString());
      return true;
    } else {
      toastActions.showMessage(data.data.toString());
      return false;
    }
  } catch (error) {
    console.error(error)
    toastActions.showMessage(error.message.toString())
    return false;
  }
}

export async function logoutHandler() {
  localStorage.removeItem("userDetails");
  await playerActions.resetPlayer();
  await store.dispatch({
    type: "LOGOUT_USER",
    payload: {
      isAuthenticated: false
    }
  });
  await store.dispatch({
    type: "RESET_CORE",
    payload: {
      reset: true
    }
  })
  await store.dispatch({
    type: "RESET_NOW_PLAYING",
    payload: {
      reset: true
    }
  })
  await store.dispatch({
    type: "RESET_PLAYER",
    payload: {
      reset: true
    }
  })
  await store.dispatch({
    type: "RESET_PLAYLIST_MANIPULATOR",
    payload: {
      reset: true
    }
  })
  await store.dispatch({
    type: "RESET_SEARCH",
    payload: {
      reset: true
    }
  })
  window.location.replace('/');
}

export async function validateResetToken(token) {
  try {
    const {
      data
    } = await Axios.post(`${variables.baseUrl}/auth/validateresettoken`, {
      reset_password_token: token
    })
    if (data && data.status) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error)
    return false;
  }

}