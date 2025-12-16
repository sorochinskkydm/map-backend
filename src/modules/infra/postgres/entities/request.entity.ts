import { AutoMap } from '@automapper/classes';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    Point,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { RequestStatusEnum } from '@shared/enums';
import { ClusterEntity } from './cluster.entity';
import { RequestImageEntity } from './request-image.entity';
import { ColumnNumericTransformer } from '../transformers';

@Entity('requests')
export class RequestEntity {
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @AutoMap()
    @Column()
    organizationName: string;

    @AutoMap()
    @Column()
    author: string;

    @AutoMap()
    @Column()
    address: string;

    @AutoMap()
    @Column({ nullable: true })
    url: string;

    @AutoMap()
    @Column()
    phoneNumber: string;

    @AutoMap()
    @Column()
    email: string;

    @AutoMap()
    @Column({ type: 'enum', enum: RequestStatusEnum })
    status: RequestStatusEnum;

    @AutoMap()
    @Column()
    description: string;

    @AutoMap()
    @Column({ type: 'decimal', nullable: true, transformer: new ColumnNumericTransformer() })
    latitude: number;

    @AutoMap()
    @Column({ type: 'decimal', nullable: true, transformer: new ColumnNumericTransformer() })
    longitude: number;

    @ManyToOne(() => ClusterEntity, (cluster) => cluster.requests, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    cluster: ClusterEntity;

    @ManyToOne(() => CategoryEntity, (category) => category.requests, {
        onDelete: 'CASCADE',
    })
    category: CategoryEntity;

    @OneToMany(() => RequestImageEntity, (image) => image.request)
    images: RequestImageEntity[];

    @AutoMap()
    @CreateDateColumn()
    createdAt: Date;

    @AutoMap()
    @UpdateDateColumn()
    updatedAt: Date;
}
