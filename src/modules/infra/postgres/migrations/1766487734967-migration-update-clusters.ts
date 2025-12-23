import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationUpdateClusters1766487734967 implements MigrationInterface {
    name = 'MigrationUpdateClusters1766487734967';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clusters" ADD "options" json NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clusters" DROP COLUMN "options"`);
    }
}
