import { ApiRoutes } from "@/types/api-routes.enum";
import { Attribute, PaginationAttribute } from "@/types/attribute.interface";
import { Pagination } from "@/types/pagination.interface";

import customAxios from "@/utils/axios";

export const AttributesService = {
	async getAllWithPagination(queryParams?: Pagination): Promise<PaginationAttribute> {
		const { data } = await customAxios({
			url: `${ApiRoutes.Attributes}/pagination`,
			method: "GET",
			params: queryParams,
		});
		return data;
	},

	async getAll(): Promise<Attribute[]> {
		const { data } = await customAxios.get(ApiRoutes.Attributes);
		return data;
	},

	async add(title: string): Promise<Attribute> {
		const { data } = await customAxios.post(ApiRoutes.Attributes, { title });
		return data;
	},

	async delete(id: number): Promise<number> {
		const { data } = await customAxios.delete(`${ApiRoutes.Attributes}/${id}`);
		return data;
	},
};
