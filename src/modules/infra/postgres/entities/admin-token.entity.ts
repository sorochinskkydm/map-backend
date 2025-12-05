import { AutoMap } from '@automapper/classes';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admin_tokens')
export class AdminTokenEntity {
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @AutoMap()
    @Column()
    login: string;

    @AutoMap()
    @Column({ type: 'text' })
    accessToken: string;

    @AutoMap()
    @Column({ type: 'text' })
    refreshToken: string;
}
