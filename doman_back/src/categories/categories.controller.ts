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
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { CategoriesService } from "./categories.service";

import { Category } from "./category.model";
import { Subcategory } from "src/subcategories/subcategory.model";

import { PaginatedEntityRequestDto, PaginatedEntityResponseDto } from "src/shared/paginatedEntity.dto";
import { AttributeWithValuesDto } from "src/shared/attributeWithValues.dto";

import { imageStorage } from "utils/imageStorage";

@ApiTags("Categories")
@Controller("categories")
export class CategoriesController {
	constructor(private categoriesService: CategoriesService) { }

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
	@Post()
	@UseInterceptors(FileInterceptor("image", imageStorage("categoriesImages")))
	async add(
		@Body() dto: { title: string; slug: string },
		@UploadedFile() file: Express.Multer.File
	) {
		const category = await this.categoriesService.addCategory({
			...dto,
			image: file.filename,
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

	@ApiOperation({ summary: "Deleting category" })
	@ApiResponse({ type: Number })
	@Delete("/:id")
	async delete(@Param("id") categoryId: number) {
		await this.categoriesService.deleteCategory(categoryId);
		return categoryId;
	}

	@ApiOperation({ summary: "Edit category" })
	@ApiResponse({ type: Category })
	@Patch("/:id")
	@UseInterceptors(FileInterceptor("image", imageStorage("categoriesImages")))
	async edit(
		@Param("id") categoryId: number,
		@Body() dto: { title: string },
		@UploadedFile() file?: Express.Multer.File
	) {
		if (file) {
			const updatedCategory = await this.categoriesService.editCategory(categoryId, {
				...dto,
				image: file.filename,
			});
			return updatedCategory;
		}
		const updatedCategory = await this.categoriesService.editCategory(categoryId, { ...dto });
		return updatedCategory;
	}
}
