import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

import { PaginatedEntityRequestDto, PaginatedEntityResponseDto } from "src/shared/paginatedEntity.dto";

@Injectable()
export class BannersService {
	constructor(private readonly logger: Logger) { }

	async getAllBanners(): Promise<string[]> {
		this.logger.debug("Fetching all banners", BannersService.name);

		try {
			const files = await fs.promises.readdir(
				path.join(__dirname, "..", "..", "..", "uploads", "banners")
			);
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
		const pathToFolder = path.join(__dirname, "..", "..", "..", "uploads", "banners");

		try {
			const allBanners = await fs.promises.readdir(pathToFolder);
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

	deleteBanner(bannerUrl: string): void {
		this.logger.warn(`Deleting banner: ${bannerUrl}`, BannersService.name);
		fs.unlink(path.join(__dirname, "..", "..", "..", "uploads", "banners", bannerUrl), (err) => {
			if (err) {
				this.logger.error(`Failed to delete banner "${bannerUrl}": ${err.message}`, err.stack, BannersService.name);
				throw new InternalServerErrorException("Error while deleting banner");
			}
			this.logger.log(`Banner "${bannerUrl}" deleted successfully`, BannersService.name);
		});
	}
}
