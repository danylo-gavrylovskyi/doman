import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
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
import { EditSubcategoryDto } from "./dto/editSubcategory.dto";

import { Product } from "src/products/product.entity";

import { deleteImage } from "utils/deleteImage";

@Injectable()
export class SubcategoriesService {
	constructor(
		@InjectModel(Subcategory) private subcategoryRepository: typeof Subcategory,
		@InjectModel(Product) private productRepository: typeof Product,
		private readonly logger: Logger
	) { }

	private readonly includeCategory = [
		{
			model: Category,
			required: true,
		}
	]

	async getAllSubcategories(): Promise<Subcategory[]> {
		this.logger.debug('Fetching all subcategories', SubcategoriesService.name);

		const subcategories = await this.subcategoryRepository.findAll({
			include: this.includeCategory
		});
		this.logger.log('Fetched all subcategories', SubcategoriesService.name);

		return subcategories;
	}

	async getSubcategoriesWithPagination(
		{ page = "1", perPage = "4", inputValue = "" }: PaginatedEntityRequestDto
	): Promise<PaginatedEntityResponseDto<Subcategory>> {
		this.logger.debug(
			`Fetching subcategories with pagination: page=${page}, perPage=${perPage}, filter="${inputValue}"`,
			SubcategoriesService.name
		);

		const paginatedSubcategories = await this.subcategoryRepository.findAndCountAll({
			limit: +perPage,
			offset: (+page - 1) * +perPage,
			where: {
				title: {
					[Op.iLike]: `%${inputValue}%`,
				}
			},
			include: this.includeCategory,
		});

		this.logger.log(
			`Fetched ${paginatedSubcategories.rows.length} subcategories (total: ${paginatedSubcategories.count}) for page=${page}`,
			SubcategoriesService.name
		);

		return paginatedSubcategories;
	}

	async getSubcategoryBySlug(slug: string): Promise<Subcategory> {
		this.logger.debug(`Fetching subcategory by slug="${slug}"`, SubcategoriesService.name);

		const subcategory = await this.subcategoryRepository.findOne({
			where: { slug },
			include: this.includeCategory,
		});

		if (!subcategory) {
			this.logger.warn(`Subcategory with slug="${slug}" not found`, SubcategoriesService.name);
			throw new NotFoundException("Subcategory with such slug not found");
		}

		this.logger.log(`Fetched subcategory with slug="${slug}"`, SubcategoriesService.name);
		return subcategory;
	}

	async getFilterAttributes(subcategoryId: number): Promise<AttributeWithValuesDto[]> {
		this.logger.debug(`Fetching filter attributes for subcategoryId=${subcategoryId}`, SubcategoriesService.name);

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

		const attributesWithValues = Object.entries(attributeMap).map(([title, values]) => ({
			title,
			values: Array.from(values)
		}));

		this.logger.log(`Fetched ${attributesWithValues.length} attributes for subcategoryId=${subcategoryId}`, SubcategoriesService.name);
		return attributesWithValues;
	}

	async addSubcategory(dto: CreateSubcategoryDto): Promise<Subcategory> {
		this.logger.debug(`Adding new subcategory with title="${dto.title}" and parentId="${dto.categoryId}"`, SubcategoriesService.name);

		const subcategory = await this.subcategoryRepository.create(dto);
		this.logger.log(`Created subcategory with title="${subcategory.title}" and parentId="${dto.categoryId}"`, SubcategoriesService.name);

		return subcategory;
	}

	async editSubcategory(id: number, dto: EditSubcategoryDto): Promise<Subcategory> {
		this.logger.debug(`Editing subcategory with id=${id}`, SubcategoriesService.name);

		const subcategory = await this.subcategoryRepository.findOne({ where: { id } });
		if (!subcategory) {
			this.logger.warn(`Subcategory with id=${id} not found`, SubcategoriesService.name);
			throw new NotFoundException("Subcategory with such id not found");
		}

		if (dto.image) {
			deleteImage("subcategoriesImages", subcategory.image);
		}

		const [_, updatedSubcategory] = await this.subcategoryRepository.update(
			dto,
			{ where: { id }, returning: true }
		);
		this.logger.log(`Updated subcategory with id=${id}`, SubcategoriesService.name);

		return updatedSubcategory[0];
	}

	async deleteSubcategory(id: number): Promise<boolean> {
		this.logger.debug(`Deleting subcategory with id=${id}`, SubcategoriesService.name);

		const subcategory = await this.subcategoryRepository.findOne({ where: { id } });
		if (!subcategory) {
			this.logger.warn(`Subcategory with id=${id} not found`, SubcategoriesService.name);
			throw new NotFoundException("Subcategory with such id not found");
		}

		deleteImage("subcategoriesImages", subcategory.image);
		const deletedCount = await this.subcategoryRepository.destroy({ where: { id } });

		this.logger.log(`Deleted subcategory with id=${id}`, SubcategoriesService.name);
		return deletedCount > 0;
	}
}
