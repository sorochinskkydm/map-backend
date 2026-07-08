/**
 * Разовый бэкфилл превью: для уже загруженных картинок без preview_url создаёт
 * облегчённую версию (тот же формат, quality=30) рядом с оригиналом и проставляет
 * preview_url в БД. Повторяет поведение FileService.upload для новых файлов.
 *
 * Запускать там, где смонтирован том с загрузками (/usr/shared_media):
 *   node dist/scripts/backfill-previews.js
 * или в dev:
 *   npx ts-node src/scripts/backfill-previews.ts
 *
 * Идемпотентно: берёт только строки с preview_url IS NULL, можно гонять повторно.
 */
import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
import {
    compressImage,
    createScriptDataSource,
    replaceFileNameInUrl,
    urlToLocalPath,
} from './lib/image-scripts';

config();

const PREVIEW_QUALITY = 30;
const PREVIEW_SUFFIX = '-preview';

const dataSource = createScriptDataSource();

async function main(): Promise<void> {
    await dataSource.initialize();

    const rows: Array<{ id: string; url: string }> = await dataSource.query(
        `SELECT id, url FROM files
         WHERE preview_url IS NULL AND url IS NOT NULL AND type ILIKE 'image/%'`,
    );

    console.log(`Картинок без превью: ${rows.length}`);

    let ok = 0;
    let skipped = 0;
    let failed = 0;

    for (const row of rows) {
        const filePath = urlToLocalPath(row.url);
        if (!filePath || !fs.existsSync(filePath)) {
            skipped++;
            console.warn(`skip (нет файла на диске): ${row.url}`);
            continue;
        }

        try {
            const extension = path.extname(filePath);
            const previewName = `${path.basename(filePath, extension)}${PREVIEW_SUFFIX}${extension}`;
            const previewPath = path.join(path.dirname(filePath), previewName);

            const buffer = await fs.promises.readFile(filePath);
            const previewBuffer = await compressImage(buffer, extension, {
                quality: PREVIEW_QUALITY,
            });
            await fs.promises.writeFile(previewPath, previewBuffer);

            const previewUrl = replaceFileNameInUrl(row.url, previewName);
            await dataSource.query(`UPDATE files SET preview_url = $1 WHERE id = $2`, [
                previewUrl,
                row.id,
            ]);
            ok++;
        } catch (err) {
            failed++;
            console.error(`fail: ${filePath} — ${(err as Error).message}`);
        }
    }

    console.log(`Готово. Создано превью: ${ok}, пропущено: ${skipped}, ошибок: ${failed}`);
    await dataSource.destroy();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
