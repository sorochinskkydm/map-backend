import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppConfigModule } from '@infra/config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig, { typeOrmConfig } from '@infra/postgres/typeorm.config';
import { ApiModule } from '@api/api.module';
import { AppLoggerMiddleware } from '@shared/middlewares';

@Module({
    imports: [AppConfigModule, TypeOrmModule.forRootAsync(typeOrmConfig), ApiModule],
    controllers: [],
    providers: [],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AppLoggerMiddleware).forRoutes('*');
    }
}
