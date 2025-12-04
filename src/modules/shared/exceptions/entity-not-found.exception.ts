import type { Type } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

import { ERROR } from '@shared/constants';

export class EntityNotFoundException extends HttpException {
    constructor(entity: Type | string, fieldValue: any = null, field = 'id') {
        const entityName = typeof entity === 'string' ? entity : entity.name;
        const response = {
            message: `${entityName} ${fieldValue ? `with ${field} = '${fieldValue}' ` : ''}not found`,
            code: ERROR.NOT_FOUND.code,
            object: entityName,
            field: fieldValue ? field : undefined,
        };
        super(response, HttpStatus.BAD_REQUEST);
    }
}
