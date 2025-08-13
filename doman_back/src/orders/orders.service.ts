import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import * as nodemailer from "nodemailer";

import { OrderProductService } from "src/order-product/order-product.service";

import { Order } from "./order.model";
import { OrderProduct } from "src/order-product/order-product.model";

import { CreateOrderDto } from "./createOrder.dto";
import { GetByPhoneNumberPaginationDto } from "./getByPhoneNumberPagination.dto";
import { PaginatedEntityRequestDto, PaginatedEntityResponseDto } from "src/shared/paginatedEntity.dto";

import { Product } from "src/products/product.entity";

@Injectable()
export class OrdersService {
	constructor(
		@InjectModel(Order) private ordersRepository: typeof Order,
		private orderProductService: OrderProductService,
		private readonly logger: Logger
	) { }

	async createOrder(dto: CreateOrderDto): Promise<Order> {
		this.logger.debug(
			`Creating new order for phone="${dto.phoneNumber}" and email="${dto.email}"`,
			OrdersService.name
		);

		const transaction = await this.ordersRepository.sequelize.transaction();

		try {
			const order: Order = await this.ordersRepository.create(dto, { transaction });

			this.logger.log(
				`Order with id="${order.id}" created. Adding ${dto.orderedProducts.length} products`,
				OrdersService.name
			);

			await Promise.all(
				dto.orderedProducts.map(op =>
					this.orderProductService.createOrderProduct({
						orderId: order.id,
						productId: op.product.id,
						quantity: op.quantity,
					}, transaction)
				)
			);
			this.logger.debug(`Added ${dto.orderedProducts.length} products to order with id="${order.id}"`, OrdersService.name);

			await transaction.commit();

			this.logger.debug(`Notifying admin about new order with id="${order.id}"`, OrdersService.name);
			await this.notifyAdmin(order);

			this.logger.log(`Order with id="${order.id}" fully processed`, OrdersService.name);
			return order;
		} catch (error) {
			await transaction.rollback();

			this.logger.error(
				`Failed to create order for phone="${dto.phoneNumber}" and email="${dto.email}"`,
				error.stack,
				OrdersService.name
			);

			throw new InternalServerErrorException("Error while creating order")
		}
	}

	async getOrdersWithPagination(
		{ page = "1", perPage = "10" }: PaginatedEntityRequestDto
	): Promise<PaginatedEntityResponseDto<Order>> {
		this.logger.debug(
			`Fetching orders with pagination: page=${page}, perPage=${perPage}"`,
			OrdersService.name
		);

		const paginatedOrders = await this.ordersRepository.findAndCountAll({
			limit: +perPage,
			offset: (+page - 1) * +perPage,
			order: [
				["createdAt", "DESC"]
			],
			include: [
				{
					model: OrderProduct,
					include: [
						{
							model: Product,
						},
					],
				},
			],
		});

		this.logger.log(
			`Fetched ${paginatedOrders.rows.length} orders (total: ${paginatedOrders.count}) for page=${page}`,
			OrdersService.name
		);

		return paginatedOrders;
	}

	async getOrdersByPhoneNumberPagination({
		page = "1",
		perPage = "10",
		phoneNumber,
	}: GetByPhoneNumberPaginationDto
	): Promise<PaginatedEntityResponseDto<Order>> {
		this.logger.debug(
			`Fetching orders by phoneNumber="${phoneNumber}" with pagination: page=${page}, perPage=${perPage}"`,
			OrdersService.name
		);

		const paginatedOrders = await this.ordersRepository.findAndCountAll({
			limit: +perPage,
			offset: (+page - 1) * +perPage,
			where: { phoneNumber },
			include: [
				{
					model: OrderProduct,
					include: [
						{
							model: Product,
						},
					],
				},
			],
		});

		this.logger.log(
			`Fetched ${paginatedOrders.rows.length} orders (total: ${paginatedOrders.count}) by phoneNumber="${phoneNumber}" for page=${page}`,
			OrdersService.name
		);

		return paginatedOrders;
	}

	private async notifyAdmin(order: Order): Promise<void> {
		this.logger.debug(`Sending admin notification for order with id="${order.id}"`, OrdersService.name);

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
			text: `An order with ID #${order.id} has been placed.Please check the admin panel for details.`,
		};

		try {
			await transporter.sendMail(mailOptions);
			this.logger.log(`Admin notified about order with id="${order.id}"`, OrdersService.name);
		} catch (error) {
			this.logger.error(
				`Failed to send notification email for order with id="${order.id}"`,
				error.stack,
				OrdersService.name
			);
		}
	}
}
