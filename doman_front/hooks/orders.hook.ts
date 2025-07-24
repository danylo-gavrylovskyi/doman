import { useQuery } from "@tanstack/react-query";

import { OrdersService } from "@/services/orders.service";

import {
	GET_ORDERS_BY_PHONE_NUMBER_PAGINATION_KEY,
	GET_ORDERS_WITH_PAGINATION_KEY,
} from "@/types/constants/react-query-keys.constants";
import { Pagination, PaginationWithPhoneNumber } from "@/types/pagination.interface";

export const useGetOrdersWithPagination = (queryParams?: Pagination) => {
	return useQuery([GET_ORDERS_WITH_PAGINATION_KEY, queryParams], () =>
		OrdersService.getAllWithPagination(queryParams)
	);
};

export const useGetOrdersByPhoneNumberPagination = (queryParams?: PaginationWithPhoneNumber) => {
	return useQuery([GET_ORDERS_BY_PHONE_NUMBER_PAGINATION_KEY, queryParams], () =>
		OrdersService.getByPhoneNumberPagination(queryParams)
	);
};
