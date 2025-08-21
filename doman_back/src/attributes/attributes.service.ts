import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";

import { Attribute } from "./attribute.model";

import { PaginatedEntityRequestDto, PaginatedEntityResponseDto } from "src/common/dto/paginatedEntity.dto";

@Injectable()
export class AttributesService {
	constructor(
		@InjectModel(Attribute) private attributesRepository: typeof Attribute,
		private readonly logger: Logger
	) { }

	async getAllAttributes(): Promise<Attribute[]> {
		this.logger.debug('Fetching all attributes', AttributesService.name);

		const attributes = await this.attributesRepository.findAll();
		this.logger.log("Fetched all attributes", AttributesService.name)

		return attributes;
	}

	async getAttributesWithPagination(
		{ page = "1", perPage = "4", inputValue = "" }: PaginatedEntityRequestDto
	): Promise<PaginatedEntityResponseDto<Attribute>> {
		this.logger.debug(
			`Fetching attributes with pagination: page=${page}, perPage=${perPage}, filter="${inputValue}"`,
			AttributesService.name
		);

		const paginatedAttributes = await this.attributesRepository.findAndCountAll({
			limit: +perPage,
			offset: (+page - 1) * +perPage,
			where: {
				title: {
					[Op.iLike]: `%${inputValue}%`,
				}
			}
		});

		this.logger.log(
			`Fetched ${paginatedAttributes.rows.length} attributes (total: ${paginatedAttributes.count}) for page=${page}`,
			AttributesService.name
		);

		return paginatedAttributes
	}

	async addAttribute(title: string): Promise<Attribute> {
		this.logger.debug(`Adding new attribute with title="${title}"`, AttributesService.name);

		const attribute = await this.attributesRepository.create(title);
		this.logger.log(`Created attribute with title="${title}"`, AttributesService.name)

		return attribute;
	}

	async deleteAttribute(id: number): Promise<boolean> {
		this.logger.debug(`Deleting attribute with id="${id}"`, AttributesService.name)

		const deletedCount = await this.attributesRepository.destroy({ where: { id } });
		if (deletedCount) {
			this.logger.log(`Deleted attribute with id=${id}`, AttributesService.name);
		} else {
			this.logger.warn(`No attribute found with id=${id} to delete`, AttributesService.name);
		}

		return deletedCount > 0;
	}
}
