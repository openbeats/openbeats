const toastReducer = (state = {
    message: "Your Message Here!"
}, action) => {
    switch (action.type) {
        case "NOTIFY_TOAST":
            state = {
                message: action.payload
            }
            break;
        default:
            break;
    }

    return state;
}

export default toastReducer;