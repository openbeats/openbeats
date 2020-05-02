import {
    store
} from "../store";
import {
    variables
} from "../config";

export function updateSuggestionText(text) {
    return {
        type: "UPDATE_SUGGESTION_TEXT",
        payload: {
            suggestionText: text
        }
    }
}

export function updateActualText(text) {
    return {
        type: "UPDATE_Actual_TEXT",
        payload: {
            suggestionText: text,
            actualText: text,
            currentTextIndex: 0
        }
    }
}

export async function fetchResults() {
    let state = store.getState().searchReducer;
    await store.dispatch({
        type: "SEARCH_INITIAL_CLEAR",
        payload: {
            keywordSuggestions: [],
            isSearching: true
        }
    });

    const url = `${variables.baseUrl}/ytcat?q=${state.suggestionText.replace(/[^\w\s-]/gi, '')}&advanced=true`;
    await fetch(url)
        .then(res => res.json())
        .then(async res => {
            if (res.status) {
                await store.dispatch({
                    type: "FETCH_RESULTS",
                    payload: {
                        songs: res.data.songs,
                        albums: res.data.albums,
                        artists: res.data.artists,
                        isSearching: false,
                        keywordSuggestions: []
                    }
                })
            }
        })
        .catch(err => console.error(err));

    return true;
}

export async function getKeywordSuggestion(key) {
    let state = store.getState().searchReducer;
    await store.dispatch({
        type: "SEARCH_INITIAL_CLEAR",
        payload: {
            suggestionText: key,
            actualText: key,
            currentTextIndex: 0
        }
    });
    const url = `${variables.baseUrl}/suggester?k=${key}`;
    await fetch(url)
        .then(res => res.json())
        .then(async res => {
            let temp = res.data.slice(0, 10);
            let listener = document.addEventListener("click", async function () {
                if (state.listener != null) {
                    document.removeEventListener(state.listenter);
                }
                await store.dispatch({
                    type: "FETCH_KEYWORD_SUGGESTION",
                    payload: {
                        keywordSuggestions: [],
                        listener: null
                    }
                });
            });
            await store.dispatch({
                type: "FETCH_KEYWORD_SUGGESTION",
                payload: {
                    keywordSuggestions: temp,
                    listener: listener
                }
            });
        })
        .catch(e => console.error(e))

    return true;
}

export function emptyKeywordSuggestion() {
    return {
        type: "EMPTY_KEYWORD_SUGGESTION",
        payload: {
            keywordSuggestions: []
        }
    }

}

export function updateTyping(isTyping) {
    return {
        type: "UPDATE_TYPING",
        payload: {
            isTyping
        }
    }

}

export function onKeyUpHandler(e) {
    let state = store.getState().searchReducer;
    let payload = {}
    if (e.keyCode === 40 && state.keywordSuggestions.length) {
        let current = (state.currentTextIndex + 1) <= state.keywordSuggestions.length ? (state.currentTextIndex + 1) : 0;
        if (current !== 0)
            payload = {
                currentTextIndex: current,
                suggestionText: state.keywordSuggestions[current - 1][0]
            };
        else
            payload = {
                currentTextIndex: current,
                suggestionText: state.actualText
            };
    } else if (e.keyCode === 38 && state.keywordSuggestions.length) {
        let current = (state.currentTextIndex - 1) >= 0 ? (state.currentTextIndex - 1) : state.keywordSuggestions.length;
        if (current !== 0)
            payload = {
                currentTextIndex: current,
                suggestionText: state.keywordSuggestions[current - 1][0]
            };
        else
            payload = {
                currentTextIndex: current,
                suggestionText: state.actualText
            };
    }

    return {
        type: "KEY_UP_HANDLE",
        payload
    }

}