import { Logger, Module } from '@nestjs/common';
import { BannersController } from './banners.controller';
import { BannersService } from './banners.service';
import { ImagesModule } from 'src/images/images.module';
import { RevalidationModule } from 'src/revalidation/revalidation.module';

@Module({
  controllers: [BannersController],
  providers: [BannersService, Logger],
  imports: [ImagesModule, RevalidationModule]
})
export class BannersModule { }
