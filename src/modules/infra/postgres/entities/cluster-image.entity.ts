import { AutoMap } from '@automapper/classes';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { FileEntity } from './file.entity';
import { ClusterEntity } from './cluster.entity';
@Entity('cluster_images')
@Index(['cluster', 'file'], { unique: true })
export class ClusterImageEntity {
    @PrimaryGeneratedColumn('uuid')
    @AutoMap()
    id: string;

    @ManyToOne(() => ClusterEntity, (cluster) => cluster.images, {
        onDelete: 'CASCADE',
    })
    cluster: ClusterEntity;

    @ManyToOne(() => FileEntity, (file) => file.clusterImages, {
        onDelete: 'CASCADE',
    })
    file: FileEntity;
}
