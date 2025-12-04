import { HttpException, HttpStatus } from '@nestjs/common';

import type { ErrorOutputDto } from '@shared/dtos';

export class ErrorWithKeyException extends HttpException {
    constructor(error: ErrorOutputDto, message?: string) {
        super(message ? { ...error, message } : error, HttpStatus.BAD_REQUEST);
    }
}
