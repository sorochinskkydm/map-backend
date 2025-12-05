import { AuthService } from '@api/auth/auth.service';
import { isDateConstructor } from '@automapper/core';
import { AppJwtService } from '@infra/jwt/jwt.service';
import { AdminTokenEntity } from '@infra/postgres/entities';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class JwtRefreshAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: AppJwtService,
        private readonly authService: AuthService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const refreshToken = request.headers['authorization'].replace('Bearer ', '');

            if (!refreshToken) {
                throw new UnauthorizedException('RefreshToken is not provided');
            }

            const adminToken = await this.authService.check(refreshToken);

            if (!adminToken) {
                throw new UnauthorizedException('RefreshToken is not valid');
            }

            await this.jwtService.verifyRefreshToken(refreshToken);
            return true;
        } catch (error) {
            throw new UnauthorizedException('RefreshToken is not valid or is not provided');
        }
    }
}
