export interface FindOptions {
	where?: {
		id?: number;
		slug?: string;
		article?: string;
		quantity?: number;
		subcategoryId?: number;
		price?: number;
		isPopular?: boolean;
	};
}
