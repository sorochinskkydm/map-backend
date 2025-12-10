import type { Type } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

import { ERROR } from '@shared/constants';

export class UploadFileException extends HttpException {
    constructor(file: Express.Multer.File, err: any) {
        const response = {
            message: `Failed to upload file ${file.originalname}, error: ${err}`,
        };
        super(response, HttpStatus.BAD_REQUEST);
    }
}
