import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationCreateCategoryObjects1766753050018 implements MigrationInterface {
    name = 'MigrationCreateCategoryObjects1766753050018';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "objects" DROP CONSTRAINT "FK_3fabeb54123a336a47a0f02bd82"`,
        );
        await queryRunner.query(
            `CREATE TABLE "category_objects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sort" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "category_id" uuid, "object_id" uuid, CONSTRAINT "REL_902cc128b3b518c05f68755119" UNIQUE ("object_id"), CONSTRAINT "PK_b2dd9923b1020a88724eceff894" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`ALTER TABLE "objects" DROP COLUMN "sort"`);
        await queryRunner.query(`ALTER TABLE "objects" DROP COLUMN "category_id"`);
        await queryRunner.query(
            `ALTER TABLE "category_objects" ADD CONSTRAINT "FK_840c17bf06a939c9d69320a4eb7" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "category_objects" ADD CONSTRAINT "FK_902cc128b3b518c05f687551196" FOREIGN KEY ("object_id") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "category_objects" DROP CONSTRAINT "FK_902cc128b3b518c05f687551196"`,
        );
        await queryRunner.query(
            `ALTER TABLE "category_objects" DROP CONSTRAINT "FK_840c17bf06a939c9d69320a4eb7"`,
        );
        await queryRunner.query(`ALTER TABLE "objects" ADD "category_id" uuid`);
        await queryRunner.query(`ALTER TABLE "objects" ADD "sort" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE "category_objects"`);
        await queryRunner.query(
            `ALTER TABLE "objects" ADD CONSTRAINT "FK_3fabeb54123a336a47a0f02bd82" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }
}
