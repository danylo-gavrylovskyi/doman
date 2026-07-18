import { Logger, Module } from "@nestjs/common";

import { RevalidationService } from "./revalidation.service";

@Module({
	providers: [RevalidationService, Logger],
	exports: [RevalidationService],
})
export class RevalidationModule { }
