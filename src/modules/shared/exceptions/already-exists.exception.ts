import type { Type } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

import { ERROR } from '@shared/constants';

export class AlreadyExistsException extends HttpException {
    constructor(entity: Type | string, fieldValue: string, field: string) {
        const entityName = typeof entity === 'string' ? entity : entity.name;
        const response = {
            message: `${entityName} ${fieldValue ? `with ${field} = '${fieldValue}' ` : ''}already exists`,
            code: ERROR.ALREADY_EXISTS.code,
            object: entityName,
            field: fieldValue ? field : undefined,
        };
        super(response, HttpStatus.BAD_REQUEST);
    }
}
