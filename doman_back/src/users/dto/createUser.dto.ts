import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";

export class CreateUserDto {
	@ApiProperty({ example: "John", description: "User's first name" })
	@IsString()
	@IsNotEmpty()
	readonly firstName: string;

	@ApiProperty({ example: "Doe", description: "User's last name" })
	@IsString()
	@IsNotEmpty()
	readonly lastName: string;

	@ApiProperty({ example: "0630000000", description: "User's phone number" })
	@IsString()
	@IsPhoneNumber()
	readonly phoneNumber: string;

	@ApiPropertyOptional({ example: "john.doe@gmail.com", description: "User's email" })
	@IsOptional()
	@IsEmail()
	readonly email?: string;

	@ApiPropertyOptional({ example: "vg464g57v34v34!", description: "User's hashed password" })
	@IsOptional()
	@IsString()
	readonly password?: string;
}
