import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Query,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { OrdersService } from "./orders.service";

import { Order } from "./order.model";

import { CreateOrderDto } from "./createOrder.dto";
import { PaginatedEntityRequestDto, PaginatedEntityResponseDto } from "src/common/paginatedEntity.dto";

@ApiTags("Orders")
@Controller("orders")
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) { }

	@ApiOperation({ description: "Creating order" })
	@ApiResponse({ type: Order })
	@Post()
	async create(@Body() dto: CreateOrderDto) {
		const order = await this.ordersService.createOrder(dto);
		return order;
	}

	@ApiOperation({ description: "Getting all orders with pagination" })
	@ApiResponse({ type: PaginatedEntityResponseDto<Order> })
	@Get()
	async getAllWithPagination(@Query() queryParams: PaginatedEntityRequestDto) {
		const orders = await this.ordersService.getOrdersWithPagination(queryParams);
		return orders;
	}

	@ApiOperation({ description: "Getting orders by phone number with pagination" })
	@ApiResponse({ type: PaginatedEntityResponseDto<Order> })
	@Get("/:phoneNumber")
	async getByPhoneNumberPagination(
		@Query() queryParams: PaginatedEntityRequestDto,
		@Param("phoneNumber") phoneNumber: string
	) {
		const orders = await this.ordersService.getOrdersByPhoneNumberPagination({
			...queryParams,
			phoneNumber,
		});
		return orders;
	}
}
