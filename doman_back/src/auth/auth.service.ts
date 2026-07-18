import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";

import { AuthDto } from "./dto/auth.dto";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/user.model";

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwt: JwtService,
		private readonly configService: ConfigService,
		private readonly logger: Logger
	) { }

	private getRefreshSecret(): string {
		return (
			this.configService.get<string>("JWT_REFRESH_SECRET") ||
			this.configService.get<string>("JWT_SECRET")
		);
	}

	async register(dto: AuthDto) {
		this.logger.debug(`Checking if user exists: email=${dto.email}`, AuthService.name);
		const doesUserExist = await this.usersService.checkForExistingUser(dto.email);

		if (doesUserExist) {
			this.logger.warn(`Registration failed: user already exists (email=${dto.email})`, AuthService.name);
			throw new BadRequestException("User already exists");
		}

		this.logger.debug(`Hashing password for new user: email=${dto.email}`, AuthService.name);
		const hashedPassword = await bcrypt.hash(dto.password, 10);

		const user = await this.usersService.createUser({
			firstName: dto.firstName,
			lastName: dto.lastName,
			phoneNumber: dto.phoneNumber,
			email: dto.email,
			password: hashedPassword,
		});
		this.logger.log(`User registered successfully (id=${user.id}, email=${user.email})`, AuthService.name);

		const tokens = await this.issueTokens(user.id);
		this.logger.debug(`Issued tokens for userId=${user.id}`, AuthService.name);

		return {
			user: this.returnUserFields(user),
			...tokens,
		};
	}

	async getNewTokens(refreshToken: string) {
		this.logger.debug(`Verifying refresh token`, AuthService.name);

		let result: { id: number; type?: string };
		try {
			result = await this.jwt.verifyAsync(refreshToken, {
				secret: this.getRefreshSecret(),
			});
		} catch {
			this.logger.warn(`Invalid refresh token`, AuthService.name);
			throw new UnauthorizedException("Invalid refresh token");
		}

		if (result.type !== "refresh") {
			this.logger.warn(`Token is not a refresh token`, AuthService.name);
			throw new UnauthorizedException("Invalid refresh token");
		}

		this.logger.debug(`Fetching user for refresh token (userId=${result.id})`, AuthService.name);
		const user = await this.usersService.findOne({ where: { id: result.id } });

		if (!user) {
			this.logger.warn(`Refresh failed: user not found (userId=${result.id})`, AuthService.name);
			throw new UnauthorizedException("User no longer exists");
		}

		const tokens = await this.issueTokens(user.id);
		this.logger.log(`Issued new tokens for userId=${user.id}`, AuthService.name);

		return {
			user: this.returnUserFields(user),
			...tokens,
		};
	}

	async login(dto: Pick<AuthDto, "email" | "password">) {
		this.logger.debug(`Validating user: email=${dto.email}`, AuthService.name);
		const user = await this.validateUser(dto);
		this.logger.log(`Login successful (id=${user.id}, email=${user.email})`, AuthService.name);

		const tokens = await this.issueTokens(user.id);
		this.logger.debug(`Issued tokens for userId=${user.id}`, AuthService.name);

		return {
			user: this.returnUserFields(user),
			...tokens,
		};
	}

	private async issueTokens(userId: number) {
		const accessToken = this.jwt.sign(
			{ id: userId, type: "access" },
			{ expiresIn: "1h" }
		);

		const refreshToken = this.jwt.sign(
			{ id: userId, type: "refresh" },
			{ expiresIn: "7d", secret: this.getRefreshSecret() }
		);

		return { accessToken, refreshToken };
	}

	private returnUserFields(user: User) {
		return {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			phoneNumber: user.phoneNumber,
			email: user.email,
			isAdmin: user.isAdmin,
		};
	}

	private async validateUser(dto: Pick<AuthDto, "email" | "password">): Promise<User> {
		this.logger.debug(`Checking if user exists: email=${dto.email}`, AuthService.name);
		const foundUser = await this.usersService.checkForExistingUser(dto.email);

		if (!foundUser) {
			this.logger.warn(`Login failed: user not found (email=${dto.email})`, AuthService.name);
			throw new NotFoundException("User not found");
		}

		const isValid = await bcrypt.compare(dto.password, foundUser.password);
		if (!isValid) {
			this.logger.warn(`Login failed: invalid password (email=${dto.email})`, AuthService.name);
			throw new UnauthorizedException("Invalid password");
		}

		return foundUser;
	}
}
