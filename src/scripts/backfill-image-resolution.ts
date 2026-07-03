/**
 * Разовый бэкфилл: проставляет width/height у уже загруженных картинок.
 *
 * Файлы лежат локально в /usr/shared_media (раздаются под /api/uploads/),
 * поэтому ничего не качаем по HTTP — читаем только заголовок (первые 64 КБ)
 * прямо с диска, целиком картинку не загружаем.
 *
 * Скрипт самодостаточный: своё подключение к БД из env, без алиасов и без Nest,
 * зависит только от prod-пакетов (typeorm, pg, dotenv, image-size).
 *
 * Запуск в окружении, где смонтирован том с загрузками:
 *   node dist/scripts/backfill-image-resolution.js
 * или в dev:
 *   npx ts-node src/scripts/backfill-image-resolution.ts
 */
import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { imageSize } from 'image-size';

config();

const UPLOADS_ROOT = '/usr/shared_media';
const URL_PREFIX = '/api/uploads/';
const HEADER_BYTES = 64 * 1024;

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_LOGIN,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [],
    synchronize: false,
});

/** URL из БД -> путь к файлу на диске (или null, если ссылка внешняя/непонятная). */
function urlToLocalPath(url: string): string | null {
    const idx = url.indexOf(URL_PREFIX);
    if (idx === -1) return null;
    const relative = url.slice(idx + URL_PREFIX.length);
    return path.join(UPLOADS_ROOT, relative);
}

/** Читает только первые HEADER_BYTES байт файла — этого хватает для размеров. */
async function readHeader(filePath: string): Promise<Buffer> {
    const fd = await fs.promises.open(filePath, 'r');
    try {
        const buffer = Buffer.alloc(HEADER_BYTES);
        const { bytesRead } = await fd.read(buffer, 0, HEADER_BYTES, 0);
        return buffer.subarray(0, bytesRead);
    } finally {
        await fd.close();
    }
}

async function main(): Promise<void> {
    await dataSource.initialize();

    const rows: Array<{ id: string; url: string }> = await dataSource.query(
        `SELECT id, url FROM files
         WHERE width IS NULL AND url IS NOT NULL AND type ILIKE 'image/%'`,
    );

    console.log(`Найдено файлов для обработки: ${rows.length}`);

    let ok = 0;
    let skipped = 0;
    let failed = 0;

    for (const row of rows) {
        const filePath = urlToLocalPath(row.url);
        if (!filePath) {
            skipped++;
            console.warn(`skip (не удалось вычислить путь): ${row.url}`);
            continue;
        }

        try {
            const header = await readHeader(filePath);
            const dims = imageSize(header);
            const orientation = (dims as { orientation?: number }).orientation;

            if (!dims.width || !dims.height) {
                skipped++;
                console.warn(`skip (не удалось прочитать размеры): ${filePath}`);
                continue;
            }

            // EXIF orientation 5-8 => фото повёрнуто, реальные стороны меняются местами
            const rotated = typeof orientation === 'number' && orientation >= 5;
            const width = rotated ? dims.height : dims.width;
            const height = rotated ? dims.width : dims.height;

            await dataSource.query(`UPDATE files SET width = $1, height = $2 WHERE id = $3`, [
                width,
                height,
                row.id,
            ]);
            ok++;
        } catch (err) {
            failed++;
            console.error(`fail: ${filePath} — ${(err as Error).message}`);
        }
    }

    console.log(`Готово. Обновлено: ${ok}, пропущено: ${skipped}, ошибок: ${failed}`);
    await dataSource.destroy();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
