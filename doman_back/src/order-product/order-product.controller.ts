import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { OrderProductService } from "./order-product.service";

import { OrderProduct } from "./order-product.model";

import { CreateOrderProductDto } from "./createOrder-product.dto";

@ApiTags("Order-product")
@Controller("order-product")
export class OrderProductController {
	constructor(private readonly orderProductService: OrderProductService) { }

	@ApiOperation({ description: "Creating order-product" })
	@ApiResponse({ type: OrderProduct })
	@Post()
	async create(@Body() dto: CreateOrderProductDto) {
		const orderProduct = await this.orderProductService.createOrderProduct(dto);
		return orderProduct;
	}
}
