import { AutoMap } from '@automapper/classes';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
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
import { ObjectEntity } from './object.entity';

@Entity('category_objects')
export class CategoryObjectEntity {
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @AutoMap()
    @Column({ type: 'int', default: 0 })
    sort: number;

    @ManyToOne(() => CategoryEntity, (category) => category.objects, {
        onDelete: 'CASCADE',
    })
    category: CategoryEntity;

    @OneToOne(() => ObjectEntity, (object) => object.categoryObject, { onDelete: 'CASCADE' })
    @JoinColumn()
    object: ObjectEntity;

    @AutoMap()
    @CreateDateColumn()
    createdAt: Date;

    @AutoMap()
    @UpdateDateColumn()
    updatedAt: Date;
}
