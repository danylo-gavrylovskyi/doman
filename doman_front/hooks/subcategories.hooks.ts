import { useMutation, useQuery } from "@tanstack/react-query";

import { SubcategoriesService } from "@/services/subcategories.service";

import { queryClient } from "@/components/LayoutProvider";

import {
	ADD_SUBCATEGORY_KEY,
	DELETE_SUBCATEGORY_KEY,
	EDIT_SUBCATEGORY_KEY,
	GET_SUBCATEGORIES_KEY,
	GET_SUBCATEGORIES_WITH_PAGINATION_KEY,
} from "@/types/constants/react-query-keys.constants";
import { Pagination } from "@/types/pagination.interface";

export const useGetSubcategoriesWithPagination = (queryParams?: Pagination) => {
	return useQuery([GET_SUBCATEGORIES_WITH_PAGINATION_KEY, queryParams], () =>
		SubcategoriesService.getAllWithPagination(queryParams)
	);
};

export const useGetSubcategories = () => {
	return useQuery([GET_SUBCATEGORIES_KEY], () => SubcategoriesService.getAll());
};

export const useAddSubcategory = () => {
	const { mutate } = useMutation(
		[ADD_SUBCATEGORY_KEY],
		(formData: FormData) => SubcategoriesService.add(formData),
		{
			onSuccess() {
				queryClient.invalidateQueries({ queryKey: [GET_SUBCATEGORIES_KEY] });
			},
		}
	);
	return mutate;
};

export const useEditSubcategory = () => {
	const { mutate } = useMutation(
		[EDIT_SUBCATEGORY_KEY],
		({ id, formData }: { id: number; formData: FormData }) =>
			SubcategoriesService.edit({ id, formData }),
		{
			onSuccess() {
				queryClient.invalidateQueries({ queryKey: [GET_SUBCATEGORIES_KEY] });
			},
		}
	);
	return mutate;
};

export const useDeleteSubcategory = () => {
	const { mutate } = useMutation(
		[DELETE_SUBCATEGORY_KEY],
		(subcategoryId: number) => SubcategoriesService.delete(subcategoryId),
		{
			onSuccess() {
				queryClient.invalidateQueries({ queryKey: [GET_SUBCATEGORIES_KEY] });
			},
		}
	);
	return mutate;
};
