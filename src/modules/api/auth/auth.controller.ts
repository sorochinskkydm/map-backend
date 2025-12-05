import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthTokenOutputDto, LoginInputDto, RefreshTokenInputDto } from './dtos';

@ApiTags('Авторизация')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Авторизация' })
    @ApiResponse({ type: AuthTokenOutputDto, status: HttpStatus.OK })
    @Post('sign-in')
    public async login(@Body() dto: LoginInputDto) {
        return this.authService.login(dto);
    }

    @ApiOperation({ summary: 'Обновление токена' })
    @ApiResponse({ type: AuthTokenOutputDto, status: HttpStatus.OK })
    @Post('refresh-token')
    public async refreshToken(@Body() dto: RefreshTokenInputDto) {
        return this.authService.refreshToken(dto);
    }

    @ApiOperation({ summary: 'Выход из аккаунта' })
    @ApiResponse({ type: Boolean, status: HttpStatus.OK })
    @Post('sign-out')
    public async logout() {
        return this.authService.logout();
    }
}
