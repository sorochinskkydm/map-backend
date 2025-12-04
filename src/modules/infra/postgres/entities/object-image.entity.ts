import { AutoMap } from '@automapper/classes';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { FileEntity } from './file.entity';
import { ObjectEntity } from './object.entity';
@Entity('object_images')
@Index(['object', 'file'], { unique: true })
export class ObjectImageEntity {
    @PrimaryGeneratedColumn('uuid')
    @AutoMap()
    id: string;

    @ManyToOne(() => ObjectEntity, (object) => object.images, {
        onDelete: 'CASCADE',
    })
    object: ObjectEntity;

    @ManyToOne(() => FileEntity, (file) => file.objectImages, {
        onDelete: 'CASCADE',
    })
    file: FileEntity;
}
