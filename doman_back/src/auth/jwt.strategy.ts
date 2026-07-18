import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "src/users/user.model";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private configService: ConfigService, private userService: UsersService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get("JWT_SECRET"),
		});
	}

	async validate({ id, type }: { id: number; type?: string }) {
		if (type && type !== "access") {
			throw new UnauthorizedException("Invalid token type");
		}

		const user = await this.userService.findOne({ where: { id: +id } });
		if (!user) {
			throw new UnauthorizedException("User no longer exists");
		}

		return {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			phoneNumber: user.phoneNumber,
			email: user.email,
			isAdmin: user.isAdmin,
		};
	}
}
