import { RequestEntity } from '@infra/postgres/entities';
import { AppWebSocketGateway } from '@infra/websocket/websocket.gateway';
import { RequestOutputDto } from './dtos';

export class RequestGateway extends AppWebSocketGateway {
    public async sendOrder(request: RequestEntity) {
        const login = process.env.ADMIN_LOGIN!;
        const result = await this.mapper.mapAsync(request, RequestEntity, RequestOutputDto);
        this.sendToUser(login, 'newRequest', result);
    }
}
