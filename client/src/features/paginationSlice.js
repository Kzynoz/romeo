import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	page: 1,
	totalPages: 1,
};

const paginationSlice = createSlice({
	name: "pagination",
	initialState,
	reducers: {
		setPage(state, action) {
			state.page = action.payload;
		},
		setTotalPages(state, action) {
			state.totalPages = action.payload;
		},
		reset: () => initialState,
	},
});

export const { setPage, setTotalPages, reset } = paginationSlice.actions;
export default paginationSlice.reducer;
