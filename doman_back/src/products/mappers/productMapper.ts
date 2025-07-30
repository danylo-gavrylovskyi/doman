import { ProductCreateDto } from "../dataTransferObjects/productCreate.dto";
import { ProductUpdateDto } from "../dataTransferObjects/productUpdate.dto";

import { ProductCreateModel } from "../models/productCreate.model";
import { ProductUpdateModel } from "../models/productUpdate.model";

import { AttributeIdValuePair } from "types/attribute-value-pair.interface";

export class ProductMapper {
    static toProductCreateDto(model: ProductCreateModel, image: string): ProductCreateDto {
        return {
            article: model.article,
            slug: model.slug,
            description: model.description,
            title: model.title,
            quantity: model.quantity,
            image: image,
            price: model.price,
            subcategoryId: model.subcategoryId,
            attributeValues: JSON.parse(model.attributeValues) as AttributeIdValuePair[],
        };
    }

    static toProductUpdateDto(model: ProductUpdateModel, image: string): ProductUpdateDto {
        return {
            article: model.article,
            title: model.title,
            description: model.description,
            quantity: model.quantity,
            price: model.price,
            isPopular: model.isPopular,
            subcategoryId: model.subcategoryId,
            image: image,
            oldAttributeValues: model.oldAttributeValues ? JSON.parse(model.oldAttributeValues) : undefined,
            newAttributeValues: model.newAttributeValues ? JSON.parse(model.newAttributeValues) : undefined
        };
    }
}
