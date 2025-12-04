import { join } from 'path';

import { ConfigService } from '@nestjs/config';
import type { DataSourceOptions } from 'typeorm';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { AppConfigModule } from '@infra/config/config.module';
import { AppConfigService } from '@infra/config/config.service';
import { EnvironmentEnum } from '@shared/enums';

const configService = new AppConfigService(new ConfigService());

export const typeOrmConfig = {
    imports: [AppConfigModule],
    inject: [AppConfigService],
    useFactory: (configService: AppConfigService): DataSourceOptions => ({
        type: 'postgres',
        host: configService.dbHost,
        port: configService.dbPort,
        username: configService.dbLogin,
        password: configService.dbPassword,
        database: configService.dbName,
        entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
        logging: configService.appEnv === EnvironmentEnum.development,
        synchronize: false,
        migrations: [join(__dirname, 'migrations/*.js')],
        migrationsRun: true,
        migrationsTableName: 'typeorm_migrations',
        namingStrategy: new SnakeNamingStrategy(),
    }),
    dataSourceFactory: async (options: DataSourceOptions) => {
        return addTransactionalDataSource(new DataSource(options));
    },
};

export default new DataSource(typeOrmConfig.useFactory(configService));
