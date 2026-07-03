import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationAddImageResolution1783100000000 implements MigrationInterface {
    name = 'MigrationAddImageResolution1783100000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" ADD "width" integer`);
        await queryRunner.query(`ALTER TABLE "files" ADD "height" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "height"`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "width"`);
    }
}
