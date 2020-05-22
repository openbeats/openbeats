import {
	createBrowserHistory
} from "history";
import {
	combineReducers,
	applyMiddleware,
	createStore
} from "redux";
import {
	connectRouter,
	routerMiddleware,
	ConnectedRouter,
} from "connected-react-router";
import thunk from "redux-thunk";
// import logger from "redux-logger";
import {
	composeWithDevTools
} from "redux-devtools-extension";
import reducers from "./reducers";
import GoogleAnalytics from 'react-ga';
import {
	deploymentType
} from "./config";


// Google analytics integration
const trackingId = deploymentType === "production" ? "UA-166283761-1" : "UA-166283761-2";
GoogleAnalytics.initialize(trackingId);
const googleAnalyticsTrackingMiddleware = store => next => action => {
	if (action.type === '@@router/LOCATION_CHANGE') {
		const nextPage = `${action.payload.location.pathname}${action.payload.location.search}`;
		trackPage(nextPage);
	}
	return next(action);
};

const trackPage = page => {
	GoogleAnalytics.pageview(page);
};


const history = createBrowserHistory();
const store = createStore(
	combineReducers({
		router: connectRouter(history),
		...reducers,
	}), {},
	composeWithDevTools(applyMiddleware(
		googleAnalyticsTrackingMiddleware,
		routerMiddleware(history),
		thunk,
		// logger,
	)),
);

export {
	store,
	history,
	ConnectedRouter
};