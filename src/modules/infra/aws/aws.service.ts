import { join } from 'path';
import { inspect } from 'util';

import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { v4 as uuidv4 } from 'uuid';

import { AppConfigService } from '@infra/config/config.service';
import { ErrorWithKeyException } from '@shared/exceptions';
import { ERROR } from '@shared/constants';
import { AclTypeEnum } from '@shared/enums/acl-type.enum';

@Injectable()
export class AwsService {
    private readonly logger = new Logger(AwsService.name);
    private readonly s3: AWS.S3;
    private readonly bucketName: string;

    constructor(private readonly configService: AppConfigService) {
        this.s3 = new AWS.S3({
            endpoint: this.configService.awsEndpoint,
            accessKeyId: this.configService.awsAccessKeyId,
            secretAccessKey: this.configService.awsSecretAccessKey,
        });

        this.bucketName = this.configService.awsBucket;
    }

    public async uploadFile(
        path: string,
        file: Express.Multer.File,
    ): Promise<[string, ManagedUpload.SendData]> {
        try {
            const filename = this.generateFileName(file.originalname);
            const key = join(path, filename);

            const params: AWS.S3.PutObjectRequest = {
                Body: file.buffer,
                Bucket: this.bucketName,
                Key: key,
                ACL: AclTypeEnum.AUTHENTICATED_READ,
                ContentType: file.mimetype,
            };

            const uploadResult = await this.s3.upload(params).promise();
            return [key, uploadResult];
        } catch (error) {
            this.logger.error(`Failed to upload file: ${error}`);
            throw new ErrorWithKeyException(ERROR.FAILED_UPLOAD, inspect(error));
        }
    }

    public async getSignedUrl(key: string, expires: number = 3600): Promise<string> {
        try {
            const params = { Bucket: this.bucketName, Key: key, Expires: expires };
            return this.s3.getSignedUrlPromise('getObject', params);
        } catch (error) {
            this.logger.error(`Failed to generate signed URL for key ${key}: ${error}`);
            throw new ErrorWithKeyException(ERROR.FAILED_GET_FILE, inspect(error));
        }
    }

    public async deleteFile(key: string): Promise<AWS.S3.DeleteObjectOutput | undefined> {
        try {
            const params: AWS.S3.DeleteObjectRequest = {
                Bucket: this.bucketName,
                Key: key,
            };

            return await this.s3.deleteObject(params).promise();
        } catch (error) {
            this.logger.error(`deleteFile(): ${inspect(error)}`);
            return;
        }
    }

    private generateFileName(fileName: string) {
        const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
        return uuidv4() + ext;
    }
}
