import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { FindOptions, Op, QueryTypes, Transaction, WhereOptions } from "sequelize";
import * as path from "path";
import * as XLSX from "xlsx";

import { ProductAttributeService } from "src/product-attribute/product-attribute.service";

import { Subcategory } from "src/subcategories/subcategory.model";
import { ProductAttribute } from "src/product-attribute/product-attribute.model";
import { Attribute } from "src/attributes/attribute.model";

import { ProductCreateDto } from "./dataTransferObjects/productCreate.dto";
import { ProductUpdateDto } from "./dataTransferObjects/productUpdate.dto";
import { FilteredProductsRequestDto } from "./dataTransferObjects/filteredProductsRequest.dto";
import { FilteredProductsResponseDto } from "./dataTransferObjects/filteredProductsResponse.dto";

import { Product } from "./product.entity";

import { AttributeIdValuePair } from "types/attribute-value-pair.interface";
import { ImagesService } from "src/images/images.service";

@Injectable()
export class ProductsService {
	constructor(
		@InjectModel(Product) private productsRepository: typeof Product,
		private productAttributeService: ProductAttributeService,
		private readonly logger: Logger,
		private readonly imagesService: ImagesService
	) { }

	async getProductsWithPagination(
		{
			page = "1",
			perPage = "4",
			inputValue = "",
			categoryId,
			subcategoryId,
			...filterParams
		}: FilteredProductsRequestDto
	): Promise<FilteredProductsResponseDto> {
		this.logger.debug(`Fetching products with pagination: page=${page}, perPage=${perPage}, filter="${inputValue}"`, ProductsService.name);

		const whereClause: WhereOptions<Product> = {
			title: {
				[Op.iLike]: `%${inputValue}%`,
			},
		};
		if (subcategoryId) whereClause.subcategoryId = +subcategoryId;
		if (categoryId) whereClause["$subcategory.categoryId$"] = +categoryId;

		const attributeFilterParams: Record<string, string[]> = {};
		for (const [key, value] of Object.entries(filterParams)) {
			if (value) {
				attributeFilterParams[key] = String(value).split(",");
			}
		}

		let productIds: number[] | null = null;
		if (Object.keys(attributeFilterParams).length > 0) {
			productIds = await this.getFilteredProductIds(attributeFilterParams);
			if (productIds.length === 0) {
				this.logger.log(`No products found for filterParams="${filterParams}"`, ProductsService.name)
				return { rows: [], count: 0 };
			}
			whereClause.id = { [Op.in]: productIds };
		}

		const paginatedProducts = await this.productsRepository.findAndCountAll({
			limit: +perPage,
			offset: (+page - 1) * +perPage,
			where: whereClause,
			include: [
				{ model: Subcategory, required: true },
				{ model: ProductAttribute, required: true }
			],
		});

		this.logger.log(
			`Fetched ${paginatedProducts.rows.length} products (total: ${paginatedProducts.count}) for page=${page}`,
			ProductsService.name
		);

		return paginatedProducts;
	}

	async getAllProducts(findOptions: FindOptions<Product>): Promise<Product[]> {
		this.logger.debug('Fetching all products', ProductsService.name);

		const products = await this.productsRepository.findAll({
			include: { all: true },
			...findOptions,
		});
		this.logger.log('Fetched all products', ProductsService.name)

		return products;
	}

	async getById(id: number): Promise<Product> {
		this.logger.debug(`Fetching product by id="${id}"`, ProductsService.name);

		const product = await this.productsRepository.findOne({
			where: { id },
			include: [
				Subcategory,
				{
					model: ProductAttribute,
					include: [Attribute]
				}
			]
		})

		if (!product) {
			this.logger.warn(`Product with id=${id} not found`, ProductsService.name);
			throw new NotFoundException("Product with such id not found");
		}

		this.logger.log(`Fetched product with id=${id}`, ProductsService.name);
		return product;
	}

	async getBySlug(slug: string): Promise<Product> {
		this.logger.debug(`Fetching product by slug="${slug}"`, ProductsService.name);

		const product = await this.productsRepository.findOne({
			where: { slug },
			include: [
				Subcategory,
				{
					model: ProductAttribute,
					include: [Attribute]
				}
			]
		});

		if (!product) {
			this.logger.warn(`Product with slug=${slug} not found`, ProductsService.name);
			throw new NotFoundException("Product with such slug not found");
		}

		this.logger.log(`Fetched product with slug=${slug}`, ProductsService.name);
		return product;
	}

	async addProduct(dto: ProductCreateDto): Promise<Product> {
		this.logger.debug(
			`Adding new product with
			title="${dto.title}",
			article="${dto.article}",
			quantity="${dto.quantity}",
			price="${dto.price}",
			attributeValues="${dto.attributeValues}"`,
			ProductsService.name
		);

		return await this.productsRepository.sequelize.transaction(async (transaction) => {
			const product = await this.productsRepository.create(dto, { transaction });

			await Promise.all(dto.attributeValues.map((value) =>
				this.productAttributeService.addProductAttribute({
					productId: product.id,
					attributeId: value[0],
					attributeValue: value[1],
				},
					transaction
				)
			));

			this.logger.log(
				`Created product with
				title="${product.title}",
				article="${product.article}",
				quantity="${product.quantity}",
				price="${product.price}"`,
				ProductsService.name
			)

			return product;
		})
	}

	async loadProductsViaExcel(filename: string): Promise<Product[]> {
		this.logger.debug(`Loading products from excel file: ${filename}`, ProductsService.name);

		const workbook = XLSX.readFile(path.join(__dirname, "..", "..", "..", "uploads", "excel", filename));
		const sheetNameList = workbook.SheetNames;
		const xlData: Product[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);

		const transaction = await this.productsRepository.sequelize.transaction();

		try {
			for (const data of xlData) {
				data.article = String(data.article);

				const [foundProduct, isCreated] = await this.productsRepository.findOrCreate({
					where: { article: data.article },
					defaults: {
						title: data.title,
						price: data.price,
						quantity: data.quantity,
						description: null,
						slug: null,
						image: null,
						subcategoryId: null,
					},
					transaction
				});

				if (!isCreated) {
					await this.updateProduct(foundProduct.id, { price: data.price, quantity: data.quantity }, transaction);
				}
			}

			transaction.commit();
			this.logger.log(`Successfully loaded ${xlData.length} products from ${filename}`, ProductsService.name);
			return xlData;
		} catch (error) {
			await transaction.rollback();
			this.logger.error(`Failed to load products from ${filename}: ${error.message}`, error.stack, ProductsService.name);
			throw new InternalServerErrorException("Error while loading products from excel file");
		}
	}

	async updateProduct(id: number, dto: ProductUpdateDto, transaction?: Transaction): Promise<void> {
		this.logger.debug(`Updating product with id=${id}`, ProductsService.name);

		const selfManagedTransaction = !transaction;
		transaction = transaction || await this.productsRepository.sequelize.transaction();

		const foundProduct = await this.productsRepository.findOne({ where: { id }, transaction });
		if (!foundProduct) {
			this.logger.warn(`Product with id=${id} not found`, ProductsService.name);
			throw new NotFoundException("Product with such id not found");
		}

		const { newAttributeValues, oldAttributeValues } = dto;
		try {
			if (Object.keys(dto).length !== 0) {
				await this.productsRepository.update(dto, { where: { id }, transaction });
			}

			if (oldAttributeValues) {
				await Promise.all(
					oldAttributeValues.map((value: AttributeIdValuePair) =>
						this.productAttributeService.updateProductAttribute(id, value[0], value[1], transaction)
					)
				);
			}

			if (newAttributeValues) {
				await Promise.all(
					newAttributeValues.map((value: AttributeIdValuePair) =>
						this.productAttributeService.addProductAttribute(
							{
								productId: id,
								attributeId: value[0],
								attributeValue: value[1],
							},
							transaction
						)
					)
				);
			}

			dto.image && await this.imagesService.deleteImage("productsImages", foundProduct.image);
			selfManagedTransaction && await transaction.commit();
			this.logger.log(`Updated product id=${id}`, ProductsService.name);
		} catch (error) {
			selfManagedTransaction && await transaction.rollback();
			this.logger.error(`Failed to update product id=${id}: ${error.message}`, error.stack, ProductsService.name);
			throw new InternalServerErrorException("Error while updating product");
		}
	}

	async deleteProduct(id: number): Promise<boolean> {
		this.logger.debug(`Deleting product with id=${id}`, ProductsService.name);

		const product = await this.productsRepository.findOne({ where: { id } });
		if (!product) {
			this.logger.warn(`Product with id=${id} not found`, ProductsService.name);
			throw new NotFoundException("Product not found");
		}

		const deletedCount = await this.productsRepository.destroy({ where: { id } });
		product.image && await this.imagesService.deleteImage("productsImages", product.image);

		this.logger.log(`Deleted product with id=${id}`, ProductsService.name);
		return deletedCount > 0;
	}

	private async getFilteredProductIds(filterParams: Record<string, string[]>): Promise<number[]> {
		this.logger.debug(`Filtering product IDs by attributes`, ProductsService.name);

		const filters = Object.entries(filterParams);
		if (filters.length === 0) return [];

		const conditions: string[] = [];
		const replacements: Record<string, string | number> = {};
		let paramIndex = 0;

		for (const [title, values] of filters) {
			const titleKey = `title${paramIndex}`;
			replacements[titleKey] = title;

			const valueKeys: string[] = [];
			for (let i = 0; i < values.length; i++) {
				const valKey = `val${paramIndex}_${i}`;
				valueKeys.push(`:${valKey}`);
				replacements[valKey] = values[i];
			}

			const condition = `(a.title = :${titleKey} AND pa."attributeValue" IN (${valueKeys.join(", ")}))`;
			conditions.push(condition);
			paramIndex++;
		}

		const havingCount = filters.length;

		const sql = `
		SELECT pa."productId"
		FROM "product-attributes" pa
		JOIN "attributes" a ON pa."attributeId" = a.id
		WHERE ${conditions.join(" OR ")}
		GROUP BY pa."productId"
		HAVING COUNT(DISTINCT a.title) = :havingCount
		`;

		replacements["havingCount"] = havingCount;

		const result = await this.productsRepository.sequelize.query(sql, {
			type: QueryTypes.SELECT,
			replacements
		});
		this.logger.log(`Found ${result.length} matching products`, ProductsService.name);

		return result.map((row: { productId: number }) => row.productId);
	}
}
