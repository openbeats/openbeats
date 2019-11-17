import React from 'react';
import ReactDOM from 'react-dom';
import { toast, Zoom } from 'react-toastify';
import { Provider } from "react-redux";
import store from "./store";
import App from './App';


// toastify setup
import 'react-toastify/dist/ReactToastify.min.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import "./css/commons.css"
const Close = () => <i className="fas fa-times"></i>;
toast.configure({
    autoClose: 2000,
    position: "bottom-right",
    className: "margin-bottom",
    bodyClassName: "color-change",
    toastClassName: "color-change",
    transition: Zoom,
    progressClassName: "progress-class-toast",
    closeButton: <Close />,
    pauseOnFocusLoss: false,
});


ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);