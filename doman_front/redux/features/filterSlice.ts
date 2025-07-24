import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
	isOpened: false,
	checkedAttributes: [] as string[],
};

export const filterSlice = createSlice({
	name: "filter",
	initialState,
	reducers: {
		toggleFilter: (state) => {
			state.isOpened = !state.isOpened;
		},
		toggleAttribute: (state, action: PayloadAction<string>) => {
			const index = state.checkedAttributes.indexOf(action.payload);
			if (index === -1) {
				state.checkedAttributes.push(action.payload);
			} else {
				state.checkedAttributes.splice(index, 1);
			}
		},
	},
});

export const { toggleFilter, toggleAttribute } = filterSlice.actions;
export default filterSlice.reducer;
