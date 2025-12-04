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
import { RequestImageEntity } from './request-image.entity';
import { ObjectImageEntity } from './object-image.entity';
import { ClusterImageEntity } from './cluster-image.entity';
import { CategoryEntity } from './category.entity';

@Entity('files')
export class FileEntity {
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @AutoMap()
    @Column()
    url: string;

    @AutoMap()
    @Column()
    type: string;

    @AutoMap()
    @Column({ default: 0 })
    size: number;

    @AutoMap()
    @CreateDateColumn()
    createdAt: Date;

    @AutoMap()
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => CategoryEntity, (category) => category.image, {
        onDelete: 'SET NULL',
    })
    categoryIcon: CategoryEntity[];

    @OneToMany(() => RequestImageEntity, (requestImage) => requestImage.file, {
        onDelete: 'CASCADE',
    })
    requestImages: RequestImageEntity[];

    @OneToMany(() => ObjectImageEntity, (objectImage) => objectImage.file, {
        onDelete: 'CASCADE',
    })
    objectImages: ObjectImageEntity[];

    @OneToMany(() => ClusterImageEntity, (clusterImage) => clusterImage.file, {
        onDelete: 'CASCADE',
    })
    clusterImages: ClusterImageEntity[];
}
