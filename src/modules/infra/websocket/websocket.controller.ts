import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('WebSocket')
@Controller({ path: process.env.WEBSOCKET_PATH || 'docs/ws' })
export class AppWebSocketDocsController {
    @ApiOperation({ summary: 'Документация по WS' })
    @Get()
    getDocs() {
        return {
            description: 'WebSocket API документация',
            events: [
                {
                    name: 'connection',
                    description: 'Успешное подключение',
                    payload: 'string',
                },
                {
                    name: 'newRequest',
                    description: 'Новая заявка',
                    payload: 'RequestOutputDto',
                },
            ],
            authentication:
                'Токен должен быть передан в handshake.auth.token или Authorization header',
        };
    }
}
