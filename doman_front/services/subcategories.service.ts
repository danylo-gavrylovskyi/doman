import { ApiRoutes } from "@/types/api-routes.enum";
import { PaginationSubcategory, Subcategory } from "@/types/category.interface";
import { Pagination } from "@/types/pagination.interface";

import customAxios from "@/utils/axios";

export const SubcategoriesService = {
	async getAllWithPagination(queryParams?: Pagination): Promise<PaginationSubcategory> {
		const { data } = await customAxios({
			url: `${ApiRoutes.Subcategories}/pagination`,
			method: "GET",
			params: queryParams,
		});
		return data;
	},

	async getAll(): Promise<Subcategory[]> {
		const { data } = await customAxios.get(ApiRoutes.Subcategories);
		return data;
	},

	async add(formData: FormData): Promise<Subcategory> {
		const { data } = await customAxios.post(ApiRoutes.Subcategories, formData);
		return data;
	},

	async delete(categoryId: number): Promise<number> {
		const { data } = await customAxios.delete(`${ApiRoutes.Subcategories}/${categoryId}`);
		return data;
	},

	async edit(editData: { id: number; formData: FormData }): Promise<Subcategory> {
		const { data } = await customAxios.patch(
			`${ApiRoutes.Subcategories}/${editData.id}`,
			editData.formData
		);
		return data;
	},
};
