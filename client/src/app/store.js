import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/authSlice";
import menuReducer from "../features/menuSlice";

// Create the Redux store with auth and menu slices
const store = configureStore({
	reducer: {
		auth: authReducer, // for authentification
		menu: menuReducer, // for navigation and modal
	},
});

export default store;
