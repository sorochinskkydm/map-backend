import { AutoMap } from '@automapper/classes';
import { ObjectShortInfoOutputDto } from './object-short-info.output.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ExampleValueEnum } from '@shared/enums';

export class ListObjectOutputDto extends ObjectShortInfoOutputDto {}
