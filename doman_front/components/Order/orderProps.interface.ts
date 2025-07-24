import { OrderProduct } from '@/types/order.interface';
import { User } from '@/types/user.interface';

export interface OrderProps {
	orderId: number;
	totalPrice: number;
	createdAt: string;
	orderProducts: OrderProduct[];
	height?: string;
}

export interface ExtendedOrderProps extends OrderProps {
	customer: Omit<User, 'password' | 'isAdmin'>;
}
