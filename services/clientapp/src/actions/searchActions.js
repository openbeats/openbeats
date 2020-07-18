import {
    store
} from "../store";
import {
    variables
} from "../config";
import axios from "axios";
import {
    toastActions
} from ".";

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
    let suggestionString = state.suggestionText.length > 0 ? state.suggestionText.replace(/[^\w\s-]/gi, '') : '';
    const url = `${variables.baseUrl}/ytcat?advanced=true&q=${suggestionString}`;
    try {
        const res = await getSearchResultSafely(url);
        if (res.status) {
            await store.dispatch({
                type: "FETCH_RESULTS",
                payload: {
                    songs: res.data.songs ? res.data.songs : [],
                    albums: res.data.albums ? res.data.albums : [],
                    artists: res.data.artists ? res.data.artists : [],
                    languages: res.data.languages ? res.data.languages : [],
                    emotions: res.data.emotions ? res.data.emotions : [],
                    isSearching: false,
                    keywordSuggestions: []
                }
            })
        } else {
            throw new Error(res.data);
        }
    } catch (error) {
        // toastActions.showMessage(error.message.toString());
        console.error(error.message);
        await store.dispatch({
            type: "FETCH_RESULTS",
            payload: {
                songs: [],
                albums: [],
                artists: [],
                languages: [],
                emotions: [],
                isSearching: false,
                keywordSuggestions: []
            }
        })
    }

    return true;
}

export async function getSearchResultSafely(url) {
    let fetchCount = 3;
    while (fetchCount > 0) {
        const {
            data
        } = await axios.get(url);
        const res = data;
        if (res.status && res.data.songs.length) {
            return res;
        }
        fetchCount--;
    }
    return {
        status: false,
        link: null
    };
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
    try {
        const {
            data
        } = await axios.get(url);
        const res = data;
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
    } catch (error) {
        // toastActions.showMessage(error.message.toString());
        console.error(error.message);
    }

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