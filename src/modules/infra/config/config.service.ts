import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService) {}
    //DB
    get dbHost(): string {
        return this.configService.getOrThrow<string>('DB_HOST');
    }
    get dbPort(): number {
        return this.configService.getOrThrow<number>('DB_PORT');
    }
    get dbLogin(): string {
        return this.configService.getOrThrow<string>('DB_LOGIN');
    }
    get dbPassword(): string {
        return this.configService.getOrThrow<string>('DB_PASSWORD');
    }
    get dbName(): string {
        return this.configService.getOrThrow<string>('DB_NAME');
    }

    //SWAGGER
    get swaggerDocLogin(): string {
        return this.configService.getOrThrow<string>('SWAGGER_LOGIN');
    }
    get swaggerDocPassword(): string {
        return this.configService.getOrThrow<string>('SWAGGER_PASSWORD');
    }
    get swaggerDocPath(): string {
        return this.configService.get<string>('SWAGGER_PATH', '/docs/api');
    }
    get scalarDocPath(): string {
        return this.configService.get<string>('SCALAR_PATH', '/docs/scalar');
    }
    get throttlerTtl(): number {
        return this.configService.get<number>('THROTTLER_TTL', 1);
    }
    get throttlerLimit(): number {
        return this.configService.get<number>('THROTTLER_LIMIT', 10);
    }

    //JWT
    get jwtAccessTtl(): number {
        return this.configService.get<number>('JWT_ACCESS_TTL', 1);
    }
    get jwtAccessSecretKey(): string {
        return this.configService.getOrThrow<string>('JWT_ACCESS_SECRET_KEY');
    }
    get jwtRefreshTtl(): number {
        return this.configService.get<number>('JWT_REFRESH_TTL', 168);
    }
    get jwtRefreshSecretKey(): string {
        return this.configService.getOrThrow<string>('JWT_REFRESH_SECRET_KEY');
    }

    //AWS
    get awsAccessKeyId(): string {
        return this.configService.get<string>('AWS_ACCESS_KEY_ID', '');
    }
    get awsSecretAccessKey(): string {
        return this.configService.get<string>('AWS_SECRET_ACCESS_KEY', '');
    }
    get awsBucket(): string {
        return this.configService.get<string>('AWS_BUCKET', '');
    }
    get awsEndpoint(): string {
        return this.configService.get<string>('AWS_ENDPOINT', '');
    }

    //AUTH

    get adminLogin(): string {
        return this.configService.getOrThrow<string>('ADMIN_LOGIN');
    }
    get adminPassword(): string {
        return this.configService.getOrThrow<string>('ADMIN_PASSWORD');
    }
}
