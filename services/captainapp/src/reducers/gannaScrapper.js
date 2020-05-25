import {
  TOGGLE_SCRAPPER_DIALOG
} from "../types";

const initialState = {
  isOpened: false,
  songsBucketCallback: null,
  setFetchedArtistCallback: null
};

export const gannaScrapper = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SCRAPPER_DIALOG:
      state = {
        ...state,
        ...action.payload,
        songsBucketCallback: action.payload.songsBucketCallback ? action.payload.songsBucketCallback : null,
        setFetchedArtistCallback: action.payload.setFetchedArtistCallback ? action.payload.setFetchedArtistCallback : null,
      };
      break;
    default:
      break;
  }
  return state;
};