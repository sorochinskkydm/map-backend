import { AppJwtModule } from '@infra/jwt/jwt.module';
import { AdminTokenEntity } from '@infra/postgres/entities';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([AdminTokenEntity]), AppJwtModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
