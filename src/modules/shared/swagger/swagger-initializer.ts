import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import basicAuth from 'express-basic-auth';

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
            .addApiKey(
                {
                    type: 'apiKey',
                    name: 'x-signature',
                    in: 'header',
                    description: 'Enter your signature',
                },
                'Signature',
            )
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup(this.configService.swaggerDocPath, app, document, {
            swaggerOptions: { persistAuthorization: true },
        });

        this.addApiKey(document);

        app.use(
            this.configService.scalarDocPath,
            apiReference({
                content: document,
            }),
        );
    }

    private addApiKey(document: OpenAPIObject): void {
        Object.entries(document.paths).forEach(([_, methods]) => {
            Object.entries(methods).forEach(([_, operation]) => {
                if (operation && operation.security) {
                    operation.security.forEach((secRequirement) => {
                        secRequirement['Signature'] = [];
                    });
                } else if (operation) {
                    operation.security = [{ Signature: [] }];
                }
            });
        });
    }
}
