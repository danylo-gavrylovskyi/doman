import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { FindOptions, Op, WhereOptions } from "sequelize";

import * as path from "path";
import * as XLSX from "xlsx";

import { Product } from "./product.model";

import { CreateProductServiceDto } from "./dto/createProductService.dto";
import { UpdateProductServiceDto } from "./dto/updateProduct.dto";
import { PaginationDto } from "./dto/pagination.dto";

import { deleteImage } from "utils/deleteImage";
import { Subcategory } from "src/subcategories/subcategory.model";
import { ProductAttribute } from "src/product-attribute/product-attribute.model";

@Injectable()
export class ProductsService {
	constructor(@InjectModel(Product) private productsRepository: typeof Product) { }

	getProductsWithPagination(
		{
			page = "1",
			perPage = "4",
			inputValue = "",
			categoryId,
			subcategoryId,
		}: PaginationDto
	) {
		const whereClause: WhereOptions<Product> = {
			title: {
				[Op.iLike]: `%${inputValue}%`,
			},
		};

		if (subcategoryId) {
			whereClause.subcategoryId = +subcategoryId;
		}

		if (categoryId) {
			whereClause["$subcategory.categoryId$"] = +categoryId;
		}

		return this.productsRepository.findAndCountAll({
			limit: +perPage,
			offset: (+page - 1) * +perPage,
			include: [
				{
					model: Subcategory,
					required: true,
				},
				{
					model: ProductAttribute,
					required: true,
				}
			],
			where: whereClause,
		});
	}

	getAllProducts(findOptions: FindOptions<Product>) {
		return this.productsRepository.findAll({
			include: { all: true },
			...findOptions,
		});
	}

	addProduct(dto: CreateProductServiceDto) {
		return this.productsRepository.create(dto);
	}

	async loadProductsViaExcel(filename: string) {
		const workbook = XLSX.readFile(
			path.join(__dirname, "..", "..", "..", "uploads", "excel", filename)
		);
		const sheetNameList = workbook.SheetNames;
		const xlData: Product[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);

		for (const data of xlData) {
			data.article = String(data.article);

			const [foundProduct, isCreated] = await this.productsRepository.findOrCreate({
				where: { article: data.article },
				defaults: {
					title: data.title,
					price: data.price,
					quantity: data.quantity,
					slug: null,
					image: null,
					subcategoryId: null,
				},
			});

			if (!isCreated) {
				this.updateProduct(foundProduct.id, { price: data.price, quantity: data.quantity });
			}
		}

		return xlData;
	}

	async deleteProduct(id: number) {
		const product = await this.productsRepository.findOne({ where: { id } });
		product.image && deleteImage("productsImages", product.image);
		return this.productsRepository.destroy({ where: { id } });
	}

	async updateProduct(id: number, dto: UpdateProductServiceDto) {
		const product = await this.productsRepository.findOne({ where: { id } });
		if (dto.image) {
			deleteImage("productsImages", product.image);
		}
		await this.productsRepository.update(dto, { where: { id } });
		return this.productsRepository.findOne({ where: { id } });
	}
}
