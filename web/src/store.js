import { createHashHistory } from 'history';
import { combineReducers, applyMiddleware, createStore } from "redux";
import { connectRouter, routerMiddleware, ConnectedRouter } from 'connected-react-router';
import thunk from "redux-thunk";
// import logger from "redux-logger";
import reducers from "./reducers";
const history = createHashHistory();
const store = createStore(
    combineReducers({
        router: connectRouter(history),
        ...reducers
    }),
    {},
    applyMiddleware(
        routerMiddleware(history),
        thunk,
        // logger,
    )
)

export { store, history, ConnectedRouter }