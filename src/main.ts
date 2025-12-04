import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { AppConfigService } from '@infra/config/config.service';
import { AllExceptionsFilter } from '@shared/filters';
import { SwaggerInitializer } from '@shared/swagger/swagger-initializer';

async function bootstrap() {
    initializeTransactionalContext();
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('MAIN');
    const configService = app.get(AppConfigService);

    app.useGlobalFilters(new AllExceptionsFilter());
    app.enableVersioning({
        type: VersioningType.URI,
    });
    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        }),
    );
    app.setGlobalPrefix('api');

    const swaggerInitializer = new SwaggerInitializer(configService);
    swaggerInitializer.init(app);

    await app.listen(configService.serverPort, '0.0.0.0');
    const url = await app.getUrl();

    logger.verbose(`Server started at ${url}`);
    logger.verbose(`Swagger available on ${url}${configService.swaggerDocPath}`);
    logger.verbose(`Scalar available on ${url}${configService.scalarDocPath}`);
}
bootstrap();
