import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import * as fs from "fs";
import * as path from "path";

import { Subcategory } from "./subcategory.model";
import { Category } from "src/categories/category.model";
import { ProductAttribute } from "src/product-attribute/product-attribute.model";
import { Attribute } from "src/attributes/attribute.model";

import { CreateSubcategoryDto } from "./dto/createSubcategory.dto";
import { PaginatedEntityRequestDto, PaginatedEntityResponseDto } from "src/shared/paginatedEntity.dto";
import { AttributeWithValuesDto } from "src/shared/attributeWithValues.dto";

import { Product } from "src/products/product.entity";

@Injectable()
export class SubcategoriesService {
	constructor(
		@InjectModel(Subcategory) private subcategoryRepository: typeof Subcategory,
		@InjectModel(Product) private productRepository: typeof Product
	) { }

	private readonly includeCategory = [
		{
			model: Category,
			required: true,
		}
	]

	getAllSubcategories() {
		return this.subcategoryRepository.findAll({
			include: this.includeCategory
		});
	}

	getSubcategoriesWithPagination(
		{ page = "1", perPage = "4", inputValue = "" }: PaginatedEntityRequestDto
	): Promise<PaginatedEntityResponseDto<Subcategory>> {
		return this.subcategoryRepository.findAndCountAll({
			limit: +perPage,
			offset: (+page - 1) * +perPage,
			where: {
				title: {
					[Op.iLike]: `%${inputValue}%`,
				}
			},
			include: this.includeCategory,
		});
	}

	getSubcategoryBySlug(slug: string) {
		return this.subcategoryRepository.findOne({
			where: { slug },
			include: this.includeCategory,
		});
	}

	async getFilterAttributes(subcategoryId: number): Promise<AttributeWithValuesDto[]> {
		const products = await this.productRepository.findAll({
			where: { subcategoryId },
			include: [
				{
					model: ProductAttribute,
					include: [Attribute]
				},
			],
		});

		const attributeMap: Record<string, Set<string>> = {};

		for (const product of products) {
			for (const attribute of product.attributes) {
				if (!attributeMap[attribute.attribute.title]) {
					attributeMap[attribute.attribute.title] = new Set();
				}
				attributeMap[attribute.attribute.title].add(attribute.attributeValue);
			}
		}

		return Object.entries(attributeMap).map(([title, values]) => ({
			title,
			values: Array.from(values)
		}));
	}

	addSubcategory(dto: CreateSubcategoryDto) {
		return this.subcategoryRepository.create(dto);
	}

	async deleteCategory(id: number) {
		const category = await this.subcategoryRepository.findOne({ where: { id } });
		if (!category) {
			throw new NotFoundException("Category not found");
		}
		fs.unlink(
			path.join(__dirname, "..", "..", "..", "uploads", "categoriesImages", category.image),
			(err) => {
				if (err) {
					throw new InternalServerErrorException("Error while deleting image from folder");
				}
			}
		);
		return this.subcategoryRepository.destroy({ where: { id } });
	}

	async editCategory(id: number, dto) {
		const category = await this.subcategoryRepository.findOne({ where: { id } });
		if (!category) {
			throw new NotFoundException("Category not found");
		}
		if (dto.image) {
			fs.unlink(
				path.join(__dirname, "..", "..", "..", "uploads", "categoriesImages", category.image),
				(err) => {
					if (err) {
						throw new InternalServerErrorException("Error while deleting image from folder");
					}
				}
			);
		}
		await this.subcategoryRepository.update(dto, { where: { id } });
		return this.subcategoryRepository.findOne({ where: { id } });
	}
}
