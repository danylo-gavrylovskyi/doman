import { ApiProperty } from "@nestjs/swagger";
import {
	Column,
	DataType,
	Table,
	Model,
	BelongsTo,
	ForeignKey,
	HasMany,
} from "sequelize-typescript";

import { ProductAttribute } from "src/product-attribute/product-attribute.model";
import { Subcategory } from "src/subcategories/subcategory.model";

interface ProductCreationAttr {
	article: string;
	title: string;
	slug: string;
	description: string;
	quantity: number;
	image: string;
	price: number;
	subcategoryId: number;
	isPopular: boolean;
}

@Table({ tableName: "products", indexes: [{ fields: ["subcategoryId"] }] })
export class Product extends Model<Product, ProductCreationAttr> {
	@ApiProperty({ example: 1, description: "Unique identifier" })
	@Column({
		type: DataType.INTEGER,
		autoIncrement: true,
		unique: true,
		primaryKey: true,
	})
	id: number;

	@ApiProperty({ example: "12343afdf232", description: "Product article" })
	@Column({ type: DataType.STRING, unique: true })
	article: string;

	@ApiProperty({ example: "КОТЕЛ ТВЕРДОПАЛИВНИЙ EDELMET 33 КВТ", description: "Product name" })
	@Column({ type: DataType.STRING, unique: true })
	title: string;

	@ApiProperty({ example: "smesitel-dlya-kuhni", description: "Product slug" })
	@Column({ type: DataType.STRING, unique: true })
	slug: string;

	@ApiProperty({
		example: "Радіатори виготовлені з холоднокатної сталі товщиною 1,5 мм",
		description: "Product description",
	})
	@Column({ type: DataType.TEXT, unique: false })
	description: string;

	@ApiProperty({ example: 236, description: "Product quantity" })
	@Column({ type: DataType.INTEGER, unique: false })
	quantity: number;

	@ApiProperty({
		example: "62771c51-3b8b-453a-9aca-2cb439c0b5b6.jpg",
		description: "Product image",
	})
	@Column({ type: DataType.STRING, allowNull: true, unique: true })
	image: string;

	@ApiProperty({ example: 1289, description: "Product price" })
	@Column({ type: DataType.DECIMAL, unique: false })
	price: number;

	@ApiProperty({ example: true, description: "Is this product popular" })
	@Column({ type: DataType.BOOLEAN, unique: false, defaultValue: false })
	isPopular: boolean;

	@ApiProperty({ example: 1, description: "To which subcategory this product belongs to" })
	@ForeignKey(() => Subcategory)
	@Column({ type: DataType.INTEGER, unique: false })
	subcategoryId: number;

	@BelongsTo(() => Subcategory)
	subcategory: Subcategory;

	@HasMany(() => ProductAttribute)
	attributes: ProductAttribute[];
}
