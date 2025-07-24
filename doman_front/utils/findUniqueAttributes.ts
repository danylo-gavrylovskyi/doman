import { Attribute } from '@/types/attribute.interface';
import { Category, Subcategory } from '@/types/category.interface';
import { Product } from '@/types/product.interface';
import { UniqueAttribute } from '@/types/unique-attribute.interface';

export const findUniqueAttributesInSubcategory = (
	subcategory: Subcategory,
	products: Product[]
) => {
	let uniqueAttributes: UniqueAttribute[] = [];

	subcategory.products?.forEach((product: Product) => {
		const foundProduct = products.find(
			(prod: Product) => prod.id === product.id
		);
		foundProduct?.attributes?.forEach((attribute: Attribute) => {
			const foundAttributeIdx = uniqueAttributes.findIndex(
				(pair) => pair.attrId === attribute.attributeId
			);
			if (foundAttributeIdx === -1) {
				uniqueAttributes.push({
					attrId: attribute.attributeId,
					values: [attribute.attributeValue],
				});
			} else {
				!uniqueAttributes[foundAttributeIdx].values.includes(
					attribute.attributeValue
				) &&
					uniqueAttributes[foundAttributeIdx].values.push(
						attribute.attributeValue
					);
			}
		});
	});

	return uniqueAttributes;
};

export const findUniqueAttributesInCategory = (
	category: Category,
	subcategories: Subcategory[],
	products: Product[]
) => {
	let uniqueAttributes: UniqueAttribute[] = [];

	if (!products) return [] as UniqueAttribute[];

	category.subcategories?.forEach((subcat) => {
		const foundSubcat = subcategories.find((sub) => sub.id === subcat.id);
		foundSubcat?.products?.forEach((product) => {
			const foundProduct = products.find(
				(prod: Product) => prod.id === product.id
			);
			foundProduct?.attributes?.forEach((attribute: Attribute) => {
				const foundAttributeIdx = uniqueAttributes.findIndex(
					(pair) => pair.attrId === attribute.attributeId
				);
				if (foundAttributeIdx === -1) {
					uniqueAttributes.push({
						attrId: attribute.attributeId,
						values: [attribute.attributeValue],
					});
				} else {
					!uniqueAttributes[foundAttributeIdx].values.includes(
						attribute.attributeValue
					) &&
						uniqueAttributes[foundAttributeIdx].values.push(
							attribute.attributeValue
						);
				}
			});
		});
	});

	return uniqueAttributes;
};
