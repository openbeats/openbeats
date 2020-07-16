const initialState = {
    title: "OpenBeats",
    description: "Unlimited Music for Free!",
    thumbnail: "https://openbeats.nyc3.digitaloceanspaces.com/fallback/logoicon.png"
};

const helmetReducer = (state = initialState, action) => {
    switch (action.type) {
        case "UPDATE_HELMET":
            state = {
                ...state,
                ...action.payload
            };
            break;
        case "RESET_HELMET":
            state = initialState;
            break;
        default:
            break;
    }

    return state;
};

export default helmetReducer;