import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfigService } from '@infra/config/config.service';

@Injectable()
export class AppJwtService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: AppConfigService,
    ) {}
}
