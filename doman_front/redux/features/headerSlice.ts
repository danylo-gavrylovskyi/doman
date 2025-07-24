import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isSearchOpened: false,
	isHamburgerMenuOpened: false,
};

export const headerSlice = createSlice({
	name: "header",
	initialState,
	reducers: {
		setIsSearchOpened: (state) => {
			state.isSearchOpened = !state.isSearchOpened;
		},
		toggleHamburgerMenu: (state) => {
			state.isHamburgerMenuOpened = !state.isHamburgerMenuOpened;
		},
	},
});

export const { setIsSearchOpened, toggleHamburgerMenu } = headerSlice.actions;
export default headerSlice.reducer;
