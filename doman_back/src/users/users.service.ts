import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { User } from "./user.model";

import { CreateUserDto } from "./dto/createUser.dto";

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User) private userRepository: typeof User,
		private readonly logger: Logger
	) { }

	async createUser(dto: CreateUserDto): Promise<User> {
		this.logger.debug(`Creating user with email="${dto.email}"`, UsersService.name);

		const user = await this.userRepository.create(dto);
		this.logger.log(`User created with id="${user.id}" and email="${user.email}"`, UsersService.name);

		return user;
	}

	findOne(filter: {
		where: { id?: number; email?: string; password?: string; phoneNumber?: string };
	}): Promise<User> {
		return this.userRepository.findOne({ ...filter });
	}

	async checkForExistingUser(email: string) {
		const user = await this.findOne({ where: { email } });

		if (user) {
			return user;
		}

		return false;
	}
}
