import { useMutation, useQuery } from "@tanstack/react-query";

import { ProductsService } from "@/services/products.service";

import { queryClient } from "@/components/LayoutProvider";

import {
	ADD_PRODUCT_KEY,
	DELETE_PRODUCT_KEY,
	EDIT_PRODUCT_KEY,
	GET_PRODUCTS_KEY,
	GET_PRODUCTS_WITH_PAGINATION_KEY,
	USE_EXCEL_TABLE,
} from "@/types/constants/react-query-keys.constants";
import { Pagination } from "@/types/pagination.interface";
import { FindOptions } from "@/types/findOptions.interface";

export const useGetProductsWithPagination = (queryParams?: Pagination) => {
	return useQuery([GET_PRODUCTS_WITH_PAGINATION_KEY, queryParams], () =>
		ProductsService.getAllWithPagination(queryParams)
	);
};

export const useGetProducts = (queryParams?: FindOptions) => {
	return useQuery([GET_PRODUCTS_KEY, queryParams], () => ProductsService.getAll(queryParams));
};

export const useAddProduct = () => {
	const { mutate } = useMutation(
		[ADD_PRODUCT_KEY],
		(productData: FormData) => ProductsService.add(productData),
		{
			onSuccess() {
				queryClient.invalidateQueries({ queryKey: [GET_PRODUCTS_KEY] });
			},
		}
	);
	return mutate;
};

export const useExcelTable = () => {
	const { mutate } = useMutation(
		[USE_EXCEL_TABLE],
		(excelTable: FormData) => ProductsService.useExcelTable(excelTable),
		{
			onSuccess() {
				queryClient.invalidateQueries({ queryKey: [GET_PRODUCTS_KEY] });
			},
		}
	);
	return mutate;
};

export const useEditProduct = () => {
	const { mutate } = useMutation(
		[EDIT_PRODUCT_KEY],
		({ productId, formData }: { productId: number; formData: FormData }) =>
			ProductsService.edit(productId, formData),
		{
			onSuccess() {
				queryClient.invalidateQueries({ queryKey: [GET_PRODUCTS_KEY] });
			},
		}
	);
	return mutate;
};

export const useDeleteProduct = () => {
	const { mutate } = useMutation(
		[DELETE_PRODUCT_KEY],
		(productId: number) => ProductsService.delete(productId),
		{
			onSuccess() {
				queryClient.invalidateQueries({ queryKey: [GET_PRODUCTS_KEY] });
			},
		}
	);
	return mutate;
};
