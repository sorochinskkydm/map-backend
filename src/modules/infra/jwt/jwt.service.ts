import { inspect } from 'util';

import { Injectable } from '@nestjs/common';
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

    async generateToken(payload: TokenPayload): Promise<AuthTokenOutputDto> {
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.jwtAccessSecretKey,
            expiresIn: this.configService.jwtAccessTtl,
        });

        return { accessToken };
    }

    async verifyAccessToken(token: string): Promise<TokenPayload> {
        try {
            const WS_SECRET_ACCESS_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';
            const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
                secret: this.configService.jwtAccessSecretKey || WS_SECRET_ACCESS_KEY,
            });

            return payload;
        } catch (error) {
            throw new Error(`Invalid token: ${inspect(error)}`);
        }
    }
}
