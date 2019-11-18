import React from 'react';
import ReactDOM from 'react-dom';
import { toastConfig } from "./config"
import { Provider } from "react-redux";
import { createBrowserHistory } from 'history';
import { combineReducers, applyMiddleware, createStore } from "redux";
import { connectRouter, routerMiddleware, ConnectedRouter } from 'connected-react-router';
import thunk from "redux-thunk";
import logger from "redux-logger";
import reducers from "./reducers";
import App from './App';

toastConfig()

const history = createBrowserHistory();

const store = createStore(
    combineReducers({
        router: connectRouter(history),
        reducers,
    }),
    {},
    applyMiddleware(
        routerMiddleware(history),
        thunk,
        logger,
    )
)


ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);