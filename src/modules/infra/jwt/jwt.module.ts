import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AppConfigModule } from '@infra/config/config.module';
import { AppJwtService } from './jwt.service';
import { AppConfigService } from '@infra/config/config.service';

@Global()
@Module({
    imports: [
        AppConfigModule,
        JwtModule.registerAsync({
            useFactory: (configService: AppConfigService) => ({
                secret: configService.jwtAccessSecretKey,
                signOptions: { expiresIn: configService.jwtAccessTtl },
            }),
            inject: [AppConfigService],
        }),
    ],
    providers: [AppJwtService],
    exports: [AppJwtService],
})
export class AppJwtModule {}
