import {
  store
} from "../store";
import {
  TOGGLE_SCRAPPER_DIALOG
} from "../types";

export const toggleScrapperDialog = (payload) => {
  store.dispatch({
    type: TOGGLE_SCRAPPER_DIALOG,
    payload: {
      ...payload
    },
  });
};