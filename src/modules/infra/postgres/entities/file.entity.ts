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
    @Column({ type: 'int', nullable: true })
    width: number | null;

    @AutoMap()
    @Column({ type: 'int', nullable: true })
    height: number | null;

    @AutoMap()
    @CreateDateColumn()
    createdAt: Date;

    @AutoMap()
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => CategoryEntity, (category) => category.image)
    categoryIcon: CategoryEntity[];

    @OneToMany(() => RequestImageEntity, (requestImage) => requestImage.file)
    requestImages: RequestImageEntity[];

    @OneToMany(() => ObjectImageEntity, (objectImage) => objectImage.file)
    objectImages: ObjectImageEntity[];

    @OneToMany(() => ClusterImageEntity, (clusterImage) => clusterImage.file)
    clusterImages: ClusterImageEntity[];
}
