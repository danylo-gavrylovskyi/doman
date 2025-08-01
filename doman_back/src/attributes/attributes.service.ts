import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";

import { Attribute } from "./attribute.model";

import { PaginatedEntityRequestDto } from "src/shared/paginatedEntity.dto";

@Injectable()
export class AttributesService {
	constructor(@InjectModel(Attribute) private attributesRepository: typeof Attribute) { }

	getAllAttributes() {
		return this.attributesRepository.findAll();
	}

	getAttributesWithPagination({ page = "1", perPage = "4", inputValue = "" }: PaginatedEntityRequestDto) {
		return this.attributesRepository.findAndCountAll({
			limit: +perPage,
			offset: (+page - 1) * +perPage,
			where: {
				title: {
					[Op.iLike]: `%${inputValue}%`,
				}
			}
		});
	}

	addAttribute(title: string) {
		return this.attributesRepository.create(title);
	}

	deleteAttribute(id: number) {
		return this.attributesRepository.destroy({ where: { id } });
	}
}
