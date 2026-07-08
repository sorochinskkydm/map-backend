import * as path from 'path';
import sharp from 'sharp';
import { DataSource } from 'typeorm';

/** Корень тома с загрузками (см. useStaticAssets в main.ts). */
export const UPLOADS_ROOT = '/usr/shared_media';
/** Префикс, под которым файлы раздаются в url'ах из БД. */
export const URL_PREFIX = '/api/uploads/';

/** URL из БД -> абсолютный путь к файлу на диске (или null для внешних ссылок). */
export function urlToLocalPath(url: string): string | null {
    const idx = url.indexOf(URL_PREFIX);
    if (idx === -1) return null;
    return path.join(UPLOADS_ROOT, url.slice(idx + URL_PREFIX.length));
}

/** Меняет имя файла в конце URL, сохраняя каталог (для превью в той же папке). */
export function replaceFileNameInUrl(url: string, fileName: string): string {
    return url.slice(0, url.lastIndexOf('/') + 1) + fileName;
}

/**
 * Самодостаточный DataSource из env (без Nest и алиасов) — как в остальных
 * скриптах. Читает те же переменные, что и приложение.
 */
export function createScriptDataSource(): DataSource {
    return new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_LOGIN,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [],
        synchronize: false,
    });
}

export interface CompressOptions {
    quality: number;
    /** Ограничить размеры (fit inside, без апскейла). Не задано — размеры не меняются. */
    width?: number;
    height?: number;
}

/**
 * Пережимает картинку тем же форматом (по расширению файла) и возвращает буфер.
 * Повторяет логику FileService.compressImage, чтобы скрипты и загрузка вели себя одинаково.
 */
export async function compressImage(
    buffer: Buffer,
    extension: string,
    { quality, width, height }: CompressOptions,
): Promise<Buffer> {
    let pipeline = sharp(buffer);

    if (width || height) {
        pipeline = pipeline.resize({ width, height, fit: 'inside', withoutEnlargement: true });
    }

    switch (extension.toLowerCase()) {
        case '.jpg':
        case '.jpeg':
            pipeline = pipeline.jpeg({ quality, mozjpeg: true });
            break;
        case '.png':
            pipeline = pipeline.png({ compressionLevel: 9, quality });
            break;
        case '.webp':
            pipeline = pipeline.webp({ quality });
            break;
        default:
            pipeline = pipeline.jpeg({ quality });
    }

    return pipeline.toBuffer();
}
