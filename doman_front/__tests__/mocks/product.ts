import { CartProduct, Product } from '@/types/product.interface';

export const mockProduct: Product = {
	id: 0,
	title: 'Test Product',
	description: 'Some description',
	slug: 'test-product',
	article: '000000',
	quantity: 100,
	subcategoryId: 1,
	price: 1200,
	image: 'some-image.jpg',
};

export const mockCartProduct: CartProduct = {
	product: mockProduct,
	quantity: 3,
};
