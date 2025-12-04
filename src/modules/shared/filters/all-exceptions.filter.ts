import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request } from 'express';

import { ResponseStatusEnum } from '../enums';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);
    constructor() {}

    catch(exception: any, host: ArgumentsHost) {
        this.logger.error(exception?.stack || JSON.stringify(exception));
        const ctx = host.switchToHttp();
        const req = ctx.getRequest();
        const res = ctx.getResponse();

        let status: number;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        const errorResponse = this.getErrorResponse(status, req, exception);
        res.status(status).json(errorResponse);
    }

    private getErrorResponse(status: number, req: Request, exception: any) {
        const errorCode = this.getErrorCode(exception);
        const error = {
            name: errorCode ? exception?.name : undefined,
            code: errorCode || exception?.name,
            object: exception?.response?.object,
            field: exception?.response?.field,
            message: this.getErrorMessage(exception),
        };

        return {
            status: ResponseStatusEnum.ERROR,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: req?.url,
            method: req?.method,
            params: req?.params,
            query: req?.query,
            error,
        };
    }

    private getErrorMessage(exception: any): string {
        let message = exception?.message;

        if (exception?.response?.message) {
            message = Array.isArray(exception?.response?.message)
                ? exception?.response?.message[0]
                : exception?.response?.message;
        }

        return message;
    }

    private getErrorCode(exception: any): string {
        let code = exception?.code;

        if (exception?.response?.code) {
            code = Array.isArray(exception?.response?.code)
                ? exception?.response?.code[0]
                : exception?.response?.code;
        }

        return code;
    }
}
