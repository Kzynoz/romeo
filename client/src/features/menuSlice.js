import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isMenuOpen: false,
	isSubMenuOpen: false,
};

const menuSlice = createSlice({
	name: "menu",
	initialState,
	reducers: {
		toggleMenu(state) {
			state.isMenuOpen = !state.isMenuOpen;
			state.isSubMenuOpen = false;
		},

		toggleSubMenu(state) {
			state.isSubMenuOpen = !state.isSubMenuOpen;
		},
	},
});

export const { toggleMenu, toggleSubMenu } = menuSlice.actions;
export default menuSlice.reducer;
