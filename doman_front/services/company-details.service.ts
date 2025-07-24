import { ApiRoutes } from "@/types/api-routes.enum";

import customAxios from "@/utils/axios";

import { CompanyDetails } from "@/types/company-details.interface";

export const CompanyDetailsService = {
	async getAll(): Promise<CompanyDetails> {
		const { data } = await customAxios.get(`${ApiRoutes.CompanyDetails}`);
		return data;
	},

	async update(companyDetails: CompanyDetails): Promise<CompanyDetails> {
		const { data } = await customAxios.post(`${ApiRoutes.CompanyDetails}`, companyDetails);
		return data;
	},
};
