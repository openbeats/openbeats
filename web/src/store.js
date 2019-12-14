import { createHashHistory } from "history";
import { combineReducers, applyMiddleware, createStore } from "redux";
import {
	connectRouter,
	routerMiddleware,
	ConnectedRouter,
} from "connected-react-router";
import thunk from "redux-thunk";
// import logger from "redux-logger";
import reducers from "./reducers";
const history = createHashHistory();
const store = createStore(
<<<<<<< HEAD
	combineReducers({
		router: connectRouter(history),
		...reducers,
	}),
	{},
	applyMiddleware(
		routerMiddleware(history),
		thunk,
		// logger,
	),
);
=======
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
>>>>>>> 649c6eeb66333817bc7fba7254fdd44666f994b6

export { store, history, ConnectedRouter };
