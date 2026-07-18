import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
	Body,
	Controller,
	Get,
	Post,
	Param,
	UseInterceptors,
	UploadedFile,
	Delete,
	Patch,
	Query,
	NotFoundException,
	BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { CategoriesService } from "./categories.service";
import { ImagesService } from "src/images/images.service";

import { Auth } from "src/auth/decorators/auth.decorator";

import { Category } from "./category.model";
import { Subcategory } from "src/subcategories/subcategory.model";

import { PaginatedEntityRequestDto, PaginatedEntityResponseDto } from "src/common/dto/paginatedEntity.dto";
import { AttributeWithValuesDto } from "src/common/dto/attributeWithValues.dto";

@ApiTags("Categories")
@Controller("categories")
export class CategoriesController {
	constructor(
		private categoriesService: CategoriesService,
		private imagesService: ImagesService,
	) { }

	@ApiOperation({ summary: "Getting all categories" })
	@ApiResponse({ type: [Category] })
	@Get()
	async getAll() {
		const categories = await this.categoriesService.getAllCategories();
		return categories;
	}

	@ApiOperation({ description: "Getting all categories with pagination" })
	@ApiResponse({ type: PaginatedEntityResponseDto<Category> })
	@Get("/pagination")
	async getAllWithPagination(@Query() queryParams: PaginatedEntityRequestDto) {
		const categories = await this.categoriesService.getCategoriesWithPagination(queryParams);
		return categories;
	}

	@ApiOperation({ summary: "Getting category by id" })
	@ApiResponse({ type: Category })
	@Get("/:id")
	async getById(@Param("id") id: number) {
		const category = await this.categoriesService.getCategoryById(id);
		return category;
	}

	@ApiOperation({ summary: "Getting category by slug" })
	@ApiResponse({ type: Category })
	@Get("/slug/:slug")
	async getBySlug(@Param("slug") slug: string) {
		const category = await this.categoriesService.getCategoryBySlug(slug);
		return category;
	}

	@ApiOperation({ summary: "Getting filter attributes for category" })
	@ApiResponse({ type: [AttributeWithValuesDto] })
	@Get("/:id/attributes")
	async getFilterAttributes(@Param("id") categoryId: number) {
		const attributes = await this.categoriesService.getFilterAttributes(categoryId);
		if (!attributes.length) {
			throw new NotFoundException("No attributes found for this category");
		}
		return attributes;
	}

	@ApiOperation({ summary: "Adding category" })
	@ApiResponse({ type: Category })
	@Auth("admin")
	@Post()
	@UseInterceptors(FileInterceptor("image", ImagesService.getUploadOptions()))
	async add(
		@Body() dto: { title: string; slug: string },
		@UploadedFile() file: Express.Multer.File
	) {
		if (!file) {
			throw new BadRequestException("Category image is required");
		}
		const filename = await this.imagesService.uploadImage("categoriesImages", file);
		const category = await this.categoriesService.addCategory({
			...dto,
			image: filename,
		});
		return category;
	}

	@ApiOperation({ summary: "Getting this category subcategories" })
	@ApiResponse({ type: [Subcategory] })
	@Get("/:id/subcategories")
	async getCategorySubcategories(@Param("id") categoryId: number) {
		const subcategories = await this.categoriesService.getSubcategories(categoryId);
		return subcategories;
	}

	@ApiOperation({ summary: "Edit category" })
	@ApiResponse({ type: Category })
	@Auth("admin")
	@Patch("/:id")
	@UseInterceptors(FileInterceptor("image", ImagesService.getUploadOptions()))
	async edit(
		@Param("id") categoryId: number,
		@Body() dto: { title: string },
		@UploadedFile() file?: Express.Multer.File
	) {
		let updatedCategory: Category;

		if (file) {
			const filename = await this.imagesService.uploadImage("categoriesImages", file);
			updatedCategory = await this.categoriesService.editCategory(categoryId, {
				...dto,
				image: filename,
			});
			return updatedCategory;
		}
		updatedCategory = await this.categoriesService.editCategory(categoryId, { ...dto });

		return updatedCategory;
	}

	@ApiOperation({ summary: "Deleting category" })
	@ApiResponse({ type: Number })
	@Auth("admin")
	@Delete("/:id")
	async delete(@Param("id") categoryId: number) {
		await this.categoriesService.deleteCategory(categoryId);
		return categoryId;
	}
}
