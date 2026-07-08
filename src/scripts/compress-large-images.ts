/**
 * Разовое сжатие «тяжёлых» картинок: файлы больше MAX_SIZE (по умолчанию 1 МБ)
 * пережимаются тем же форматом (quality=COMPRESS_QUALITY, по умолчанию 80),
 * оригинал на диске перезаписывается, а size в БД обновляется.
 *
 * Перезапись только если результат реально меньше исходника (иначе картинку не трогаем).
 * Пороги настраиваются через env: COMPRESS_MAX_SIZE (байты), COMPRESS_QUALITY (1-100).
 *
 * Запускать там, где смонтирован том с загрузками (/usr/shared_media):
 *   node dist/scripts/compress-large-images.js
 * или в dev:
 *   npx ts-node src/scripts/compress-large-images.ts
 */
import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
import { compressImage, createScriptDataSource, urlToLocalPath } from './lib/image-scripts';

config();

const MAX_SIZE = Number(process.env.COMPRESS_MAX_SIZE ?? 1024 * 1024); // 1 МБ
const QUALITY = Number(process.env.COMPRESS_QUALITY ?? 80);

const dataSource = createScriptDataSource();

const toKb = (bytes: number) => (bytes / 1024).toFixed(0);

async function main(): Promise<void> {
    await dataSource.initialize();

    const rows: Array<{ id: string; url: string; size: number }> = await dataSource.query(
        `SELECT id, url, size FROM files
         WHERE size > $1 AND url IS NOT NULL AND type ILIKE 'image/%'`,
        [MAX_SIZE],
    );

    console.log(`Картинок больше ${(MAX_SIZE / 1024 / 1024).toFixed(2)} МБ: ${rows.length}`);

    let ok = 0;
    let skipped = 0;
    let failed = 0;
    let savedBytes = 0;

    for (const row of rows) {
        const filePath = urlToLocalPath(row.url);
        if (!filePath || !fs.existsSync(filePath)) {
            skipped++;
            console.warn(`skip (нет файла на диске): ${row.url}`);
            continue;
        }

        try {
            const extension = path.extname(filePath);
            const original = await fs.promises.readFile(filePath);
            const compressed = await compressImage(original, extension, { quality: QUALITY });

            if (compressed.length >= original.length) {
                skipped++;
                console.log(`skip (уже оптимально): ${filePath}`);
                continue;
            }

            await fs.promises.writeFile(filePath, compressed);
            await dataSource.query(`UPDATE files SET size = $1 WHERE id = $2`, [
                compressed.length,
                row.id,
            ]);

            savedBytes += original.length - compressed.length;
            ok++;
            console.log(`ok: ${filePath} ${toKb(original.length)}KB -> ${toKb(compressed.length)}KB`);
        } catch (err) {
            failed++;
            console.error(`fail: ${filePath} — ${(err as Error).message}`);
        }
    }

    console.log(
        `Готово. Сжато: ${ok}, пропущено: ${skipped}, ошибок: ${failed}, ` +
            `освобождено: ${(savedBytes / 1024 / 1024).toFixed(2)} МБ`,
    );
    await dataSource.destroy();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
