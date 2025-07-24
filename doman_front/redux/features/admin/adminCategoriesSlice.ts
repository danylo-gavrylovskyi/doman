import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/utils/axios";

import { Category } from "@/types/category.interface";

export const fetchCategories = createAsyncThunk("admin/fetchingCategories", async () => {
	const { data } = await axios.get("/categories");
	return data as Category[];
});

export const deleteCategory = createAsyncThunk("admin/deletingCategory", async (id: number) => {
	const { data } = await axios.delete(`/categories/${id}`);
	return data as number;
});

export const addCategory = createAsyncThunk("admin/addingCategory", async (formData: FormData) => {
	const { data } = await axios.post(`/categories`, formData);
	return data as Category;
});

export const editCategory = createAsyncThunk(
	"admin/editingCategory",
	async (editData: { id: number; formData: FormData }) => {
		const { data } = await axios.patch(`/categories/${editData.id}`, editData.formData);
		return data as Category;
	}
);

const initialState = {
	categories: [] as Category[],
};

const adminCategoriesSlice = createSlice({
	name: "adminCategories",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
			state.categories = action.payload;
		});
		builder.addCase(deleteCategory.fulfilled, (state, action: PayloadAction<number>) => {
			state.categories = state.categories.filter((category) => category.id !== action.payload);
		});
		builder.addCase(addCategory.fulfilled, (state, action: PayloadAction<Category>) => {
			state.categories = [...state.categories, action.payload];
		});
		builder.addCase(editCategory.fulfilled, (state, action: PayloadAction<Category>) => {
			const indexOfEditedCategory = state.categories.findIndex(
				(category) => category.id === action.payload.id
			);
			state.categories[indexOfEditedCategory] = action.payload;
		});
	},
});

export default adminCategoriesSlice.reducer;
