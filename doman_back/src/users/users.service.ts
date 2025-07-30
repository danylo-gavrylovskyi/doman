import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { User } from "./user.model";

import { CreateUserDto } from "./dto/createUser.dto";

@Injectable()
export class UsersService {
	constructor(@InjectModel(User) private userRepository: typeof User) { }

	createUser(dto: CreateUserDto) {
		return this.userRepository.create(dto);
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
