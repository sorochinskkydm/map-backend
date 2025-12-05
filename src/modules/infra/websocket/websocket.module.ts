import { Module } from '@nestjs/common';

import { AppWebSocketDocsController } from './websocket.controller';
import { AppWebSocketGateway } from './websocket.gateway';

@Module({
    controllers: [AppWebSocketDocsController],
    providers: [AppWebSocketGateway],
    exports: [AppWebSocketGateway],
})
export class AppWebSocketModule {}
