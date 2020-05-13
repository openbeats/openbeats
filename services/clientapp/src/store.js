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
import reducers from "./reducers";
import GoogleAnalytics from 'react-ga';


// Google analytics integration
GoogleAnalytics.initialize('UA-166283761-1');
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
	applyMiddleware(
		googleAnalyticsTrackingMiddleware,
		routerMiddleware(history),
		thunk,
		// logger,
	),
);

export {
	store,
	history,
	ConnectedRouter
};