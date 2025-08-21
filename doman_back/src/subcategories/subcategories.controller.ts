import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { SubcategoriesService } from "./subcategories.service";
import { ImagesService } from "src/images/images.service";

import { Subcategory } from "./subcategory.model";

import { CreateSubcategoryDto } from "./dto/create-subcategory.dto";
import { PaginatedEntityRequestDto, PaginatedEntityResponseDto } from "src/common/dto/paginatedEntity.dto";
import { AttributeWithValuesDto } from "src/common/dto/attributeWithValues.dto";
import { UpdateSubcategoryDto } from "./dto/update-subcategory.dto";

@ApiTags("Subcategories")
@Controller("subcategories")
export class SubcategoriesController {
	constructor(private subcategoriesService: SubcategoriesService) { }

	@ApiOperation({ summary: "Getting all subcategories" })
	@ApiResponse({ type: [Subcategory] })
	@Get()
	async getAll() {
		const subcategories = await this.subcategoriesService.getAllSubcategories();
		return subcategories;
	}

	@ApiOperation({ description: "Getting all subcategories with pagination" })
	@ApiResponse({ type: PaginatedEntityResponseDto<Subcategory> })
	@Get("/pagination")
	async getAllWithPagination(@Query() queryParams: PaginatedEntityRequestDto) {
		const subcategories = await this.subcategoriesService.getSubcategoriesWithPagination(
			queryParams
		);
		return subcategories;
	}

	@ApiOperation({ summary: "Getting subcategory by slug" })
	@ApiResponse({ type: Subcategory })
	@Get("/slug/:slug")
	async getBySlug(@Param("slug") slug: string) {
		const subcategory = await this.subcategoriesService.getSubcategoryBySlug(slug);
		return subcategory;
	}

	@ApiOperation({ summary: "Getting filter attributes for subcategory" })
	@ApiResponse({ type: [AttributeWithValuesDto] })
	@Get("/:id/attributes")
	async getFilterAttributes(@Param("id") subcategoryId: number) {
		const attributes = await this.subcategoriesService.getFilterAttributes(subcategoryId);
		if (!attributes.length) {
			throw new NotFoundException("No attributes found for this subcategory");
		}
		return attributes;
	}

	@ApiOperation({ summary: "Adding subcategory" })
	@ApiResponse({ type: Subcategory })
	@Post()
	@UseInterceptors(FileInterceptor("image", ImagesService.getImageStorage("subcategoriesImages")))
	async add(@Body() dto: CreateSubcategoryDto, @UploadedFile() image: Express.Multer.File) {
		const subcategory = await this.subcategoriesService.addSubcategory({
			...dto,
			image: image.filename,
		});
		return subcategory;
	}

	@ApiOperation({ summary: "Edit subcategory" })
	@ApiResponse({ type: Subcategory })
	@Patch("/:id")
	@UseInterceptors(FileInterceptor("image", ImagesService.getImageStorage("subcategoriesImages")))
	async edit(
		@Param("id") subcategoryId: number,
		@Body() dto: UpdateSubcategoryDto,
		@UploadedFile() image?: Express.Multer.File
	) {
		let updatedSubcategory: Subcategory;
		console.log(image)


		if (image) {
			updatedSubcategory = await this.subcategoriesService.editSubcategory(subcategoryId, {
				...dto,
				image: image.filename,
			});
		}
		else {
			updatedSubcategory = await this.subcategoriesService.editSubcategory(subcategoryId, {
				...dto,
			});
		}

		return updatedSubcategory;
	}

	@ApiOperation({ summary: "Deleting subcategory" })
	@ApiResponse({ type: Number })
	@Delete("/:id")
	async delete(@Param("id") subcategoryId: number) {
		await this.subcategoriesService.deleteSubcategory(subcategoryId);
		return subcategoryId;
	}
}
