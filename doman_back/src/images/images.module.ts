import { Logger, Module } from '@nestjs/common';
import { ImagesService } from './images.service';

@Module({
  providers: [ImagesService, Logger],
  exports: [ImagesService]
})
export class ImagesModule { }
