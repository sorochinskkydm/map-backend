import { AppJwtService } from '@infra/jwt/jwt.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthTokenOutputDto, LoginInputDto } from './dtos';
import { AppConfigService } from '@infra/config/config.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminTokenEntity } from '@infra/postgres/entities';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AdminTokenEntity)
        private readonly adminTokenRepository: Repository<AdminTokenEntity>,
        private readonly jwtService: AppJwtService,
        private readonly configService: AppConfigService,
    ) {}

    @Transactional()
    public async login(dto: LoginInputDto): Promise<AuthTokenOutputDto> {
        const { login, password } = dto;

        const envLogin = this.configService.adminLogin;
        const envPassword = this.configService.adminPassword;

        if (login !== envLogin || password !== envPassword) {
            throw new UnauthorizedException('Login or password is incorrect');
        }

        await this.adminTokenRepository.delete({ login: envLogin });

        const { accessToken } = await this.jwtService.generateToken({ login, role: 'admin' });
        const adminToken = this.adminTokenRepository.create({ login, accessToken });
        this.adminTokenRepository.save(adminToken);
        return { accessToken };
    }

    public async logout(): Promise<Boolean> {
        const envLogin = this.configService.adminLogin;
        const result = await this.adminTokenRepository.delete({ login: envLogin });
        return result.affected === 1;
    }

    public async check(accessToken: string): Promise<string> {
        const adminToken = await this.adminTokenRepository.findOne({ where: { accessToken } });

        if (!adminToken) {
            throw new UnauthorizedException('Token is not valid');
        }

        return accessToken;
    }
}
