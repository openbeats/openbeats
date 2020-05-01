import { createBrowserHistory } from "history";
import { combineReducers, applyMiddleware, createStore } from "redux";
import { connectRouter, routerMiddleware, ConnectedRouter } from "connected-react-router";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import logger from "redux-logger";
import * as reducers from "./reducers";
import { isDev } from "./config";

const history = createBrowserHistory();
let middleWares = [];
if (isDev) middleWares = [routerMiddleware(history), thunk];
else middleWares = [routerMiddleware(history), thunk];

const initialState = {};

const store = createStore(
	combineReducers({
		router: connectRouter(history),
		...reducers,
	}),
	initialState,
	composeWithDevTools(applyMiddleware(...middleWares))
);

export { store, history, ConnectedRouter };
