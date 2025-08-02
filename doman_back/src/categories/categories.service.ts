import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";

import { Category } from "./category.model";
import { Subcategory } from "src/subcategories/subcategory.model";
import { Attribute } from "src/attributes/attribute.model";
import { ProductAttribute } from "src/product-attribute/product-attribute.model";

import { CreateCategoryDto } from "./dto/createCategory.dto";
import { EditCategoryDto } from "./dto/editCategory.dto";
import { AttributeWithValuesDto } from "src/shared/attributeWithValues.dto";
import { PaginatedEntityRequestDto } from "src/shared/paginatedEntity.dto";

import { Product } from "src/products/product.entity";

import { deleteImage } from "utils/deleteImage";

@Injectable()
export class CategoriesService {
	constructor(
		@InjectModel(Category) private categoryRepository: typeof Category,
		@InjectModel(Subcategory) private subcategoryRepository: typeof Subcategory,
		@InjectModel(Product) private productRepository: typeof Product
	) { }

	getAllCategories() {
		return this.categoryRepository.findAll({ include: { all: true } });
	}

	getCategoriesWithPagination({ page = "1", perPage = "4", inputValue = "" }: PaginatedEntityRequestDto) {
		return this.categoryRepository.findAndCountAll({
			limit: +perPage,
			offset: (+page - 1) * +perPage,
			where: {
				title: {
					[Op.iLike]: `%${inputValue}%`,
				}
			},
			include: { all: true },
		});
	}

	async getCategoryBySlug(slug: string): Promise<Category> {
		const category = await this.categoryRepository.findOne({
			where: { slug },
			include: { all: true },
		});

		if (!category) {
			throw new NotFoundException("Category with such slug not found");
		}

		return category;
	}

	getSubcategories(id: number) {
		return this.subcategoryRepository.findAll({ where: { categoryId: id } });
	}

	async getFilterAttributes(categoryId: number): Promise<AttributeWithValuesDto[]> {
		const products = await this.productRepository.findAll({
			where: { "$subcategory.categoryId$": categoryId },
			include: [
				Subcategory,
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

	addCategory(dto: CreateCategoryDto) {
		return this.categoryRepository.create(dto);
	}

	async deleteCategory(id: number) {
		const category = await this.categoryRepository.findOne({ where: { id } });
		if (!category) {
			throw new NotFoundException("Category not found");
		}
		deleteImage("categoriesImages", category.image);
		return this.categoryRepository.destroy({ where: { id } });
	}

	async editCategory(id: number, dto: EditCategoryDto) {
		const category = await this.categoryRepository.findOne({ where: { id } });
		if (!category) {
			throw new NotFoundException("Category not found");
		}
		if (dto.image) {
			deleteImage("categoriesImages", category.image);
		}
		await this.categoryRepository.update(dto, { where: { id } });
		return this.categoryRepository.findOne({ where: { id } });
	}
}
