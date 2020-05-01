import { TOGGLE_ADD_ARTIST_DIALOG } from "../types";

const initialState = {
	isOpened: false,
	isEdit: false,
	artistId: null,
	artistName: "",
	artistImageUrl: null,
	addArtistCallBack: null,
};

export const addArtist = (state = initialState, action) => {
	switch (action.type) {
		case TOGGLE_ADD_ARTIST_DIALOG:
			state = {
				...state,
				isOpened: action.payload.isOpened,
				isEdit: action.payload.isEdit,
				artistId: action.payload.artistId,
				artistName: action.payload.artistName,
				artistImageUrl: action.payload.artistImageUrl,
				addArtistCallBack: action.payload.addArtistCallBack,
			};
			break;
		default:
			break;
	}
	return state;
};
