import {
	Body,
	Controller,
	Get,
	Post,
	UploadedFile,
	UseInterceptors,
	Delete,
	Param,
	Patch,
	Query,
	HttpCode,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { FindOptions } from "sequelize";

import { ProductsService } from "./products.service";

import { ProductCreateModel } from "./models/productCreate.model";
import { ProductUpdateModel } from "./models/productUpdate.model";

import { ProductUpdateDto } from "./dataTransferObjects/productUpdate.dto";
import { FilteredProductsRequestDto } from "./dataTransferObjects/filteredProductsRequest.dto";
import { FilteredProductsResponseDto } from "./dataTransferObjects/filteredProductsResponse.dto";

import { Product } from "./product.entity";

import { ProductMapper } from "./mappers/productMapper";

import { imageStorage } from "utils/imageStorage";


@ApiTags("Products")
@Controller("products")
export class ProductsController {
	constructor(
		private productsService: ProductsService,
	) { }

	@ApiOperation({ description: "Getting all products" })
	@ApiResponse({ type: [Product] })
	@Get("/admin")
	async getAll(@Query() findOptions: FindOptions<Product>) {
		const products = await this.productsService.getAllProducts(findOptions);
		return products;
	}

	@ApiOperation({ description: "Getting all products with pagination" })
	@ApiResponse({ type: FilteredProductsResponseDto })
	@Get()
	async getAllWithPagination(@Query() queryParams: FilteredProductsRequestDto) {
		const products = await this.productsService.getProductsWithPagination(queryParams);
		return products;
	}

	@ApiOperation({ description: "Getting product by id" })
	@ApiResponse({ type: Product })
	@Get("/:id")
	async getById(@Param("id") productId: number) {
		const product = await this.productsService.getById(productId);
		return product;
	}

	@ApiOperation({ description: "Getting products by slug" })
	@ApiResponse({ type: Product })
	@Get("/slug/:slug")
	async getBySlug(@Param("slug") slug: string) {
		const product = await this.productsService.getBySlug(slug);
		return product;
	}

	@ApiOperation({ description: "Adding product" })
	@ApiResponse({ type: Product })
	@UseInterceptors(FileInterceptor("image", imageStorage("productsImages")))
	@Post()
	async add(@Body() dto: ProductCreateModel, @UploadedFile() image: Express.Multer.File) {
		const productCreateDto = ProductMapper.toProductCreateDto(dto, image.filename);
		const product = await this.productsService.addProduct(productCreateDto);
		return product;
	}

	@ApiOperation({ description: "Adding products from excel table" })
	@ApiResponse({ type: [Product] })
	@UseInterceptors(FileInterceptor("file", imageStorage("excel")))
	@Post("/excel")
	async loadProductsFromTable(@UploadedFile() file: Express.Multer.File) {
		const products: Product[] = await this.productsService.loadProductsViaExcel(file.filename);
		return products;
	}

	@ApiOperation({ description: "Updating product" })
	@ApiResponse({ type: Product })
	@UseInterceptors(FileInterceptor("image", imageStorage("productsImages")))
	@HttpCode(204)
	@Patch("/:id")
	async update(
		@Param("id") productId: number,
		@Body() dto: ProductUpdateModel,
		@UploadedFile() image: Express.Multer.File
	) {
		const updateProductDto: ProductUpdateDto = ProductMapper.toProductUpdateDto(dto, image ? image.filename : undefined);
		await this.productsService.updateProduct(productId, updateProductDto);
	}

	@ApiOperation({ description: "Deleting product" })
	@ApiResponse({ type: Number })
	@HttpCode(204)
	@Delete("/:id")
	async delete(@Param("id") productId: number) {
		await this.productsService.deleteProduct(productId);
	}
}
