import {
  TOGGLE_SCRAPPER_DIALOG
} from "../types";

const initialState = {
  isOpened: false,
  songsBucketCallback: null,
};

export const gannaScrapper = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SCRAPPER_DIALOG:
      state = {
        ...state,
        ...action.payload,
        songsBucketCallback: action.payload.songsBucketCallback ? action.payload.songsBucketCallback : null,
      };
      break;
    default:
      break;
  }
  return state;
};