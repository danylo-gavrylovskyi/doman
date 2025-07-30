import {
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

import { PaginatedEntityRequestDto, PaginatedEntityResponseDto } from "src/shared/paginatedEntity.dto";

import { imageStorage } from "utils/imageStorage";

@Controller("banners")
export class BannersController {
	constructor(private bannersService: BannersService) { }

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
	@Post()
	@UseInterceptors(FileInterceptor("banner", imageStorage("banners")))
	add(@UploadedFile() banner: Express.Multer.File) {
		return banner.filename;
	}

	@ApiOperation({ summary: "Deleting banner" })
	@ApiResponse({ type: String })
	@Delete("/:bannerUrl")
	delete(@Param("bannerUrl") bannerUrl: string) {
		this.bannersService.deleteBanner(bannerUrl);
		return bannerUrl;
	}
}
