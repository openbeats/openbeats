import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from "redux-logger";

// reducers import section
import { } from "./reducers"

export default createStore(
    combineReducers({

    }),
    {},
    applyMiddleware(logger())
)