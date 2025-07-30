import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";

import { CategoriesService } from "@/services/categories.service";

import { queryClient } from "@/components/LayoutProvider";

import {
	ADD_CATEGORY_KEY,
	DELETE_CATEGORY_KEY,
	EDIT_CATEGORY_KEY,
	GET_CATEGORIES_KEY,
	GET_CATEGORIES_WITH_PAGINATION_KEY,
	GET_CATEGORY_FILTER_ATTRIBUTES_KEY,
} from "@/types/constants/react-query-keys.constants";
import { Pagination } from "@/types/pagination.interface";
import { AttributeWithValues } from "@/types/attribute.interface";

export const useGetCategoriesWithPagination = (queryParams?: Pagination) => {
	return useQuery([GET_CATEGORIES_WITH_PAGINATION_KEY, queryParams], () =>
		CategoriesService.getAllWithPagination(queryParams)
	);
};

export const useGetCategories = () => {
	return useQuery([GET_CATEGORIES_KEY], () => CategoriesService.getAll());
};

export const useGetCategoryBySlug = (slug: string) => {
	return useQuery([GET_CATEGORIES_KEY, slug], () => CategoriesService.getBySlug(slug));
};

export const useGetCategoryFilterAttributes = (categoryId?: number, options?: UseQueryOptions<AttributeWithValues[], unknown, AttributeWithValues[], [string, typeof categoryId]>) => {
	return useQuery(
		[GET_CATEGORY_FILTER_ATTRIBUTES_KEY, categoryId],
		() => CategoriesService.getFilterAttributes(categoryId!),
		{ enabled: !!categoryId, ...options }
	);
}

export const useAddCategory = () => {
	return useMutation([ADD_CATEGORY_KEY], (formData: FormData) => CategoriesService.add(formData), {
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: [GET_CATEGORIES_KEY] });
		},
	});
};

export const useEditCategory = () => {
	return useMutation(
		[EDIT_CATEGORY_KEY],
		({ id, formData }: { id: number; formData: FormData }) =>
			CategoriesService.edit({ id, formData }),
		{
			onSuccess() {
				queryClient.invalidateQueries({ queryKey: [GET_CATEGORIES_KEY] });
			},
		}
	);
};

export const useDeleteCategory = () => {
	return useMutation(
		[DELETE_CATEGORY_KEY],
		(categoryId: number) => CategoriesService.delete(categoryId),
		{
			onSuccess() {
				queryClient.invalidateQueries({ queryKey: [GET_CATEGORIES_KEY] });
			},
		}
	);
};
