import {
	BadRequestException,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Query,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

import { BannersService } from "./banners.service";
import { ImagesService } from "src/images/images.service";
import { RevalidationService } from "src/revalidation/revalidation.service";

import { Auth } from "src/auth/decorators/auth.decorator";

import { PaginatedEntityRequestDto, PaginatedEntityResponseDto } from "src/common/dto/paginatedEntity.dto";

@Controller("banners")
export class BannersController {
	constructor(
		private bannersService: BannersService,
		private imagesService: ImagesService,
		private revalidationService: RevalidationService,
	) { }

	@ApiOperation({ summary: "Getting all banners" })
	@ApiResponse({ type: [String] })
	@Get()
	async getAll() {
		const banners = await this.bannersService.getAllBanners();
		return banners;
	}

	@ApiOperation({ description: "Getting all banners with pagination" })
	@ApiResponse({ type: PaginatedEntityResponseDto<String> })
	@Get("/pagination")
	async getAllWithPagination(@Query() queryParams: PaginatedEntityRequestDto) {
		const banners = await this.bannersService.getBannersWithPagination(queryParams);
		return banners;
	}

	@ApiOperation({ summary: "Adding banner" })
	@ApiResponse({ type: String })
	@Auth("admin")
	@Post()
	@UseInterceptors(FileInterceptor("banner", ImagesService.getUploadOptions()))
	async add(@UploadedFile() banner: Express.Multer.File) {
		if (!banner) {
			throw new BadRequestException("Banner image is required");
		}
		const filename = await this.imagesService.uploadImage("banners", banner);
		void this.revalidationService.revalidateBanners();
		return filename;
	}

	@ApiOperation({ summary: "Deleting banner" })
	@ApiResponse({ type: String })
	@Auth("admin")
	@Delete("/:bannerUrl")
	async delete(@Param("bannerUrl") bannerUrl: string) {
		await this.bannersService.deleteBanner(bannerUrl);
		return bannerUrl;
	}
}
