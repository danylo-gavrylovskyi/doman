import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length, MinLength } from "class-validator";

export class AuthDto {
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

	@ApiProperty({ example: "john.doe@gmail.com", description: "User's email" })
	@IsString()
	@IsEmail()
	readonly email: string;

	@ApiProperty({ example: "CoolPass123!", description: "User's password" })
	@MinLength(6, { message: "Довжина паролю має бути щонайменше 6 символів" })
	@IsString()
	readonly password: string;
}
