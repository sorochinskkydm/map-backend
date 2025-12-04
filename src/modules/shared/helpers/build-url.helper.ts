import { join } from 'path';
import { URL } from 'url';

export const buildUrl = (baseUrl: string, ...paths: string[]): string => {
    return new URL(join(...paths), baseUrl).href;
};
