import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Query,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AttributesService } from "./attributes.service";

import { Attribute } from "./attribute.model";

import { PaginatedEntityRequestDto, PaginatedEntityResponseDto } from "src/common/dto/paginatedEntity.dto";

@ApiTags("Attributes")
@Controller("attributes")
export class AttributesController {
	constructor(private attributesService: AttributesService) { }

	@ApiOperation({ description: "Getting all attributes" })
	@ApiResponse({ type: [Attribute] })
	@Get()
	async getAll() {
		const attributes = await this.attributesService.getAllAttributes();
		return attributes;
	}

	@ApiOperation({ description: "Getting all attributes with pagination" })
	@ApiResponse({ type: PaginatedEntityResponseDto<Attribute> })
	@Get("/pagination")
	async getAllWithPagination(@Query() queryParams: PaginatedEntityRequestDto) {
		const attributes = await this.attributesService.getAttributesWithPagination(queryParams);
		return attributes;
	}

	@ApiOperation({ description: "Adding new attribute" })
	@ApiResponse({ type: Attribute })
	@Post()
	async add(@Body() title: string) {
		const attribute = await this.attributesService.addAttribute(title);
		return attribute;
	}

	@ApiOperation({ description: "Deleting attribute" })
	@ApiResponse({ type: Number })
	@Delete("/:id")
	async delete(@Param() dto: { id: number }) {
		await this.attributesService.deleteAttribute(dto.id);
		return dto.id;
	}
}
