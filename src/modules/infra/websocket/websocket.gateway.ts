/* eslint-disable no-param-reassign */
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { AppJwtService } from '@infra/jwt/jwt.service';

@ApiTags('WebSocket')
@WebSocketGateway({
    cors: { origin: '*' },
    transports: ['websocket'],
})
export class AppWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private logger = new Logger(AppWebSocketGateway.name);
    private clients: Map<string, Socket> = new Map();

    @WebSocketServer()
    server: Server;

    constructor(
        private jwtService: AppJwtService,
        @InjectMapper() protected readonly mapper: Mapper,
    ) {}

    async handleConnection(client: Socket) {
        try {
            const token = this.getTokenFromSocket(client);
            if (!token) {
                throw new Error('No token provided');
            }

            const payload = await this.jwtService.verifyAccessToken(token);
            const login = payload.login;
            if (!login) {
                throw new Error('Invalid token payload');
            }

            this.clients.set(login, client);
            client.data.login = login;
            this.logger.log(`Client connected: ${client.id}`);

            client.emit('connection', `Successfully connected: ${client.id}`);
        } catch (error) {
            this.logger.error(`Connection error: ${error.message}`);
            client.emit('error', { message: 'Authentication failed' });
            client.disconnect(true);
        }
    }

    handleDisconnect(client: Socket) {
        this.clients.delete(client.data.login);
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    protected sendToUser(login: string, event: string, data: any) {
        const client = this.clients.get(login);
        if (client) {
            client.emit(event, data);
        }
    }

    private getTokenFromSocket(client: Socket): string | null {
        return (
            client.handshake.auth?.token ||
            client.handshake.headers?.authorization?.split(' ')[1] ||
            null
        );
    }
}
