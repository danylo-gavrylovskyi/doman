import {
	Body,
	Controller,
	Post,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) { }

	@UsePipes(new ValidationPipe())
	@Post("register")
	async register(@Body() dto: AuthDto) {
		return this.authService.register(dto);
	}

	@UsePipes(new ValidationPipe())
	@Post("login")
	async login(@Body() dto: Pick<AuthDto, "email" | "password">) {
		return this.authService.login(dto);
	}

	@UsePipes(new ValidationPipe())
	@Post("login/access-token")
	async getNewTokens(@Body() dto: RefreshTokenDto) {
		return this.authService.getNewTokens(dto.refreshToken);
	}
}
