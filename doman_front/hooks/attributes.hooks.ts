import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@/components/LayoutProvider";

import { AttributesService } from "@/services/attributes.service";

import { Attribute } from "@/types/attribute.interface";
import { Pagination } from "@/types/pagination.interface";
import {
	ADD_ATTRIBUTE_KEY,
	DELETE_ATTRIBUTE_KEY,
	GET_ATTRIBUTES_KEY,
	GET_ATTRIBUTES_WITH_PAGINATION_KEY,
} from "@/types/constants/react-query-keys.constants";

export const useGetAttributesWithPagination = (queryParams?: Pagination) => {
	return useQuery([GET_ATTRIBUTES_WITH_PAGINATION_KEY, queryParams], () =>
		AttributesService.getAllWithPagination(queryParams)
	);
};

export const useGetAttributes = () => {
	return useQuery<Attribute[]>([GET_ATTRIBUTES_KEY], () => AttributesService.getAll());
};

export const useAddAttribute = () => {
	return useMutation([ADD_ATTRIBUTE_KEY], (title: string) => AttributesService.add(title), {
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: [GET_ATTRIBUTES_KEY] });
		},
	});
};

export const useDeleteAttribute = () => {
	return useMutation(
		[DELETE_ATTRIBUTE_KEY],
		(attributeId: number) => AttributesService.delete(attributeId),
		{
			onSuccess() {
				queryClient.invalidateQueries({ queryKey: [GET_ATTRIBUTES_KEY] });
			},
		}
	);
};
