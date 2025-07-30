import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./user.model";
import { CreateUserDto } from "./dto/createUser.dto";

@ApiTags("Users")
@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@ApiOperation({ description: "Creating new user" })
	@ApiResponse({ type: User })
	@Post()
	async create(@Body() dto: CreateUserDto) {
		const createdUser = await this.usersService.createUser(dto);
		return createdUser;
	}
}
