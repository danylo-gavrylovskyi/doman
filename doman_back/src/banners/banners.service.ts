import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

import { PaginatedEntityRequestDto } from "src/shared/paginatedEntity.dto";

@Injectable()
export class BannersService {
	getAllBanners() {
		let bannersNames: Promise<string[]> = fs.promises.readdir(
			path.join(__dirname, "..", "..", "..", "uploads", "banners")
		);
		return bannersNames;
	}

	async getBannersWithPagination({ page = "1", perPage = "4" }: PaginatedEntityRequestDto) {
		const pathToFolder = path.join(__dirname, "..", "..", "..", "uploads", "banners");
		const allBanners = await fs.promises.readdir(pathToFolder);

		const start = (+page - 1) * +perPage;
		const end = start + +perPage;

		const paginatedBanners = allBanners.slice(start, end);
		return { rows: paginatedBanners, count: allBanners.length };
	}

	deleteBanner(bannerUrl: string) {
		fs.unlink(path.join(__dirname, "..", "..", "..", "uploads", "banners", bannerUrl), (err) => {
			if (err) {
				throw new InternalServerErrorException("Error while deleting banner")
			}
		});
	}
}
