import { Order, PaginationOrders } from "../types/order.interface";
import { Pagination, PaginationWithPhoneNumber } from "@/types/pagination.interface";
import { ApiRoutes } from "@/types/api-routes.enum";

import customAxios from "@/utils/axios";

export const OrdersService = {
	async placeOrder(data: Order): Promise<Order> {
		const { data: response } = await customAxios.post(ApiRoutes.Orders, data);
		return response;
	},

	async getAllWithPagination(queryParams?: Pagination): Promise<PaginationOrders> {
		const { data } = await customAxios({
			url: ApiRoutes.Orders,
			method: "GET",
			params: queryParams,
		});
		return data;
	},

	async getByPhoneNumberPagination(
		queryParams?: PaginationWithPhoneNumber
	): Promise<PaginationOrders> {
		const { data } = await customAxios({
			url: `${ApiRoutes.Orders}/${queryParams?.phoneNumber}`,
			method: "GET",
			params: queryParams,
		});
		return data;
	},
};
