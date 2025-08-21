import { IsOptional } from "class-validator";

export class PaginatedEntityRequestDto {
    @IsOptional()
    readonly page?: string;

    @IsOptional()
    readonly perPage?: string;

    @IsOptional()
    readonly inputValue?: string
}

export class PaginatedEntityResponseDto<T> {
    readonly count: number;
    readonly rows: T[];
}