import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

toast.configure()

toast.configure({
    autoClose: 3000,
    position: "bottom-center"
});

ReactDOM.render(<App />, document.getElementById('root'));