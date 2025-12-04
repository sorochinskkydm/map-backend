import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationCreateAdminTokens1764862488657 implements MigrationInterface {
    name = 'MigrationCreateAdminTokens1764862488657';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "admin_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "access_token" text NOT NULL, CONSTRAINT "PK_1b8fe3dbc19bbe91baa16ab6b09" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "admin_tokens"`);
    }
}
