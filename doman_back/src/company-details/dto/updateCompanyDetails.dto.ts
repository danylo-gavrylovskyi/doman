import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class UpdateCompanyDetailsDto {
	@ApiPropertyOptional({
		example: "Інформація про оплату та доставку",
		description: "Info about payment and delivery"
	})
	@IsString()
	@IsOptional()
	readonly payment_and_delivery_content?: string;

	@ApiPropertyOptional({
		example: "Інформація про повернення",
		description: "Info about returns and exchanges"
	})
	@IsString()
	@IsOptional()
	readonly returns_and_exchanges_content?: string;

	@ApiPropertyOptional({
		example: "Інформація про магазин",
		description: "Info about payment and delivery"
	})
	@IsString()
	@IsOptional()
	readonly about_company_content?: string;

	@ApiPropertyOptional({
		example: "Перший номер телефону магазину",
		description: "Phone number 1"
	})
	@IsString()
	@IsOptional()
	@IsPhoneNumber()
	readonly phone_number1?: string;

	@ApiPropertyOptional({
		example: "Другий номер телефону магазину",
		description: "Phone number 2"
	})
	@IsString()
	@IsOptional()
	@IsPhoneNumber()
	readonly phone_number2?: string;

	@ApiPropertyOptional({
		example: "Електронна пошта магазину",
		description: "Company email"
	})
	@IsString()
	@IsOptional()
	@IsEmail()
	readonly email?: string;

	@ApiPropertyOptional({
		example: "Адреса магазину",
		description: "Store address"
	})
	@IsString()
	@IsOptional()
	readonly address?: string;

	@ApiPropertyOptional({
		example: "Посилання на сторінку в фейсбуці",
		description: "Link to facebook page"
	})
	@IsString()
	@IsOptional()
	readonly facebook_link?: string;

	@ApiPropertyOptional({
		example: "Посилання на сторінку в інстаграмі",
		description: "Link to instagram page"
	})
	@IsString()
	@IsOptional()
	readonly instagram_link?: string;
}
