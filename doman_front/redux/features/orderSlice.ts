import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const makeOrder = createAsyncThunk("makingOrder", async () => {});

const initialState = {
	isCategoriesClicked: false,
};

const homeSlice = createSlice({
	name: "home",
	initialState,
	reducers: {},
});

export const {} = homeSlice.actions;
export default homeSlice.reducer;
