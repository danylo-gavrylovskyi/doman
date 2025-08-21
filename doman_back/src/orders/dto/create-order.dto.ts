import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from "class-validator";

import { ToJsonArray, ToNumber } from "src/common/transformers";

import { OrderedProduct } from "../types/ordered-product.type";

export class CreateOrderDto {
	@ApiProperty({ example: "John", description: "Customer's first name" })
	@IsString()
	@IsNotEmpty()
	readonly firstName: string;

	@ApiProperty({ example: "Doe", description: "Customer's last name" })
	@IsString()
	@IsNotEmpty()
	readonly lastName: string;

	@ApiProperty({ example: "john.doe@gmail.com", description: "Customer's email" })
	@IsString()
	@IsEmail()
	readonly email: string;

	@ApiProperty({ example: "0630000000", description: "Customer's phone number" })
	@IsString()
	@IsPhoneNumber()
	readonly phoneNumber: string;

	@ApiProperty({ example: 200, description: "Order total price" })
	@ToNumber()
	@IsNumber()
	readonly totalPrice: number;

	@ApiProperty({
		example: '[{"product":1,"quantity": 3}]',
		description: "Products and their quantities in the order"
	})
	@ToJsonArray<OrderedProduct>()
	@IsNotEmpty()
	readonly orderedProducts: OrderedProduct[];
}
