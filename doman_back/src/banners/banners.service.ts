import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";

import { ImagesService } from "src/images/images.service";

import { PaginatedEntityRequestDto, PaginatedEntityResponseDto } from "src/common/dto/paginatedEntity.dto";

@Injectable()
export class BannersService {
	constructor(
		private readonly logger: Logger,
		private readonly imagesService: ImagesService
	) { }

	async getAllBanners(): Promise<string[]> {
		this.logger.debug("Fetching all banners", BannersService.name);

		try {
			const files = await this.imagesService.getImagesFromFolder("banners")
			this.logger.log(`Fetched ${files.length} banners`, BannersService.name);
			return files;
		} catch (err) {
			this.logger.error(`Failed to fetch banners: ${err.message}`, err.stack, BannersService.name);
			throw new InternalServerErrorException("Error while reading banners");
		}
	}

	async getBannersWithPagination(
		{ page = "1", perPage = "4" }: PaginatedEntityRequestDto
	): Promise<PaginatedEntityResponseDto<string>> {
		this.logger.debug(`Fetching banners with pagination: page=${page}, perPage=${perPage}`, BannersService.name);

		try {
			const allBanners = await this.imagesService.getImagesFromFolder("banners");
			const start = (+page - 1) * +perPage;
			const end = start + +perPage;

			const paginatedBanners = allBanners.slice(start, end);
			this.logger.log(`Returning ${paginatedBanners.length} banners out of ${allBanners.length}`, BannersService.name);
			return { rows: paginatedBanners, count: allBanners.length };
		} catch (err) {
			this.logger.error(`Failed to paginate banners: ${err.message}`, err.stack, BannersService.name);
			throw new InternalServerErrorException("Error while reading banners");
		}
	}

	async deleteBanner(bannerUrl: string): Promise<void> {
		await this.imagesService.deleteImage("banners", bannerUrl)
	}
}
