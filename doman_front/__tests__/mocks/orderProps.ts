import {
	ExtendedOrderProps,
	OrderProps,
} from '@/components/Order/orderProps.interface';

export const mockOrderProps: OrderProps = {
	orderId: 123,
	totalPrice: 3400,
	createdAt: '2024-02-20',
	orderProducts: [
		{
			id: 0,
			orderId: 123,
			productId: 0,
			quantity: 2,
			product: {
				id: 0,
				title: 'Test Product 1',
				description: 'Some description 1',
				slug: 'test-product-1',
				article: '000000',
				quantity: 100,
				subcategoryId: 1,
				price: 1200,
				image: 'some-image-1.jpg',
			},
		},
		{
			id: 1,
			orderId: 123,
			productId: 1,
			quantity: 1,
			product: {
				id: 1,
				title: 'Test Product 2',
				description: 'Some description 2',
				slug: 'test-product-2',
				article: '000001',
				quantity: 100,
				subcategoryId: 1,
				price: 1000,
				image: 'some-image-2.jpg',
			},
		},
	],
};

export const mockExtendedOrderProps: ExtendedOrderProps = {
	...mockOrderProps,
	customer: {
		firstName: 'John',
		lastName: 'Doe',
		phoneNumber: '123-456-789',
		email: 'john.doe@example.com',
	},
};
