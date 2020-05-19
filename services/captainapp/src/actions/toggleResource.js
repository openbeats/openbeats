import {
  store
} from "../store";
import {
  TOGGLE_CREATION_DIALOG
} from "../types";

export const toggleResorceDialog = (payload) => {

  let promiseResolve;

  const promise = new Promise((resolve, reject) => {
    promiseResolve = resolve;
  });

  const callBack = data => {
    promiseResolve(data);
  };

  store.dispatch({
    type: TOGGLE_CREATION_DIALOG,
    payload: {
      ...payload,
      resourceCreateCallBack: callBack,
    },
  });

  return promise;
};