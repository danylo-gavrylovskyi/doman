import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) { }

	@Throttle({ default: { limit: 5, ttl: 60000 } })
	@UsePipes(new ValidationPipe())
	@Post("register")
	async register(@Body() dto: AuthDto) {
		return this.authService.register(dto);
	}

	@Throttle({ default: { limit: 5, ttl: 60000 } })
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Post("login")
	async login(@Body() dto: Pick<AuthDto, "email" | "password">) {
		return this.authService.login(dto);
	}

	@Throttle({ default: { limit: 10, ttl: 60000 } })
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Post("login/access-token")
	async getNewTokens(@Body() dto: RefreshTokenDto) {
		return this.authService.getNewTokens(dto.refreshToken);
	}
}
