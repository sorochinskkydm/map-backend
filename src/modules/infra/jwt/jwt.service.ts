import { inspect } from 'util';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfigService } from '@infra/config/config.service';
import { AuthTokenOutputDto } from '@api/auth/dtos/auth-tokens.output.dto';
import { TokenPayload } from '@shared/interfaces';

@Injectable()
export class AppJwtService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: AppConfigService,
    ) {}

    async generateTokens(payload: TokenPayload): Promise<AuthTokenOutputDto> {
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.jwtAccessSecretKey,
            expiresIn: `${this.configService.jwtAccessTtl}H`,
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.jwtRefreshSecretKey,
            expiresIn: `${this.configService.jwtRefreshTtl}H`,
        });

        return { accessToken, refreshToken };
    }

    async verifyAccessToken(token: string): Promise<TokenPayload> {
        try {
            const WS_SECRET_ACCESS_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';
            const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
                secret: this.configService.jwtAccessSecretKey || WS_SECRET_ACCESS_KEY,
            });

            return payload;
        } catch (error) {
            throw new UnauthorizedException('Token token is not valid');
        }
    }

    async verifyRefreshToken(token: string): Promise<TokenPayload> {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.jwtRefreshSecretKey,
            });
        } catch (error) {
            throw new UnauthorizedException('Refresh token is not valid');
        }
    }
}
