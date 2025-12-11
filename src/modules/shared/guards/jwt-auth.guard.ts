import { AuthService } from '@api/auth/auth.service';
import { AppJwtService } from '@infra/jwt/jwt.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: AppJwtService,
        private readonly authService: AuthService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const accessToken = request.headers['authorization'].replace('Bearer ', '');

            console.log(accessToken, '<============== guard accessToken');

            if (!accessToken) {
                throw new UnauthorizedException('Token is not provided');
            }

            console.log(accessToken, '<============== guard');

            const adminToken = await this.authService.check(accessToken);

            console.log(adminToken, '<============== guard adminToken');

            if (!adminToken) {
                throw new UnauthorizedException('Token is not valid');
            }

            console.log(accessToken, '<============== guard');

            await this.jwtService.verifyAccessToken(accessToken);

            console.log(accessToken, '<============== guard verify');
            return true;
        } catch (error) {
            throw new UnauthorizedException('Token is not valid or is not provided');
        }
    }
}
