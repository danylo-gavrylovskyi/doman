import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { v4 as uuid } from "uuid";

import * as path from 'path';
import * as fs from "fs";

@Injectable()
export class ImagesService {
    constructor(private readonly logger: Logger) { }

    static getImageStorage(folder: string): MulterOptions {
        const fullPath = path.resolve(process.cwd(), "uploads", folder);

        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }

        return {
            storage: diskStorage({
                destination: fullPath,
                filename: (req, file, callback) => {
                    const filename: string =
                        path.parse(file.originalname).name.replace(/\s/g, "") + uuid();
                    const extension: string = path.parse(file.originalname).ext;
                    callback(null, `${filename}${extension}`);
                },
            }),
            fileFilter: (req, file, callback) => {
                const allowed = ['.png', '.jpg', '.jpeg', '.webp', '.xlsx', '.xls'];

                const ext = path.extname(file.originalname).toLowerCase();
                if (!allowed.includes(ext)) {
                    return callback(new BadRequestException('Invalid file type'), false);
                }

                callback(null, true);
            }
        };
    }

    async getImagesFromFolder(folder: string): Promise<string[]> {
        this.logger.debug(`Reading images from folder="${folder}"`, ImagesService.name);

        const pathToFolder = path.resolve(process.cwd(), "uploads", folder);

        try {
            const images = await fs.promises.readdir(pathToFolder);
            return images;
        } catch (error) {
            this.logger.error(
                `Failed to get images from folder "${pathToFolder}": ${error.message}`,
                error.stack,
                ImagesService.name
            )
            throw new InternalServerErrorException("Error while reading images");
        }
    }

    async deleteImage(folder: string, image: string): Promise<void> {
        this.logger.debug(`Deleting image="${image}" from folder="${folder}"`, ImagesService.name);
        const pathToImage = path.resolve(process.cwd(), "uploads", folder, image);

        try {
            await fs.promises.unlink(pathToImage);
            this.logger.log(`Deleted image="${image}" from folder="${folder}"`, ImagesService.name);
        } catch (err) {
            this.logger.error(
                `Failed to delete image at "${pathToImage}": ${err.message}`,
                err.stack,
                ImagesService.name
            );
            throw new InternalServerErrorException("Error while deleting image from folder");
        }
    }
}
