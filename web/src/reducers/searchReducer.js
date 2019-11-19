const initialState = {
    currentActionTitle: "Search",
    suggestionText: "",
    keywordSuggestions: [],
    currentTextIndex: 0,
    actualText: "",
    searchText: "",
    searchResults: [],
    listener: null,
    isSearching: false,
    isTyping: false,
}

const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case "UPDATE_SUGGESTION_TEXT":
            state = {
                ...state,
                ...action.payload
            };
            break;
        case "UPDATE_Actual_TEXT":
            state = {
                ...state,
                ...action.payload
            };
            break;
        case "FETCH_RESULTS":
            state = {
                ...state,
                ...action.payload
            };
            break;
        case "SEARCH_INITIAL_CLEAR":
            state = {
                ...state,
                ...action.payload
            };
            break;
        case "FETCH_KEYWORD_SUGGESTION":
            state = {
                ...state,
                ...action.payload
            };
            break;
        case "EMPTY_KEYWORD_SUGGESTION":
            state = {
                ...state,
                ...action.payload
            };
            break;
        case "UPDATE_TYPING":
            state = {
                ...state,
                ...action.payload
            };
            break;
        case "KEY_UP_HANDLE":
            state = {
                ...state,
                ...action.payload
            };
            break;
        default:
            break;
    }

    return state;

}

export default searchReducer;