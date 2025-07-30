import { ApiRoutes } from "@/types/api-routes.enum";
import { FindOptions } from "@/types/findOptions.interface";
import { Pagination } from "@/types/pagination.interface";
import { PaginationProducts, Product } from "@/types/product.interface";

import customAxios from "@/utils/axios";

export const ProductsService = {
	async getAllWithPagination(queryParams?: Pagination): Promise<PaginationProducts> {
		const searchParams = new URLSearchParams();
		if (queryParams?.page) searchParams.append('page', queryParams.page);
		if (queryParams?.perPage) searchParams.append('perPage', queryParams.perPage);
		if (queryParams?.inputValue) searchParams.append('inputValue', queryParams.inputValue);
		if (queryParams?.categoryId) searchParams.append('categoryId', queryParams.categoryId.toString());
		if (queryParams?.subcategoryId) searchParams.append('subcategoryId', queryParams.subcategoryId.toString());

		if (queryParams?.filterParams) {
			for (const attribute of queryParams.filterParams) {
				searchParams.append(attribute.title, attribute.values.join(','));
			}
		}

		const { data } = await customAxios({
			url: ApiRoutes.Products,
			method: "GET",
			params: searchParams,
		});
		return data;
	},

	async getAll(queryParams?: FindOptions): Promise<Product[]> {
		const { data } = await customAxios({
			url: `${ApiRoutes.Products}/admin`,
			method: "GET",
			params: queryParams,
		});
		return data;
	},

	async getById(productId: number): Promise<Product> {
		const { data } = await customAxios.get(`${ApiRoutes.Products}/${productId}`);
		return data;
	},

	async getBySlug(productSlug: string): Promise<Product> {
		const { data } = await customAxios.get(`${ApiRoutes.Products}/slug/${productSlug}`);
		return data;
	},

	async add(productData: FormData): Promise<Product> {
		const { data } = await customAxios.post(ApiRoutes.Products, productData);
		return data;
	},

	async useExcelTable(excelTable: FormData): Promise<Product[]> {
		const { data } = await customAxios.post(`${ApiRoutes.Products}/excel`, excelTable);
		return data;
	},

	async delete(productId: number): Promise<number> {
		const { data } = await customAxios.delete(`${ApiRoutes.Products}/${productId}`);
		return data;
	},

	async edit(productId: number, formData: FormData): Promise<Product> {
		const { data } = await customAxios.patch(`${ApiRoutes.Products}/${productId}`, formData);
		return data;
	},
};
