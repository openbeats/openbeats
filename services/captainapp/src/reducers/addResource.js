import {
	TOGGLE_CREATION_DIALOG
} from "../types";

const initialState = {
	isOpened: false,
	isEdit: false,
	resourceType: null,
	resourceId: null,
	resourceName: "",
	resourceImageUrl: "",
	resourceCreateCallBack: null,
};

export const addResource = (state = initialState, action) => {
	switch (action.type) {
		case TOGGLE_CREATION_DIALOG:
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