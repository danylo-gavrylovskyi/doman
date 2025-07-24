import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isCategoriesClicked: false,
};

const homeSlice = createSlice({
	name: "home",
	initialState,
	reducers: {
		setIsCategClicked: (state) => {
			state.isCategoriesClicked = !state.isCategoriesClicked;
		},
	},
});

export const { setIsCategClicked } = homeSlice.actions;
export default homeSlice.reducer;
