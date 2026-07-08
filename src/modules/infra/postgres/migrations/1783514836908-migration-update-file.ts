import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationUpdateFile1783514836908 implements MigrationInterface {
    name = 'MigrationUpdateFile1783514836908';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" ADD "preview_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "preview_url"`);
    }
}
