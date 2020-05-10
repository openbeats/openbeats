import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// redux imports
import { Provider } from "react-redux";
import { history, store, ConnectedRouter } from "./store";

// bootstrap import
import "./assets/fontawesome/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

// toastify import
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

toast.configure();

ReactDOM.render(
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<App />
		</ConnectedRouter>
	</Provider>,
	document.getElementById("root")
);
