import { AutoMap } from '@automapper/classes';
import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RequestEntity } from './request.entity';
import { FileEntity } from './file.entity';

@Entity('request_images')
@Index(['request', 'file'], { unique: true })
export class RequestImageEntity {
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => RequestEntity, (request) => request.images, {
        onDelete: 'CASCADE',
    })
    request: RequestEntity;

    @ManyToOne(() => FileEntity, (file) => file.requestImages, {
        onDelete: 'CASCADE',
    })
    file: FileEntity;
}
