import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationUpdateObjects1765786298552 implements MigrationInterface {
    name = 'MigrationUpdateObjects1765786298552';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "objects" ALTER COLUMN "url" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "objects" ALTER COLUMN "url" SET NOT NULL`);
    }
}
