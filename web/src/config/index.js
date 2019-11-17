import React from "react"
import { toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import "../css/commons.css"

export const variables = {
    // "baseUrl": "https://openbeats-s1.herokuapp.com",
    "baseUrl": "https://openbeats-s2.herokuapp.com",
    // "baseUrl": "http://localhost:2000",
}

export const toastConfig = () => {
    // toastify setup
    const Close = () => <i className="fas fa-times"></i>;
    return toast.configure({
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
}