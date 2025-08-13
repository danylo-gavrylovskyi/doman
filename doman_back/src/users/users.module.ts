import { Logger, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./user.model";

@Module({
	controllers: [UsersController],
	providers: [UsersService, Logger],
	imports: [SequelizeModule.forFeature([User])],
	exports: [UsersService],
})
export class UsersModule { }
