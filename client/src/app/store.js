import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/authSlice";
import menuReducer from "../features/menuSlice";
import paginationReducer from "../features/paginationSlice";

const store = configureStore({
	reducer: {
		auth: authReducer,
		menu: menuReducer,
		pagination: paginationReducer,
	},
});

export default store;
