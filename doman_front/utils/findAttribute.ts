import { Attribute } from "@/types/attribute.interface";

export const findAttribute = (attributes: Attribute[], attributeId: number): Attribute => {
	const attribute = attributes.find((attr) => attr.id === attributeId);
	if (attribute) return attribute;
	return attributes[0];
};
