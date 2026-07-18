import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import {
    DeleteObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { memoryStorage } from 'multer';
import { v4 as uuid } from "uuid";

import * as path from 'path';

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.xlsx', '.xls'];

@Injectable()
export class ImagesService {
    private readonly bucket = process.env.R2_BUCKET;
    private readonly client = new S3Client({
        region: process.env.R2_REGION || "auto",
        endpoint: process.env.R2_ENDPOINT,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        },
    });

    constructor(private readonly logger: Logger) { }

    /**
     * Multer options used by FileInterceptor. Files are buffered in memory and
     * then streamed to object storage by `uploadImage`, so no local disk is
     * touched. Evaluated at decorator time, hence intentionally env-free.
     */
    static getUploadOptions(): MulterOptions {
        return {
            storage: memoryStorage(),
            limits: {
                fileSize: 10 * 1024 * 1024,
            },
            fileFilter: (req, file, callback) => {
                const ext = path.extname(file.originalname).toLowerCase();
                if (!ALLOWED_EXTENSIONS.includes(ext)) {
                    return callback(new BadRequestException('Invalid file type'), false);
                }
                callback(null, true);
            },
        };
    }

    private key(folder: string, filename: string): string {
        return `${folder}/${filename}`;
    }

    async uploadImage(folder: string, file: Express.Multer.File): Promise<string> {
        const base = path.parse(file.originalname).name.replace(/\s/g, "");
        const extension = path.parse(file.originalname).ext;
        const filename = `${base}${uuid()}${extension}`;

        this.logger.debug(`Uploading image="${filename}" to folder="${folder}"`, ImagesService.name);

        try {
            await this.client.send(new PutObjectCommand({
                Bucket: this.bucket,
                Key: this.key(folder, filename),
                Body: file.buffer,
                ContentType: file.mimetype,
            }));

            this.logger.log(`Uploaded image="${filename}" to folder="${folder}"`, ImagesService.name);
            return filename;
        } catch (error) {
            this.logger.error(
                `Failed to upload image to folder "${folder}": ${error.message}`,
                error.stack,
                ImagesService.name
            );
            throw new InternalServerErrorException("Error while uploading image");
        }
    }

    async getImagesFromFolder(folder: string): Promise<string[]> {
        this.logger.debug(`Listing images in folder="${folder}"`, ImagesService.name);

        const prefix = `${folder}/`;

        try {
            const filenames: string[] = [];
            let continuationToken: string | undefined;

            do {
                const response = await this.client.send(new ListObjectsV2Command({
                    Bucket: this.bucket,
                    Prefix: prefix,
                    ContinuationToken: continuationToken,
                }));

                for (const object of response.Contents ?? []) {
                    if (object.Key && object.Key !== prefix) {
                        filenames.push(object.Key.slice(prefix.length));
                    }
                }

                continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
            } while (continuationToken);

            return filenames;
        } catch (error) {
            this.logger.error(
                `Failed to list images in folder "${folder}": ${error.message}`,
                error.stack,
                ImagesService.name
            );
            throw new InternalServerErrorException("Error while reading images");
        }
    }

    async deleteImage(folder: string, image: string): Promise<void> {
        if (!image) return;

        this.logger.debug(`Deleting image="${image}" from folder="${folder}"`, ImagesService.name);

        try {
            await this.client.send(new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: this.key(folder, image),
            }));
            this.logger.log(`Deleted image="${image}" from folder="${folder}"`, ImagesService.name);
        } catch (error) {
            this.logger.error(
                `Failed to delete image "${image}" from folder "${folder}": ${error.message}`,
                error.stack,
                ImagesService.name
            );
            throw new InternalServerErrorException("Error while deleting image from folder");
        }
    }
}
