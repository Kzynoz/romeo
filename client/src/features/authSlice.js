import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isLogged: false,
	isAdmin: false,
	infos: {
		alias: "",
		id: "",
	},
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login(state, action) {
			console.log(action);
			state.isLogged = true;
			state.infos.alias = action.payload.alias;
			state.isAdmin = action.payload.is_admin;
			state.infos.id = action.payload.id;
		},
		logout() {
			console.log("User logged out");
			return initialState;
		},
	},
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
