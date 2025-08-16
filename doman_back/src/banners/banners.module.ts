import { Logger, Module } from '@nestjs/common';
import { BannersController } from './banners.controller';
import { BannersService } from './banners.service';
import { ImagesModule } from 'src/images/images.module';

@Module({
  controllers: [BannersController],
  providers: [BannersService, Logger],
  imports: [ImagesModule]
})
export class BannersModule { }
