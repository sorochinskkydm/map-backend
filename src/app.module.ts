import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppConfigModule } from '@infra/config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig, { typeOrmConfig } from '@infra/postgres/typeorm.config';
import { ApiModule } from '@api/api.module';
import { AppLoggerMiddleware } from '@shared/middlewares';
import { AppWebSocketModule } from '@infra/websocket/websocket.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SignatureInterceptor } from '@shared/interceptors';

@Module({
    imports: [
        AppConfigModule,
        TypeOrmModule.forRootAsync(typeOrmConfig),
        ApiModule,
        AppWebSocketModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: SignatureInterceptor,
        },
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AppLoggerMiddleware).forRoutes('*');
    }
}
