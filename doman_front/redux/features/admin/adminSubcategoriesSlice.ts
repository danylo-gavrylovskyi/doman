import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/utils/axios";

import { Category, Subcategory } from "@/types/category.interface";

export const fetchSubcategories = createAsyncThunk("admin/fetchingSubcategories", async () => {
	const { data } = await axios.get("/subcategories");
	return data as Subcategory[];
});

export const deleteSubcategory = createAsyncThunk(
	"admin/deletingSubcategory",
	async (id: number) => {
		const { data } = await axios.delete(`/subcategories/${id}`);
		return data as number;
	}
);

export const addSubcategory = createAsyncThunk(
	"admin/addingSubcategory",
	async (formData: FormData) => {
		const { data } = await axios.post(`/subcategories`, formData);
		return data as Subcategory;
	}
);

export const editSubcategory = createAsyncThunk(
	"admin/editingSubcategory",
	async (editData: { id: number; formData: FormData }) => {
		const { data } = await axios.patch(`/subcategories/${editData.id}`, editData.formData);
		return data as Subcategory;
	}
);

const initialState = {
	subcategories: [] as Subcategory[],
};

const adminCategoriesSlice = createSlice({
	name: "adminCategories",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(
			fetchSubcategories.fulfilled,
			(state, action: PayloadAction<Subcategory[]>) => {
				state.subcategories = action.payload;
			}
		);
		builder.addCase(deleteSubcategory.fulfilled, (state, action: PayloadAction<number>) => {
			state.subcategories = state.subcategories.filter(
				(subcategory) => subcategory.id !== action.payload
			);
		});
		builder.addCase(addSubcategory.fulfilled, (state, action: PayloadAction<Subcategory>) => {
			state.subcategories = [...state.subcategories, action.payload];
		});
		builder.addCase(editSubcategory.fulfilled, (state, action: PayloadAction<Subcategory>) => {
			const indexOfEditedCategory = state.subcategories.findIndex(
				(subcategory) => subcategory.id === action.payload.id
			);
			state.subcategories[indexOfEditedCategory] = action.payload;
		});
	},
});

export default adminCategoriesSlice.reducer;
