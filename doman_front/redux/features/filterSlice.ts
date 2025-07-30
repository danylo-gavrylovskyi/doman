import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { AttributeWithValue, AttributeWithValues } from "@/types/attribute.interface";

const initialState = {
	isOpened: false,
	checkedAttributes: [] as AttributeWithValues[]
};

export const filterSlice = createSlice({
	name: "filter",
	initialState,
	reducers: {
		toggleFilter: (state) => {
			state.isOpened = !state.isOpened;
		},
		toggleAttribute: (state, action: PayloadAction<AttributeWithValue>) => {
			const index = state.checkedAttributes.findIndex(attr => attr.title === action.payload.title);
			if (index === -1) {
				state.checkedAttributes.push({ title: action.payload.title, values: [action.payload.value] });
			} else if (state.checkedAttributes[index].values.includes(action.payload.value)) {
				state.checkedAttributes[index].values = state.checkedAttributes[index].values.filter(value => value !== action.payload.value);
			} else {
				state.checkedAttributes[index].values.push(action.payload.value);
			}
		},
	},
});

export const { toggleFilter, toggleAttribute } = filterSlice.actions;
export default filterSlice.reducer;
