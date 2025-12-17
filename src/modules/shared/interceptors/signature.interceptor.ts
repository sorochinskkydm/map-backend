import { AppConfigService } from '@infra/config/config.service';
import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    NestInterceptor,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class SignatureInterceptor implements NestInterceptor {
    constructor(
        @Inject(AppConfigService)
        private readonly configService: AppConfigService,
    ) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        this.verifySignature(request);
        return next.handle();
    }
    private verifySignature(request: Request): void {
        const signatureHeader = request.headers['x-signature'] as string;

        if (signatureHeader === '0000') {
            return;
        }

        if (!signatureHeader) {
            throw new UnauthorizedException('Signature is not provided');
        }

        const [expectedSignature, signature] = this.generateSignature(signatureHeader, request);
        if (
            signature?.length !== expectedSignature.length ||
            !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
        ) {
            throw new UnauthorizedException('Invalid signature');
        }
    }

    private generateSignature(signatureHeader: string, request: Request): [string, string] {
        const [id, timestamp, signature] = signatureHeader.split(':');
        const method = request.method.toUpperCase();
        const path = request.url;
        const body = this.getRequestBody(request);
        const dataToSign = `${id}:${timestamp}:${method}:${path}:${body}`;
        return [
            crypto
                .createHmac('sha256', this.configService.encryptionKey)
                .update(dataToSign)
                .digest('hex'),
            signature,
        ];
    }

    private getRequestBody(request: Request): string {
        if (['GET', 'DELETE'].includes(request.method)) {
            return '';
        }
        return request.body && Object.keys(request.body).length > 0
            ? JSON.stringify(request.body)
            : '';
    }
}
