import { Module } from '@nestjs/common';
import { AppConfigModule } from '@infra/config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig, { typeOrmConfig } from '@infra/postgres/typeorm.config';
import { ApiModule } from '@api/api.module';

@Module({
    imports: [AppConfigModule, TypeOrmModule.forRootAsync(typeOrmConfig), ApiModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
