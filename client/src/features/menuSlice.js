import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isMenuOpen: false,
	isSubMenuOpen: false,
	isModalOpen: false,
	isEditingOpen: false,
};

const menuSlice = createSlice({
	name: "menu",
	initialState,
	reducers: {
		toggleMenu(state, action) {
			state.isMenuOpen = action.payload ?? !state.isMenuOpen;
			state.isSubMenuOpen = false;
			state.isModalOpen = false;
		},

		toggleSubMenu(state) {
			state.isSubMenuOpen = !state.isSubMenuOpen;
			state.isModalOpen = false;
		},
		toggleModal(state, action) {
			state.isModalOpen = action.payload;
			state.isMenuOpen = false;
			state.isSubMenuOpen = false;
		},
		toggleEditing(state, action) {
			state.isEditingOpen = action.payload;
		},
		reset: () => initialState,
	},
});

export const { toggleMenu, toggleSubMenu, toggleModal, toggleEditing, reset } =
	menuSlice.actions;
export default menuSlice.reducer;
