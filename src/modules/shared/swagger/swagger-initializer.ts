import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import * as basicAuth from 'express-basic-auth';

import type { AppConfigService } from '@infra/config/config.service';

export class SwaggerInitializer {
    private configService: AppConfigService;

    constructor(configService: AppConfigService) {
        this.configService = configService;
    }

    init(app: INestApplication) {
        this.configureBasicAuth(app);
        this.initializeSwagger(app);
    }

    private configureBasicAuth(app: INestApplication) {
        app.use(
            ['/docs', this.configService.swaggerDocPath, this.configService.scalarDocPath],
            basicAuth({
                challenge: true,
                users: {
                    [this.configService.swaggerDocLogin]: this.configService.swaggerDocPassword,
                },
            }),
        );
    }

    private initializeSwagger(app: INestApplication) {
        const securityScheme: any = {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'Authorization',
            description: 'Enter JWT token',
            in: 'header',
        };
        const config = new DocumentBuilder()
            .setTitle('nnmap.service')
            .setDescription('Креативная инфраструктура Нижнего Новгорода')
            .setVersion('1.0')
            .addBearerAuth(securityScheme, 'Authorization')
            .addBearerAuth(securityScheme, 'RefreshToken')
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup(this.configService.swaggerDocPath, app, document, {
            swaggerOptions: { persistAuthorization: true },
        });

        app.use(
            this.configService.scalarDocPath,
            apiReference({
                content: document,
            }),
        );
    }
}
