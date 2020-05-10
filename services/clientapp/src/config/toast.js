import React from "react";
import {
    toast,
    Zoom
} from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "../assets/css/commons.css";
import '../assets/fontawesome/css/all.min.css';
import { detectMobile } from "../actions/playerActions";

export const toastConfig = () => {
    const Close = () => <i className="fas fa-times"></i>;
    return toast.configure({
        autoClose: 1500,
        position: detectMobile() ? "top-right" : "bottom-right",
        className: detectMobile() ? "toast-margin-top" : "toast-margin-bottom",
        bodyClassName: "toast-bg-color",
        toastClassName: "toast-bg-color",
        transition: Zoom,
        progressClassName: "toast-progress-bar-color",
        closeButton: <Close />,
    });
};
