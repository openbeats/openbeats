import React from "react";
import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "../css/commons.css";

export const variables = {
  // baseUrl: "https://openbeats-s1.herokuapp.com",
  baseUrl: "https://openbeats-s2.herokuapp.com",
  // baseUrl: "http://localhost:2000",
};

export const toastConfig = () => {
  const Close = () => <i className="fas fa-times"></i>;
  return toast.configure({
    autoClose: 3000,
    position: "bottom-right",
    className: "toast-margin-bottom",
    bodyClassName: "toast-bg-color",
    toastClassName: "toast-bg-color",
    transition: Zoom,
    progressClassName: "toast-progress-bar-color",
    closeButton: <Close />,
    // pauseOnFocusLoss: false,
  });
};
