import { AppJwtService } from '@infra/jwt/jwt.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthTokenOutputDto, LoginInputDto } from './dtos';
import { AppConfigService } from '@infra/config/config.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminTokenEntity } from '@infra/postgres/entities';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { Request } from 'express';

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

        const { accessToken, refreshToken } = await this.jwtService.generateTokens({
            login,
            role: 'admin',
        });
        const adminToken = this.adminTokenRepository.create({ login, accessToken, refreshToken });
        await this.adminTokenRepository.save(adminToken);
        return { accessToken, refreshToken };
    }

    public async refreshToken(request: Request): Promise<AuthTokenOutputDto> {
        const login = this.configService.adminLogin;
        const oldRefreshToken = request.headers.authorization!.replace('Bearer ', '');
        const payload = await this.jwtService.verifyRefreshToken(oldRefreshToken);

        const adminToken = await this.adminTokenRepository.findOne({
            where: { login: payload.login },
        });

        if (!adminToken) {
            throw new UnauthorizedException('RefreshToken is not valid');
        }

        await this.adminTokenRepository.delete({ login });

        const { accessToken, refreshToken } = await this.jwtService.generateTokens({
            login: login,
            role: 'admin',
        });

        const newAdminToken = this.adminTokenRepository.create({
            login,
            accessToken,
            refreshToken,
        });
        await this.adminTokenRepository.save(newAdminToken);
        return { accessToken, refreshToken };
    }

    public async logout(): Promise<Boolean> {
        //не удаляет
        const envLogin = this.configService.adminLogin;
        const result = await this.adminTokenRepository.delete({ login: envLogin });
        return result.affected === 1;
    }

    public async check(token: string): Promise<string> {
        console.log(token, '<============== сheck token');
        const adminToken = await this.adminTokenRepository.findOne({
            where: [{ accessToken: token }, { refreshToken: token }],
        });

        console.log(adminToken, '<============== сheck adminToken');

        if (!adminToken) {
            throw new UnauthorizedException('Token is not valid');
        }

        console.log(token, '<============== сheck');

        return token;
    }
}
