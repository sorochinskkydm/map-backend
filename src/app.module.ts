import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppConfigModule } from '@infra/config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '@infra/postgres/typeorm.config';
import { ApiModule } from '@api/api.module';
import { AppLoggerMiddleware } from '@shared/middlewares';
import { AppWebSocketModule } from '@infra/websocket/websocket.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { SignatureInterceptor } from '@shared/interceptors';
import { MailModule } from '@infra/mail/mail.module';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppThrottlerModule } from '@infra/throttler/appThrottler.module';

@Module({
    imports: [
        AppThrottlerModule,
        AppConfigModule,
        TypeOrmModule.forRootAsync(typeOrmConfig),
        ApiModule,
        AppWebSocketModule,
        MailModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: SignatureInterceptor,
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AppLoggerMiddleware).forRoutes('*');
    }
}
