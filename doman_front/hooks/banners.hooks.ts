import { queryClient } from "@/components/LayoutProvider";
import { BannersService } from "@/services/banners.service";
import {
	ADD_BANNER_KEY,
	DELETE_BANNER_KEY,
	GET_BANNERS_KEY,
	GET_BANNERS_WITH_PAGINATION_KEY,
} from "@/types/constants/react-query-keys.constants";
import { Pagination } from "@/types/pagination.interface";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetBanners = () => {
	return useQuery([GET_BANNERS_KEY], () => BannersService.getAll());
};

export const useGetBannersWithPagination = (queryParams?: Pagination) => {
	return useQuery([GET_BANNERS_WITH_PAGINATION_KEY, queryParams], () =>
		BannersService.getAllWithPagination(queryParams)
	);
};

export const useAddBanner = () => {
	return useMutation([ADD_BANNER_KEY], (banner: File) => BannersService.add(banner), {
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: [GET_BANNERS_KEY] });
		},
	});
};

export const useDeleteBanner = () => {
	return useMutation([DELETE_BANNER_KEY], (banner: string) => BannersService.delete(banner), {
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: [GET_BANNERS_KEY] });
		},
	});
};
