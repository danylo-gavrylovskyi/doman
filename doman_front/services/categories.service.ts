import { Category, PaginationCategory } from "@/types/category.interface";
import { ApiRoutes } from "@/types/api-routes.enum";
import { Pagination } from "@/types/pagination.interface";

import customAxios from "@/utils/axios";

export const CategoriesService = {
	async getAllWithPagination(queryParams?: Pagination): Promise<PaginationCategory> {
		const { data } = await customAxios({
			url: `${ApiRoutes.Categories}/pagination`,
			method: "GET",
			params: queryParams,
		});
		return data;
	},

	async getAll(): Promise<Category[]> {
		const { data } = await customAxios.get(ApiRoutes.Categories);
		return data;
	},

	async add(formData: FormData): Promise<Category> {
		const { data } = await customAxios.post(ApiRoutes.Categories, formData);
		return data;
	},

	async delete(categoryId: number): Promise<number> {
		const { data } = await customAxios.delete(`${ApiRoutes.Categories}/${categoryId}`);
		return data;
	},

	async edit(editData: { id: number; formData: FormData }): Promise<Category> {
		const { data } = await customAxios.patch(
			`${ApiRoutes.Categories}/${editData.id}`,
			editData.formData
		);
		return data;
	},
};
