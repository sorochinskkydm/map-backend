import { AutoMap } from '@automapper/classes';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ObjectEntity } from './object.entity';
import { RequestEntity } from './request.entity';
import { ClusterImageEntity } from './cluster-image.entity';

@Entity('clusters')
export class ClusterEntity {
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @AutoMap()
    @Column({ nullable: true })
    address: string;

    @AutoMap()
    @Column()
    name: string;

    @AutoMap()
    @Column({ nullable: true })
    url: string;

    @AutoMap()
    @Column()
    description: string;

    @AutoMap()
    @Column({ type: 'int', default: 0 })
    sort: number;

    @AutoMap()
    @Column({ type: 'json', default: '{}' })
    options: JSON;

    @OneToMany(() => ObjectEntity, (object) => object.cluster)
    objects: ObjectEntity[];

    @OneToMany(() => RequestEntity, (request) => request.cluster)
    requests: RequestEntity[];

    @OneToMany(() => ClusterImageEntity, (image) => image.cluster)
    images: ClusterImageEntity[];

    @AutoMap()
    @CreateDateColumn()
    createdAt: Date;

    @AutoMap()
    @UpdateDateColumn()
    updatedAt: Date;
}
