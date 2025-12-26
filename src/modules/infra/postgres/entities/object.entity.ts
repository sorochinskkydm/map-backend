import { AutoMap } from '@automapper/classes';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    Point,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { ClusterEntity } from './cluster.entity';
import { ObjectImageEntity } from './object-image.entity';
import { ColumnNumericTransformer } from '../transformers';
import { CategoryObjectEntity } from './category-object.entity';

@Entity('objects')
export class ObjectEntity {
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @AutoMap()
    @Column({ unique: true })
    name: string;

    @AutoMap()
    @Column()
    address: string;

    @AutoMap()
    @Column({ nullable: true })
    url: string;

    @AutoMap()
    @Column()
    description: string;

    @AutoMap()
    @Column({ type: 'boolean', default: true })
    isVisible: boolean;

    @AutoMap()
    @Column({ type: 'decimal', nullable: true, transformer: new ColumnNumericTransformer() })
    latitude: number;

    @AutoMap()
    @Column({ type: 'decimal', nullable: true, transformer: new ColumnNumericTransformer() })
    longitude: number;

    @ManyToOne(() => ClusterEntity, (cluster) => cluster.objects, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    cluster: ClusterEntity;

    @OneToOne(() => CategoryObjectEntity, (categoryObject) => categoryObject.object, {
        onDelete: 'CASCADE',
    })
    categoryObject: CategoryObjectEntity;

    @OneToMany(() => ObjectImageEntity, (image) => image.object, {
        nullable: true,
    })
    images: ObjectImageEntity[];

    @AutoMap()
    @CreateDateColumn()
    createdAt: Date;

    @AutoMap()
    @UpdateDateColumn()
    updatedAt: Date;
}
