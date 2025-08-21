import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";

import { OrderProduct } from "./order-product.model";

import { CreateOrderProductDto } from "./dto/create-order-product.dto";

@Injectable()
export class OrderProductService {
	constructor(@InjectModel(OrderProduct) private orderProductRepo: typeof OrderProduct) { }

	createOrderProduct(dto: CreateOrderProductDto, transaction?: Transaction) {
		return this.orderProductRepo.create(dto, { transaction });
	}
}
