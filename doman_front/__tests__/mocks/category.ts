import { Category, Subcategory } from '@/types/category.interface';

export const mockCategory: Category = {
	id: 1,
	title: 'Test Category',
	slug: 'test-category',
	image: 'test-image.jpg',
};

export const mockSubcategory: Subcategory = {
	...mockCategory,
	categoryId: 2,
};
