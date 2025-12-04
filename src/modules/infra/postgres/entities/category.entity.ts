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

    @OneToMany(() => ObjectEntity, (object) => object.category)
    objects: ObjectEntity[];

    @OneToMany(() => RequestEntity, (request) => request.category)
    requests: RequestEntity[];

    @ManyToOne(() => FileEntity, (file) => file.categoryIcon)
    image: FileEntity;

    @AutoMap()
    @CreateDateColumn()
    createdAt: Date;

    @AutoMap()
    @UpdateDateColumn()
    updatedAt: Date;
}
