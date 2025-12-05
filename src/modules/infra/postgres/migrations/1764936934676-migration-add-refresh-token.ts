import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationAddRefreshToken1764936934676 implements MigrationInterface {
    name = 'MigrationAddRefreshToken1764936934676';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_tokens" ADD "refresh_token" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_tokens" DROP COLUMN "refresh_token"`);
    }
}
