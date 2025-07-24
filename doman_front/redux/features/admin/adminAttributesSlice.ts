import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/utils/axios";
import { Attribute } from "@/types/attribute.interface";

export const fetchAttributes = createAsyncThunk("admin/fetchingAttributes", async () => {
	const { data } = await axios.get("/attributes");
	return data as Attribute[];
});

export const deleteAttribute = createAsyncThunk("admin/deletingAttribute", async (id: number) => {
	const { data } = await axios.delete(`/attributes/${id}`);
	return data as number;
});

export const addAttribute = createAsyncThunk("admin/addingAttribute", async (title: string) => {
	const { data } = await axios.post(`/attributes`, { title });
	return data as Attribute;
});

const initialState = {
	attributes: [] as Attribute[],
};

const adminAttributesSlice = createSlice({
	name: "adminAttributes",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchAttributes.fulfilled, (state, action: PayloadAction<Attribute[]>) => {
			state.attributes = action.payload;
		});
		builder.addCase(deleteAttribute.fulfilled, (state, action: PayloadAction<number>) => {
			state.attributes = state.attributes.filter(
				(attribute: Attribute) => attribute.id !== action.payload
			);
		});
		builder.addCase(addAttribute.fulfilled, (state, action: PayloadAction<Attribute>) => {
			state.attributes = [...state.attributes, action.payload];
		});
	},
});

export default adminAttributesSlice.reducer;
