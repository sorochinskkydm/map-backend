import type { ValueTransformer } from 'typeorm';

export class ColumnNumericTransformer implements ValueTransformer {
    public to(value: number | null) {
        if (value === null || value === undefined) {
            return null;
        }
        return value;
    }

    public from(value: string | number | null) {
        if (value === null || value === undefined) {
            return null;
        }
        if (typeof value === 'string') {
            const parsed = parseFloat(value);
            return isNaN(parsed) ? null : parsed;
        }
        return value;
    }
}
