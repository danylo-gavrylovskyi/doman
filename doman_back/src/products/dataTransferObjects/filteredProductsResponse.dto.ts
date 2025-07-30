import { Product } from "../product.entity";

export class FilteredProductsResponseDto {
    readonly count: number;
    readonly rows: Product[];
}
