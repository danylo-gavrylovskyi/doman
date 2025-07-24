import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@/components/LayoutProvider";
import { CompanyDetailsService } from "@/services/company-details.service";

import { CompanyDetails } from "@/types/company-details.interface";
import {
	GET_COMPANY_DETAILS_KEY,
	UPDATE_COMPANY_DETAILS_KEY,
} from "@/types/constants/react-query-keys.constants";

export const useGetCompanyDetails = () => {
	return useQuery([GET_COMPANY_DETAILS_KEY], () => CompanyDetailsService.getAll());
};

export const useUpdateCompanyDetails = () => {
	const { mutate } = useMutation(
		[UPDATE_COMPANY_DETAILS_KEY],
		(companyDetails: CompanyDetails) => CompanyDetailsService.update(companyDetails),
		{
			onSuccess() {
				queryClient.invalidateQueries({ queryKey: [GET_COMPANY_DETAILS_KEY] });
			},
		}
	);
	return mutate;
};
