import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";

import { Category } from "./category.model";
import { Subcategory } from "src/subcategories/subcategory.model";
import { Attribute } from "src/attributes/attribute.model";
import { ProductAttribute } from "src/product-attribute/product-attribute.model";

import { CreateCategoryDto } from "./dto/createCategory.dto";
import { EditCategoryDto } from "./dto/editCategory.dto";
import { AttributeWithValuesDto } from "src/shared/attributeWithValues.dto";
import { PaginatedEntityRequestDto, PaginatedEntityResponseDto } from "src/shared/paginatedEntity.dto";

import { Product } from "src/products/product.entity";

import { deleteImage } from "utils/deleteImage";

@Injectable()
export class CategoriesService {
	constructor(
		@InjectModel(Category) private categoryRepository: typeof Category,
		@InjectModel(Subcategory) private subcategoryRepository: typeof Subcategory,
		@InjectModel(Product) private productRepository: typeof Product,
		private readonly logger: Logger
	) { }

	async getAllCategories(): Promise<Category[]> {
		this.logger.debug('Fetching all categories', CategoriesService.name);

		const categories = await this.categoryRepository.findAll({ include: { all: true } });
		this.logger.log('Fetched all categories', CategoriesService.name);

		return categories;
	}

	async getCategoriesWithPagination(
		{
			page = "1",
			perPage = "4",
			inputValue = ""
		}: PaginatedEntityRequestDto
	): Promise<PaginatedEntityResponseDto<Category>> {
		this.logger.debug(
			`Fetching categories with pagination: page=${page}, perPage=${perPage}, filter="${inputValue}"`,
			CategoriesService.name
		);

		const paginatedCategories = await this.categoryRepository.findAndCountAll({
			limit: +perPage,
			offset: (+page - 1) * +perPage,
			where: {
				title: {
					[Op.iLike]: `%${inputValue}%`,
				}
			},
			include: { all: true },
		});

		this.logger.log(
			`Fetched ${paginatedCategories.rows.length} categories (total: ${paginatedCategories.count}) for page=${page}`,
			CategoriesService.name
		);

		return paginatedCategories;
	}

	async getCategoryBySlug(slug: string): Promise<Category> {
		this.logger.debug(`Fetching category by slug="${slug}"`, CategoriesService.name);

		const category = await this.categoryRepository.findOne({
			where: { slug },
			include: { all: true },
		});

		if (!category) {
			this.logger.warn(`Category with slug="${slug}" not found`, CategoriesService.name);
			throw new NotFoundException("Category with such slug not found");
		}

		this.logger.log(`Fetched category with slug="${slug}"`, CategoriesService.name);
		return category;
	}

	async getSubcategories(id: number): Promise<Subcategory[]> {
		this.logger.debug(`Fetching subcategories for categoryId=${id}`, CategoriesService.name);

		const categories = await this.subcategoryRepository.findAll({ where: { categoryId: id } });
		this.logger.log(`Fetched subcategories for categoryId=${id}`, CategoriesService.name);

		return categories;
	}

	async getFilterAttributes(categoryId: number): Promise<AttributeWithValuesDto[]> {
		this.logger.debug(`Fetching filter attributes for categoryId=${categoryId}`, CategoriesService.name);

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

		const attributesWithValues = Object.entries(attributeMap).map(([title, values]) => ({
			title,
			values: Array.from(values)
		}));

		this.logger.log(`Fetched ${attributesWithValues.length} attributes for categoryId=${categoryId}`, CategoriesService.name);
		return attributesWithValues;
	}

	async addCategory(dto: CreateCategoryDto): Promise<Category> {
		this.logger.debug(`Adding new category with title="${dto.title}"`, CategoriesService.name);

		const category = await this.categoryRepository.create(dto);
		this.logger.log(`Created category with title="${category.title}"`, CategoriesService.name);

		return category;
	}

	async editCategory(id: number, dto: EditCategoryDto): Promise<Category> {
		this.logger.debug(`Editing category with id=${id}`, CategoriesService.name);

		const category = await this.categoryRepository.findOne({ where: { id } });
		if (!category) {
			this.logger.warn(`Category with id=${id} not found`, CategoriesService.name);
			throw new NotFoundException("Category with such id not found");
		}

		if (dto.image) {
			deleteImage("categoriesImages", category.image);
		}

		const [_, updatedCategory] = await this.categoryRepository.update(
			dto,
			{ where: { id }, returning: true }
		);
		this.logger.log(`Updated category with id=${id}`, CategoriesService.name);

		return updatedCategory[0];
	}

	async deleteCategory(id: number): Promise<boolean> {
		this.logger.debug(`Deleting category with id=${id}`, CategoriesService.name);

		const category = await this.categoryRepository.findOne({ where: { id } });
		if (!category) {
			this.logger.warn(`Category with id=${id} not found`, CategoriesService.name);
			throw new NotFoundException("Category with such id not found");
		}

		deleteImage("categoriesImages", category.image);
		const deletedCount = await this.categoryRepository.destroy({ where: { id } });

		this.logger.log(`Deleted category with id=${id}`, CategoriesService.name);
		return deletedCount > 0;
	}
}
