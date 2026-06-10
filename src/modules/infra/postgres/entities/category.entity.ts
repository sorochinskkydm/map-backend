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
import { FileEntity } from './file.entity';
import { CategoryObjectEntity } from './category-object.entity';

@Entity('categories')
export class CategoryEntity {
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @AutoMap()
    @Column({ unique: true })
    name: string;

    @AutoMap()
    @Column({ type: 'int', default: 0 })
    sort: number;

    @OneToMany(() => CategoryObjectEntity, (categoryObject) => categoryObject.category)
    objects: CategoryObjectEntity[];

    @OneToMany(() => RequestEntity, (request) => request.category)
    requests: RequestEntity[];

    @ManyToOne(() => FileEntity, (file) => file.categoryIcon, {
        onDelete: 'SET NULL',
    })
    image: FileEntity;

    @AutoMap()
    @CreateDateColumn()
    createdAt: Date;

    @AutoMap()
    @UpdateDateColumn()
    updatedAt: Date;
}
