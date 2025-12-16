import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationUpdateNullable1765880328569 implements MigrationInterface {
    name = 'MigrationUpdateNullable1765880328569';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clusters" ALTER COLUMN "url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "requests" ALTER COLUMN "url" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requests" ALTER COLUMN "url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clusters" ALTER COLUMN "url" SET NOT NULL`);
    }
}
