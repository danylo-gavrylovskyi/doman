import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
	activeCategoryIndex:
		typeof window !== "undefined" ? Number(sessionStorage.getItem("activeTab")) : 0,
	banners: [] as string[],
	currentBanner: 0,
};

const adminGeneralSlice = createSlice({
	name: "adminGeneral",
	initialState,
	reducers: {
		setActiveCategory: (state, action: PayloadAction<number>) => {
			state.activeCategoryIndex = action.payload;
			sessionStorage.setItem("activeTab", String(action.payload));
		},
		nextBanner: (state, action: PayloadAction<number>) => {
			if (state.currentBanner === action.payload - 1) {
				state.currentBanner = 0;
			} else {
				state.currentBanner++;
			}
		},
		previousBanner: (state) => {
			if (state.currentBanner === 0) {
				state.currentBanner = state.banners.length - 1;
			} else {
				state.currentBanner--;
			}
		},
		setCurrentBanner: (state, action: PayloadAction<number>) => {
			state.currentBanner = action.payload;
		},
	},
});

export const { setActiveCategory, nextBanner, previousBanner, setCurrentBanner } =
	adminGeneralSlice.actions;
export default adminGeneralSlice.reducer;
