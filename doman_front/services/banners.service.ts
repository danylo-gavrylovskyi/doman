import { ApiRoutes } from "@/types/api-routes.enum";
import { PaginationBanner } from "@/types/banner.interface";
import { Pagination } from "@/types/pagination.interface";

import customAxios from "@/utils/axios";

export const BannersService = {
	async getAllWithPagination(queryParams?: Pagination): Promise<PaginationBanner> {
		const { data } = await customAxios({
			url: `${ApiRoutes.Banners}/pagination`,
			method: "GET",
			params: queryParams,
		});
		return data;
	},

	async getAll(): Promise<string[]> {
		const { data } = await customAxios.get(ApiRoutes.Banners);
		return data;
	},

	async add(banner: File): Promise<string> {
		const formData: FormData = new FormData();
		formData.append("banner", banner);
		const { data } = await customAxios.post(ApiRoutes.Banners, formData);
		return data;
	},

	async delete(bannerUrl: string): Promise<string> {
		const { data } = await customAxios.delete(`${ApiRoutes.Banners}/${bannerUrl}`);
		return data;
	},
};
