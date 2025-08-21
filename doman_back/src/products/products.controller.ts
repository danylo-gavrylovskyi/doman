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
import { ImagesService } from "src/images/images.service";

import { Product } from "./product.model";

import { PaginatedEntityResponseDto } from "src/common/dto/paginatedEntity.dto";
import { GetFilteredProductsDto } from "./dto/get-filtered-products.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

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
	@ApiResponse({ type: PaginatedEntityResponseDto<Product> })
	@Get()
	async getAllWithPagination(@Query() queryParams: GetFilteredProductsDto) {
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
	@UseInterceptors(FileInterceptor("image", ImagesService.getImageStorage("productsImages")))
	@Post()
	async add(
		@Body() dto: CreateProductDto,
		@UploadedFile() image: Express.Multer.File
	) {
		const product = await this.productsService.addProduct({ ...dto, image: image.filename });
		return product;
	}

	@ApiOperation({ description: "Adding products from excel table" })
	@ApiResponse({ type: [Product] })
	@UseInterceptors(FileInterceptor("file", ImagesService.getImageStorage("excel")))
	@Post("/excel")
	async loadProductsFromTable(@UploadedFile() file: Express.Multer.File) {
		const products: Product[] = await this.productsService.loadProductsViaExcel(file.filename);
		return products;
	}

	@ApiOperation({ description: "Updating product" })
	@ApiResponse({ type: Product })
	@UseInterceptors(FileInterceptor("image", ImagesService.getImageStorage("productsImages")))
	@HttpCode(204)
	@Patch("/:id")
	async update(
		@Param("id") productId: number,
		@Body() dto: UpdateProductDto,
		@UploadedFile() image: Express.Multer.File
	) {
		await this.productsService.updateProduct(productId, { ...dto, image: image?.filename });
	}

	@ApiOperation({ description: "Deleting product" })
	@ApiResponse({ type: Number })
	@HttpCode(204)
	@Delete("/:id")
	async delete(@Param("id") productId: number) {
		await this.productsService.deleteProduct(productId);
	}
}
