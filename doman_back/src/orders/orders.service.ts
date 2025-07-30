import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import * as nodemailer from "nodemailer";

import { OrderProductService } from "src/order-product/order-product.service";

import { Order } from "./order.model";
import { OrderProduct } from "src/order-product/order-product.model";

import { CreateOrderDto } from "./createOrder.dto";
import { GetByPhoneNumberPaginationDto } from "./getByPhoneNumberPagination.dto";
import { PaginatedEntityRequestDto } from "src/shared/paginatedEntity.dto";

import { Product } from "src/products/product.entity";

@Injectable()
export class OrdersService {
	constructor(
		@InjectModel(Order) private ordersRepository: typeof Order,
		private orderProductService: OrderProductService
	) { }

	async createOrder(dto: CreateOrderDto) {
		const { orderedProducts } = dto;

		const order: Order = await this.ordersRepository.create(dto);

		orderedProducts.forEach(async (obj) => {
			await this.orderProductService.createOrderProduct({
				orderId: order.id,
				productId: obj.product.id,
				quantity: obj.quantity,
			});
		});

		this.notifyAdmin(order);

		return order;
	}

	async getOrdersWithPagination({ page = "1", perPage = "10" }: PaginatedEntityRequestDto) {
		return this.ordersRepository.findAndCountAll({
			limit: +perPage,
			offset: (+page - 1) * +perPage,
			include: [
				{
					model: OrderProduct, // Include the OrderProduct model
					include: [
						{
							model: Product, // Include the associated Product model
						},
					],
				},
			],
		});
	}

	getOrdersByPhoneNumberPagination({
		page = "1",
		perPage = "10",
		phoneNumber,
	}: GetByPhoneNumberPaginationDto) {
		return this.ordersRepository.findAndCountAll({
			limit: +perPage,
			offset: (+page - 1) * +perPage,
			where: { phoneNumber },
			include: [
				{
					model: OrderProduct, // Include the OrderProduct model
					include: [
						{
							model: Product, // Include the associated Product model
						},
					],
				},
			],
		});
	}

	private async notifyAdmin(order: Order) {
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
		});

		const mailOptions = {
			from: process.env.FROM,
			to: process.env.TO,
			subject: `New Order #${order.id} Placed`,
			text: `An order with ID #${order.id} has been placed. Please check the admin panel for details.`,
		};

		try {
			await transporter.sendMail(mailOptions);
		} catch (error) {
			throw new InternalServerErrorException("Failed to send notification email");
		}
	}
}
