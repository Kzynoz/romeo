import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./app/store.js";

import "./assets/style/scss/index.scss";
import App from "./App.jsx";

// Create a root and render the application
createRoot(document.getElementById("root")).render(
	<StrictMode> {/* Activates additional checks and warnings for React */}
		<Provider store={store}> {/* Makes the Redux store available to the entire app */}
			<BrowserRouter> {/* Enables routing throughout the app */}
				<App />
			</BrowserRouter>
		</Provider>
	</StrictMode>
);
