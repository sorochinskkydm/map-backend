import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService) {}
    get appEnv(): string {
        return this.configService.getOrThrow<string>('APP_ENV');
    }
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

    //SERVER
    get serverPort(): number {
        return this.configService.get<number>('SERVER_PORT', 3000);
    }

    //JWT
    get jwtAccessSecretKey(): string {
        return this.configService.getOrThrow<string>('JWT_ACCESS_SECRET_KEY');
    }
    get jwtRefreshSecretKey(): string {
        return this.configService.getOrThrow<string>('JWT_REFRESH_SECRET_KEY');
    }
    get jwtAccessTtl(): string {
        return this.configService.getOrThrow<string>('JWT_ACCESS_TTL');
    }
    get jwtRefreshTtl(): string {
        return this.configService.getOrThrow<string>('JWT_REFRESH_TTL');
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
}
