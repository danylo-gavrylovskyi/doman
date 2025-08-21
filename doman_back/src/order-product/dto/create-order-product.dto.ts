import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { ToNumber } from "src/common/transformers";

export class CreateOrderProductDto {
	@ApiProperty({ example: 1, description: "Order id" })
	@ToNumber()
	@IsNumber()
	readonly orderId: number;

	@ApiProperty({ example: 1, description: "Product id" })
	@ToNumber()
	@IsNumber()
	readonly productId: number;

	@ApiProperty({ example: 20, description: "Product quantity in order" })
	@ToNumber()
	@IsNumber()
	readonly quantity: number;
}
