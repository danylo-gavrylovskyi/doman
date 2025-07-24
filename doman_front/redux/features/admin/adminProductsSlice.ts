import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/utils/axios";

import { Product } from "@/types/product.interface";
import { CreateProductAttribute, ProductAttribute } from "@/types/product-attributes.interface";

export const fetchProducts = createAsyncThunk("admin/fetchingProducts", async () => {
	const { data } = await axios.get("/products");
	return data as Product[];
});

export const deleteProduct = createAsyncThunk("admin/deletingProduct", async (id: number) => {
	const { data } = await axios.delete(`/products/${id}`);
	return data as number;
});

export const addProduct = createAsyncThunk("admin/addingProduct", async (formData: FormData) => {
	const { data } = await axios.post(`/products`, formData);
	return data as Product;
});

export const addProductAttributes = createAsyncThunk(
	"admin/addingProductAttributes",
	async (dto: CreateProductAttribute) => {
		const { data } = await axios.post(`/product-attribute`, dto);
		return data as ProductAttribute;
	}
);

export const editProduct = createAsyncThunk(
	"admin/editingProduct",
	async (editData: { id: number; formData: FormData }) => {
		const { data } = await axios.patch(`/products/${editData.id}`, editData.formData);
		return data as Product;
	}
);

const initialState = {
	products: [] as Product[],
	currentProductId: 0 as number,
};

const adminProductsSlice = createSlice({
	name: "adminCategories",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
			state.products = action.payload;
		});
		builder.addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
			state.products = state.products.filter((product) => product.id !== action.payload);
		});
		builder.addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
			state.currentProductId = action.payload.id;
			state.products = [...state.products, action.payload];
		});
		builder.addCase(editProduct.fulfilled, (state, action: PayloadAction<Product>) => {
			const indexOfEditedCategory = state.products.findIndex(
				(product) => product.id === action.payload.id
			);
			state.products[indexOfEditedCategory] = action.payload;
		});
	},
});

export default adminProductsSlice.reducer;
