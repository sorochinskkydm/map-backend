import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationCreateAll1764846139514 implements MigrationInterface {
    name = 'MigrationCreateAll1764846139514';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "request_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "request_id" uuid, "file_id" uuid, CONSTRAINT "PK_6a980823e8275277139c792924f" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_7092c1bf5713f736a21b8d1bc2" ON "request_images" ("request_id", "file_id") `,
        );
        await queryRunner.query(
            `CREATE TABLE "object_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "object_id" uuid, "file_id" uuid, CONSTRAINT "PK_122270d977c69760fcc3493743f" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_f3f9913fdf01921b522e1952e7" ON "object_images" ("object_id", "file_id") `,
        );
        await queryRunner.query(
            `CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "type" character varying NOT NULL, "size" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "cluster_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cluster_id" uuid, "file_id" uuid, CONSTRAINT "PK_1e08d1a95e3f0b933bde6661535" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_ac774b571e09cd4e1ad57b9846" ON "cluster_images" ("cluster_id", "file_id") `,
        );
        await queryRunner.query(
            `CREATE TABLE "clusters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "address" character varying, "name" character varying NOT NULL, "url" character varying NOT NULL, "description" character varying NOT NULL, "sort" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_56c8e201f375e1e961dcdd6831c" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "objects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "address" character varying NOT NULL, "url" character varying NOT NULL, "description" character varying NOT NULL, "sort" integer NOT NULL DEFAULT '0', "is_visible" boolean NOT NULL DEFAULT true, "latitude" numeric, "longitude" numeric, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "category_id" uuid, "cluster_id" uuid, CONSTRAINT "UQ_a7ac54147928203fae0cb502e17" UNIQUE ("name"), CONSTRAINT "PK_87b86663af0123508099f0d970a" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "sort" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "image_id" uuid, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."requests_status_enum" AS ENUM('moderation', 'rejected', 'approved')`,
        );
        await queryRunner.query(
            `CREATE TABLE "requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organization_name" character varying NOT NULL, "author" character varying NOT NULL, "address" character varying NOT NULL, "phone_number" character varying NOT NULL, "email" character varying NOT NULL, "status" "public"."requests_status_enum" NOT NULL, "latitude" numeric, "longitude" numeric, "url" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "cluster_id" uuid, "category_id" uuid, CONSTRAINT "PK_0428f484e96f9e6a55955f29b5f" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "request_images" ADD CONSTRAINT "FK_fcc409fe85cef82e77317e0d5ed" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "request_images" ADD CONSTRAINT "FK_fc7f312ec9909af1aa500f49be1" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "object_images" ADD CONSTRAINT "FK_35e784b6e58be734aa2d75ca564" FOREIGN KEY ("object_id") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "object_images" ADD CONSTRAINT "FK_0a70628c6ee2ee387b069b56f07" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "cluster_images" ADD CONSTRAINT "FK_d0d6379f771dac01852f5a226a7" FOREIGN KEY ("cluster_id") REFERENCES "clusters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "cluster_images" ADD CONSTRAINT "FK_9064911c3b41e8c819f5db9c62d" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "objects" ADD CONSTRAINT "FK_3fabeb54123a336a47a0f02bd82" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "objects" ADD CONSTRAINT "FK_5e5c3b06559b79bd0c026f03831" FOREIGN KEY ("cluster_id") REFERENCES "clusters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "categories" ADD CONSTRAINT "FK_5336de31c6bef5b1e543d66d2bc" FOREIGN KEY ("image_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "requests" ADD CONSTRAINT "FK_a9a2e611696bf18d4cbd8a11607" FOREIGN KEY ("cluster_id") REFERENCES "clusters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "requests" ADD CONSTRAINT "FK_fe7f7a72de26bcefaa0344f7b4a" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "requests" DROP CONSTRAINT "FK_fe7f7a72de26bcefaa0344f7b4a"`,
        );
        await queryRunner.query(
            `ALTER TABLE "requests" DROP CONSTRAINT "FK_a9a2e611696bf18d4cbd8a11607"`,
        );
        await queryRunner.query(
            `ALTER TABLE "categories" DROP CONSTRAINT "FK_5336de31c6bef5b1e543d66d2bc"`,
        );
        await queryRunner.query(
            `ALTER TABLE "objects" DROP CONSTRAINT "FK_5e5c3b06559b79bd0c026f03831"`,
        );
        await queryRunner.query(
            `ALTER TABLE "objects" DROP CONSTRAINT "FK_3fabeb54123a336a47a0f02bd82"`,
        );
        await queryRunner.query(
            `ALTER TABLE "cluster_images" DROP CONSTRAINT "FK_9064911c3b41e8c819f5db9c62d"`,
        );
        await queryRunner.query(
            `ALTER TABLE "cluster_images" DROP CONSTRAINT "FK_d0d6379f771dac01852f5a226a7"`,
        );
        await queryRunner.query(
            `ALTER TABLE "object_images" DROP CONSTRAINT "FK_0a70628c6ee2ee387b069b56f07"`,
        );
        await queryRunner.query(
            `ALTER TABLE "object_images" DROP CONSTRAINT "FK_35e784b6e58be734aa2d75ca564"`,
        );
        await queryRunner.query(
            `ALTER TABLE "request_images" DROP CONSTRAINT "FK_fc7f312ec9909af1aa500f49be1"`,
        );
        await queryRunner.query(
            `ALTER TABLE "request_images" DROP CONSTRAINT "FK_fcc409fe85cef82e77317e0d5ed"`,
        );
        await queryRunner.query(`DROP TABLE "requests"`);
        await queryRunner.query(`DROP TYPE "public"."requests_status_enum"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "objects"`);
        await queryRunner.query(`DROP TABLE "clusters"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ac774b571e09cd4e1ad57b9846"`);
        await queryRunner.query(`DROP TABLE "cluster_images"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f3f9913fdf01921b522e1952e7"`);
        await queryRunner.query(`DROP TABLE "object_images"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7092c1bf5713f736a21b8d1bc2"`);
        await queryRunner.query(`DROP TABLE "request_images"`);
    }
}
