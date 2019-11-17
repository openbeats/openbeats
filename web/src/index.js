import React from 'react';
import ReactDOM from 'react-dom';
import { toastConfig } from "./config"
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createBrowserHistory as createHistory } from 'history';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { combineReducers, applyMiddleware, createStore } from "redux"
import thunk from "redux-thunk"
import logger from "redux-logger";
import reducers from "./reducers"
import App from './App';
// import { push } from 'react-router-redux';

toastConfig()

const history = createHistory();


const store = createStore(
    combineReducers({
        reducers,
        routing: routerReducer
    }),
    applyMiddleware(
        thunk,
        logger,
        routerMiddleware(history)
    )
)


ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
);